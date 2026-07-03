export default function ChatMessage({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`flex gap-4 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">AI</div>}
      <div className={`max-w-2xl p-4 rounded-xl ${isUser ? 'bg-primary text-white' : 'bg-bg text-dark border border-light'}`}>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
      {isUser && <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center">U</div>}
    </div>
  );
}