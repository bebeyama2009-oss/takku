import { Link } from 'react-router-dom';
import { GraduationCap, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-premium-dark/80 backdrop-blur-lg border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-senegal-green rounded-lg group-hover:rotate-12 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                TAKKU <span className="text-senegal-green">AVENIR</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/careers" className="hover:text-senegal-green transition-colors px-3 py-2 text-sm font-medium">Métiers</Link>
              <Link to="/universities" className="hover:text-senegal-green transition-colors px-3 py-2 text-sm font-medium">Universités</Link>
              <Link to="/scholarships" className="hover:text-senegal-green transition-colors px-3 py-2 text-sm font-medium">Bourses</Link>
              <Link to="/opportunities" className="hover:text-senegal-green transition-colors px-3 py-2 text-sm font-medium">Opportunités</Link>
              
              {user ? (
                <div className="flex items-center gap-4 ml-4">
                  <Link to="/dashboard" className="flex items-center gap-2 hover:text-senegal-green transition-all">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{user.first_name || user.username}</span>
                  </Link>
                  <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="px-5 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 transition-all font-medium text-sm">Connexion</Link>
                  <Link to="/register" className="btn-primary flex items-center gap-2 !py-2 !px-5 text-sm">
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-400">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-premium-dark border-b border-slate-700 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/careers" className="block px-3 py-2 hover:bg-slate-800 rounded-md">Métiers</Link>
            <Link to="/universities" className="block px-3 py-2 hover:bg-slate-800 rounded-md">Universités</Link>
            <Link to="/scholarships" className="block px-3 py-2 hover:bg-slate-800 rounded-md">Bourses</Link>
            <Link to="/opportunities" className="block px-3 py-2 hover:bg-slate-800 rounded-md">Opportunités</Link>
            <div className="pt-4 flex flex-col gap-2">
              <Link to="/login" className="w-full text-center py-2 border border-slate-700 rounded-lg">Connexion</Link>
              <Link to="/register" className="w-full text-center py-2 bg-senegal-green rounded-lg">S'inscrire</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
