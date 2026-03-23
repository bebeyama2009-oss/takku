import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, Loader2, School } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'STUDENT'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError('Erreur lors de l\'inscription. Veuillez vérifier vos informations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-senegal-green/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-senegal-green" />
            </div>
            <h2 className="text-3xl font-bold">Rejoins l'aventure</h2>
            <p className="text-slate-400 mt-2">Crée ton compte et commence à construire ton avenir</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" 
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-senegal-green transition-all"
                    placeholder="Moussa"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" 
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-senegal-green transition-all"
                    placeholder="Diop"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Nom d'utilisateur</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-senegal-green transition-all"
                  placeholder="moussa_diop"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-senegal-green transition-all"
                  placeholder="moussa@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-senegal-green transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Rôle</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: 'STUDENT'})}
                  className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.role === 'STUDENT' ? 'bg-senegal-green/20 border-senegal-green border-2' : 'bg-slate-800/50 border-slate-700'}`}
                >
                  <School className="w-5 h-5" /> Étudiant
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: 'TEACHER'})}
                  className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.role === 'TEACHER' ? 'bg-senegal-green/20 border-senegal-green border-2' : 'bg-slate-800/50 border-slate-700'}`}
                >
                   Enseignant
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Créer mon compte'}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400">
            Déjà inscrit ? {' '}
            <Link to="/login" className="text-senegal-green hover:underline font-semibold">Se connecter</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
