import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUser, useClerk } from '@clerk/clerk-react';
import { fetchTodos, addTodo } from '../redux/todoSlice.js';
import { fetchSections, addSection } from '../redux/sectionSlice.js';
import api from '../services/api.js';
import Navbar from '../components/Navbar.jsx';
import SectionCard from '../components/SectionCard.jsx';
import TodoItem from '../components/TodoItem.jsx';
import AddTodoModal from '../modals/AddTodoModal.jsx';
import EditModal from '../modals/EditModal.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user, isLoaded, getToken } = useUser();
  const { items: todos } = useSelector((state) => state.todos);
  const { items: sections } = useSelector((state) => state.sections);
  
  const [mainTodo, setMainTodo] = useState('');
  const [sectionTitle, setSectionTitle] = useState('');
  const [modalState, setModalState] = useState({ type: null, data: null });

  useEffect(() => {
    const init = async () => {
      if (isLoaded && user) {
        dispatch(fetchTodos());
        dispatch(fetchSections());
      }
    };
    init();
  }, [isLoaded, user, getToken, dispatch]);

  const handleAddMainTodo = () => {
    if (!mainTodo.trim()) return toast.error("Title required");
    dispatch(addTodo({ title: mainTodo }));
    setMainTodo('');
  };

  const handleAddSection = () => {
    if (!sectionTitle.trim()) return toast.error("Title required");
    dispatch(addSection(sectionTitle));
    setSectionTitle('');
  };

  const mainTodos = todos.filter(t => !t.sectionId);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* Section 1: Main Todos */}
        <div className="mb-8 bg-card p-6 rounded-xl shadow-sm border border-light">
          <h2 className="text-xl font-bold text-dark mb-4">Main Todos</h2>
          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={mainTodo}
              onChange={(e) => setMainTodo(e.target.value)}
              placeholder="Add Main Todo"
              className="flex-1 p-3 border border-light rounded-lg focus:outline-none focus:border-primary"
            />
            <button onClick={handleAddMainTodo} className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition font-medium">Add</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mainTodos.map(todo => <TodoItem key={todo._id} todo={todo} onEdit={(t) => setModalState({ type: 'edit-todo', data: t })} />)}
          </div>
        </div>

        {/* Section 2: Sections */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-light">
          <h2 className="text-xl font-bold text-dark mb-4">Task Sections</h2>
          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Create New Section"
              className="flex-1 p-3 border border-light rounded-lg focus:outline-none focus:border-primary"
            />
            <button onClick={handleAddSection} className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition font-medium">Create Section</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map(sec => <SectionCard key={sec._id} section={sec} onAddTodo={(id) => setModalState({ type: 'add-todo', data: { sectionId: id } })} onEditSection={(s) => setModalState({ type: 'edit-section', data: s })} onEditTodo={(t) => setModalState({ type: 'edit-todo', data: t })} />)}
          </div>
        </div>

      </div>

      {modalState.type === 'add-todo' && <AddTodoModal sectionId={modalState.data.sectionId} onClose={() => setModalState({})} />}
      {modalState.type === 'edit-todo' && <EditModal type="todo" data={modalState.data} onClose={() => setModalState({})} />}
      {modalState.type === 'edit-section' && <EditModal type="section" data={modalState.data} onClose={() => setModalState({})} />}
      
      <ToastContainer position="bottom-right" />
    </div>
  );
}