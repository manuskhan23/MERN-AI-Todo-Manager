import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { FaRobot } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="bg-card shadow-sm p-4 flex justify-between items-center rounded-b-xl sticky top-0 z-50">
      <h1 className="text-xl font-bold text-primary">Advanced Todo Manager</h1>
      <div className="flex items-center gap-4">
        <Link to="/ai-chat" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition">
          <FaRobot /> AI Assistant
        </Link>
        {/* The UserButton provides a pre-built UI for account management and sign-out */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}