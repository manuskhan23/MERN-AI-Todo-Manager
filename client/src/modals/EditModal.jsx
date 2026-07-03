import { useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../services/api.js';
import { fetchTodos } from '../redux/todoSlice.js';

export default function EditModal({ type, data, onClose }) {
  const [title, setTitle] = useState(data.title);
  const dispatch = useDispatch();

  const handleUpdate = async () => {
    const endpoint = type === 'todo' ? `/todos/${data._id}` : `/sections/${data._id}`;
    await api.put(endpoint, { title });
    // Simple refetch for reliability
    if (type === 'todo') dispatch({ type: 'todos/fetchTodos' }); // Note: unconventional, better to use async thunk
    window.location.reload(); // Quick hack for state refresh in this boilerplate
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-xl shadow-xl w-full max-w-md border-t-4 border-primary">
        <h3 className="text-xl font-bold mb-4">Edit {type}</h3>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-light rounded mb-4 focus:outline-none focus:border-primary"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-secondary hover:bg-bg rounded">Cancel</button>
          <button onClick={handleUpdate} className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-hover">Update</button>
        </div>
      </div>
    </div>
  );
}