import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSection } from '../redux/sectionSlice.js';
import TodoItem from './TodoItem.jsx';

export default function SectionCard({ section, onAddTodo, onEditSection, onEditTodo }) {
  const dispatch = useDispatch();
  const { items: todos } = useSelector((state) => state.todos);
  const sectionTodos = todos.filter(t => t.sectionId === section._id);

  return (
    <div className="bg-card p-4 rounded-xl shadow-sm border border-light flex flex-col">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-bg">
        <h3 className="font-bold text-dark">{section.title}</h3>
        <div className="flex gap-2">
          <button onClick={() => onAddTodo(section._id)} className="bg-primary text-white p-2 rounded hover:bg-primary-hover transition text-sm"><FaPlus /></button>
          <button onClick={() => onEditSection(section)} className="text-secondary p-2 hover:bg-bg rounded transition text-sm"><FaEdit /></button>
          <button onClick={() => dispatch(deleteSection(section._id))} className="text-red-500 p-2 hover:bg-red-100 rounded transition text-sm"><FaTrash /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto max-h-96">
        {sectionTodos.length === 0 ? (
          <p className="text-secondary text-sm text-center py-4">No todos yet</p>
        ) : (
          sectionTodos.map(todo => <TodoItem key={todo._id} todo={todo} onEdit={onEditTodo} />)
        )}
      </div>
    </div>
  );
}