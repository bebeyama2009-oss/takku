import { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Share2, Plus, Filter, Calendar, MapPin, Loader2, Link as LinkIcon, Send } from 'lucide-react';

const OpportunitiesFeed = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await api.get('/opportunities/');
      setOpportunities(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    if (!user) return alert('Connectez-vous pour liker !');
    try {
      await api.post(`/opportunities/${id}/like/`);
      fetchOpportunities(); // Refresh to update like status
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gradient">Fil d'Opportunités</h1>
          <p className="text-slate-400 mt-2">Partage et découvre des concours, stages et bourses communautaires.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Partager
        </button>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => <div key={i} className="glass-card h-48 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {opportunities.map((opp, index) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card hover:border-senegal-green/30 transition-all border-l-4 border-l-senegal-green"
            >
              <div className="flex items-start justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-senegal-green font-bold">
                       {opp.posted_by_detail?.username?.[0].toUpperCase()}
                    </div>
                    <div>
                       <p className="font-bold text-sm">{opp.posted_by_detail?.username}</p>
                       <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-none block mt-1">{opp.type}</span>
                    </div>
                 </div>
                 {opp.deadline && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold">
                       <Calendar className="w-3.5 h-3.5" /> J-{Math.max(0, Math.ceil((new Date(opp.deadline) - new Date()) / (1000 * 60 * 60 * 24)))}
                    </div>
                 )}
              </div>

              <h2 className="text-xl font-bold mb-3">{opp.title}</h2>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                 {opp.description}
              </p>

              {opp.link && (
                 <a href={opp.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-senegal-green mb-8 px-3 py-1.5 bg-senegal-green/10 rounded-lg hover:bg-senegal-green/20 transition-all">
                    Lien vers l'opportunité <LinkIcon className="w-3 h-3" />
                 </a>
              )}

              <div className="flex items-center gap-6 pt-6 border-t border-slate-800">
                 <button 
                   onClick={() => handleLike(opp.id)}
                   className={`flex items-center gap-2 text-sm font-medium transition-colors ${opp.is_liked ? 'text-senegal-red' : 'text-slate-400 hover:text-white'}`}
                 >
                    <Heart className={`w-5 h-5 ${opp.is_liked ? 'fill-current' : ''}`} /> {opp.likes_count}
                 </button>
                 <button className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                    <MessageSquare className="w-5 h-5" /> Répondre
                 </button>
                 <button className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors ml-auto">
                    <Share2 className="w-5 h-5" />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Post Opportunity Modal */}
      <AnimatePresence>
         {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="glass-card w-full max-w-lg relative"
               >
                  <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">✕</button>
                  <h3 className="text-2xl font-bold mb-8">Partager une opportunité</h3>
                  <OpportunityForm close={() => { setShowModal(false); fetchOpportunities(); }} />
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

const OpportunityForm = ({ close }) => {
   const [form, setForm] = useState({ title: '', description: '', type: 'CONCOURS', link: '', deadline: '' });
   const [loading, setLoading] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         await api.post('/opportunities/', form);
         close();
      } catch (err) {
         console.error(err);
         alert("Une erreur est survenue.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Titre</label>
            <input 
               autoFocus
               value={form.title} 
               onChange={e => setForm({...form, title: e.target.value})}
               className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" 
               placeholder="Ex: Concours d'entrée à l'EPT"
               required 
            />
         </div>
         <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Type</label>
               <select 
                  value={form.type} 
                  onChange={e => setForm({...form, type: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
               >
                  <option value="CONCOURS">Concours</option>
                  <option value="BOURSE">Bourse</option>
                  <option value="STAGE">Stage</option>
                  <option value="PROGRAM">Programme</option>
               </select>
            </div>
            <div>
               <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Date Limite</label>
               <input 
                  type="date"
                  value={form.deadline} 
                  onChange={e => setForm({...form, deadline: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-400" 
               />
            </div>
         </div>
         <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Lien (optionnel)</label>
            <input 
               value={form.link} 
               onChange={e => setForm({...form, link: e.target.value})}
               className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" 
               placeholder="https://..."
            />
         </div>
         <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Description</label>
            <textarea 
               value={form.description} 
               onChange={e => setForm({...form, description: e.target.value})}
               className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 h-32" 
               placeholder="Décris brièvement l'opportunité et les conditions d'accès..."
               required 
            />
         </div>
         <button disabled={loading} className="w-full btn-primary mt-4 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <><Send className="w-4 h-4" /> Publier</>}
         </button>
      </form>
   );
};

export default OpportunitiesFeed;
