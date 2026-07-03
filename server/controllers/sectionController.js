import Section from '../models/Section.js';
import Todo from '../models/Todo.js';

export const getSections = async (req, res) => {
  const sections = await Section.find({ userId: req.user._id });
  res.json(sections);
};

export const createSection = async (req, res) => {
  const { title } = req.body;
  const section = await Section.create({ title, userId: req.user._id });
  res.status(201).json(section);
};

export const updateSection = async (req, res) => {
  const section = await Section.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { title: req.body.title },
    { new: true }
  );
  if (!section) return res.status(404).json({ message: 'Section not found' });
  res.json(section);
};

export const deleteSection = async (req, res) => {
  const section = await Section.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!section) return res.status(404).json({ message: 'Section not found' });
  // Cascade delete todos
  await Todo.deleteMany({ sectionId: section._id });
  res.json({ message: 'Section removed' });
};