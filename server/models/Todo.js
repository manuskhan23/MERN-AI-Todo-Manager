import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Testing', 'Completed'], default: 'Pending' },
}, { timestamps: true });

export default mongoose.model('Todo', todoSchema);