import AIChat from '../models/AIChat.js';
import Message from '../models/Message.js';
import Section from '../models/Section.js';
import Todo from '../models/Todo.js';
import { groqClient } from '../utils/groqClient.js';
import { buildSystemPrompt } from '../utils/systemPrompt.js';

// Chats
export const getChats = async (req, res) => {
  const chats = await AIChat.find({ userId: req.user._id }).sort({ updatedAt: -1 });
  res.json(chats);
};

export const createChat = async (req, res) => {
  const chat = await AIChat.create({ userId: req.user._id, title: 'New Chat' });
  res.status(201).json(chat);
};

export const renameChat = async (req, res) => {
  const chat = await AIChat.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { title: req.body.title },
    { new: true }
  );
  if (!chat) return res.status(404).json({ message: 'Chat not found' });
  res.json(chat);
};

export const deleteChat = async (req, res) => {
  const chat = await AIChat.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!chat) return res.status(404).json({ message: 'Chat not found' });
  await Message.deleteMany({ chatId: chat._id });
  res.json({ message: 'Chat deleted' });
};

// Messages
export const getMessages = async (req, res) => {
  // Security: Ensure the user owns the chat they are trying to access.
  const chat = await AIChat.findOne({ _id: req.params.id, userId: req.user._id });
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found or you do not have permission to view it.' });
  }

  const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 });
  return res.json(messages);
};

export const sendMessage = async (req, res) => {
  const { content } = req.body;
  const { id: chatId } = req.params;

  const chat = await AIChat.findOne({ _id: chatId, userId: req.user._id });
  if (!chat) return res.status(404).json({ message: 'Chat not found' });

  // Build context
  const history = await Message.find({ chatId }).sort({ createdAt: 1 });
  const systemPrompt = await buildSystemPrompt(req.user, history);
  
  // Prepare Groq payload
  const messagesPayload = [
    { role: 'system', content: systemPrompt },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: content } // Add the new user message to the payload
  ];

  try {
     const aiResponse = await groqClient.chat.completions.create({
      messages: messagesPayload,
      model: 'llama-3.3-70b-versatile', 
    });

    const aiContent = aiResponse.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    // --- Transaction-like behavior: Save messages only on success ---
    // 1. Save user message
    const userMessage = await Message.create({ chatId, role: 'user', content });

    // 2. Save AI response
    const aiMessage = await Message.create({ chatId, role: 'assistant', content: aiContent });

    // 3. Update chat title if it's a new chat
    if (chat.title === 'New Chat') {
      chat.title = content.substring(0, 30);
      await chat.save();
    }
    
    // Send back both the user's message and the AI's response
    res.status(201).json([userMessage, aiMessage]);

  } catch (error) {
    console.error("AI request failed:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Sorry, the AI is having trouble responding right now.' });
  }
};