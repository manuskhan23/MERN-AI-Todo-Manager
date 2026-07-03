import Todo from '../models/Todo.js';

export const getTodos = async (req, res) => {
  const todos = await Todo.find({ userId: req.user._id });
  res.json(todos);
};

export const createTodo = async (req, res) => {
  const { title, sectionId } = req.body;
  const todo = await Todo.create({ title, sectionId: sectionId || null, userId: req.user._id });
  res.status(201).json(todo);
};

export const updateTodo = async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { title: req.body.title },
    { new: true }
  );
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.json(todo);
};

export const deleteTodo = async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.json({ message: 'Todo removed' });
};

export const updateTodoStatus = async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id });
  if (!todo) return res.status(404).json({ message: 'Todo not found' });

  const statuses = ['Pending', 'In Progress', 'Testing', 'Completed'];
  const currentIndex = statuses.indexOf(todo.status);
  const nextStatus = statuses[(currentIndex + 1) % statuses.length];
  
  todo.status = nextStatus;
  await todo.save();
  res.json(todo);
};