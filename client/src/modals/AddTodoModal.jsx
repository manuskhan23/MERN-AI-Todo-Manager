import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../redux/todoSlice.js';

export default function AddTodoModal({ sectionId, onClose }) {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (!title.trim()) return;
    dispatch(addTodo({ title, sectionId }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-card p-6 rounded-xl shadow-xl w-full max-w-md border-t-4 border-primary">
        <h3 className="text-xl font-bold mb-4">Add Todo</h3>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          className="w-full p-3 border border-light rounded mb-4 focus:outline-none focus:border-primary"
          placeholder="Todo title"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-secondary hover:bg-bg rounded">Cancel</button>
          <button onClick={handleSubmit} className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-hover">Create</button>
        </div>
      </div>
    </div>
  );
}