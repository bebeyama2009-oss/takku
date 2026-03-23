import { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Heart, CheckCircle, Clock, ChevronRight, User, Star, Award, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [favRes, eventRes] = await Promise.all([
        api.get('/favorites/'),
        api.get('/calendar/')
      ]);
      setFavorites(favRes.data);
      setEvents(eventRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <div>
           <h1 className="text-4xl font-extrabold flex items-center gap-3">
              Salut, {user?.first_name || user?.username} ! <span className="text-3xl">👋</span>
           </h1>
           <p className="text-slate-400 mt-2">Bienvenue sur ton centre de pilotage Takku Avenir.</p>
        </div>
        <Link to="/orientation" className="btn-primary !py-2.5 !px-6 text-sm flex items-center gap-2">
           Refaire le test <Clock className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle Column */}
        <div className="lg:col-span-2 space-y-8">
           {/* Section: Favorites */}
           <section>
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Heart className="text-senegal-red w-6 h-6" /> Mes Favoris
                 </h2>
                 <Link to="/favorites" className="text-sm text-senegal-green font-bold">Voir tout</Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {favorites.length > 0 ? (
                    favorites.slice(0, 4).map(fav => (
                       <div key={fav.id} className="glass-card group flex items-center gap-4 hover:border-senegal-green/30 transition-all">
                          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-senegal-green">
                             {fav.content_type === 'career' ? <BookOpen className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                          </div>
                          <div className="flex-grow">
                             <h4 className="font-bold text-sm">{fav.object_details?.name || 'Élément sauvegardé'}</h4>
                             <p className="text-xs text-slate-500 uppercase tracking-tighter">{fav.content_type}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 group-hover:text-senegal-green transition-all" />
                       </div>
                    ))
                 ) : (
                    <div className="col-span-2 py-12 text-center glass-card bg-slate-800/20 border-dashed">
                       <p className="text-slate-500 mb-4 text-sm font-medium italic">Aucun favori pour le moment.</p>
                       <Link to="/careers" className="text-senegal-green text-sm font-bold hover:underline">Explorer le catalogue</Link>
                    </div>
                 )}
              </div>
           </section>

           {/* Section: Progress / Checklist */}
           <section className="glass-card bg-gradient-to-br from-senegal-green/10 via-transparent to-transparent border-senegal-green/20">
              <h2 className="text-2xl font-bold mb-6">Progression Admission</h2>
              <div className="space-y-6">
                 <ProgressItem label="Compléter le test d'orientation" status={true} />
                 <ProgressItem label="Sauvegarder au moins 3 métiers" status={favorites.length >= 3} />
                 <ProgressItem label="Consulter les dates de concours" status={false} />
                 <ProgressItem label="Préparer le dossier Campusen" status={false} />
              </div>
           </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
           {/* Section: Calendar */}
           <section className="glass-card">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <CalendarIcon className="text-senegal-yellow w-5 h-5" /> Agenda
              </h2>
              <div className="space-y-4">
                 {events.length > 0 ? (
                    events.map(event => (
                       <div key={event.id} className="flex gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                          <div className="text-center">
                             <span className="text-xs font-bold text-senegal-yellow block uppercase">MAI</span>
                             <span className="text-2xl font-black">15</span>
                          </div>
                          <div className="flex-grow">
                             <h5 className="font-bold text-sm leading-tight">{event.title}</h5>
                             <p className="text-xs text-slate-500 mt-1">{event.event_type}</p>
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="py-8 text-center border-t border-slate-800">
                       <p className="text-slate-500 text-xs italic">Aucun événement prévu.</p>
                       <button className="mt-4 text-xs font-bold text-senegal-green">+ Ajouter un rappel</button>
                    </div>
                 )}
              </div>
           </section>

           {/* Section: Profile Preview */}
           <section className="glass-card relative overflow-hidden">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-senegal-green to-senegal-yellow items-center justify-center flex font-bold text-2xl border-4 border-slate-800">
                    {user?.username?.[0].toUpperCase()}
                 </div>
                 <div>
                    <h3 className="font-bold">{user?.first_name} {user?.last_name}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{user?.grade || 'Profil étudiant'}</p>
                 </div>
              </div>
              <Link to="/profile" className="w-full py-2.5 bg-slate-800 rounded-xl text-center text-sm font-bold block hover:bg-slate-700 transition-colors">
                 Modifier le profil
              </Link>
           </section>
        </div>
      </div>
    </div>
  );
};

const ProgressItem = ({ label, status }) => (
  <div className="flex items-center gap-4">
     <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${status ? 'bg-senegal-green text-white' : 'border-2 border-slate-700 text-slate-700'}`}>
        <CheckCircle className="w-4 h-4" />
     </div>
     <span className={`text-sm font-medium ${status ? 'text-white' : 'text-slate-500 italic'}`}>{label}</span>
  </div>
);

export default Dashboard;
