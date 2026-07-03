import { FaEdit, FaTrash, FaArrowRight } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { deleteTodo, updateTodoStatus } from '../redux/todoSlice.js';

const statusStyles = {
  'Pending': 'bg-gray-200 text-gray-700',
  'In Progress': 'bg-blue-200 text-blue-700',
  'Testing': 'bg-orange-200 text-orange-700',
  'Completed': 'bg-green-200 text-green-700 line-through'
};

export default function TodoItem({ todo, onEdit }) {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between p-3 mb-2 bg-white rounded shadow-sm hover:shadow-md transition group">
      <span className={`text-dark ${todo.status === 'Completed' ? 'line-through text-secondary' : ''}`}>{todo.title}</span>
      <div className="flex items-center gap-3">
        <span className={`text-xs px-2 py-1 rounded ${statusStyles[todo.status]}`}>{todo.status}</span>
        <button onClick={() => dispatch(updateTodoStatus(todo._id))} className="text-primary hover:bg-light p-2 rounded transition" title="Next Status">
          <FaArrowRight size={14} />
        </button>
        <button onClick={() => onEdit(todo)} className="text-secondary hover:bg-light p-2 rounded transition opacity-0 group-hover:opacity-100">
          <FaEdit size={14} />
        </button>
        <button onClick={() => dispatch(deleteTodo(todo._id))} className="text-red-500 hover:bg-red-100 p-2 rounded transition opacity-0 group-hover:opacity-100">
          <FaTrash size={14} />
        </button>
      </div>
    </div>
  );
}