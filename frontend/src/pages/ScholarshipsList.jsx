import { useState, useEffect } from 'react';
import api from '../api/client';
import { Link } from 'react-router-dom';
import { Search, Trophy, Calendar, MapPin, ChevronRight, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ScholarshipsList = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  useEffect(() => {
    fetchScholarships();
  }, [selectedLevel]);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const url = selectedLevel === 'ALL' ? '/scholarships/' : `/scholarships/?level=${selectedLevel}`;
      const response = await api.get(url);
      setScholarships(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredScholarships = scholarships.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const levels = [
    { id: 'ALL', name: 'Tous les niveaux' },
    { id: 'LICENSE', name: 'Licence' },
    { id: 'MASTER', name: 'Master' },
    { id: 'DOCTORAT', name: 'Doctorat' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 text-gradient">Bourses d'Études</h1>
          <p className="text-slate-400">Finance tes études grâce à notre sélection de bourses nationales et internationales.</p>
        </div>
        
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Rechercher par organisme, titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-senegal-green transition-all"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {levels.map(lvl => (
          <button
            key={lvl.id}
            onClick={() => setSelectedLevel(lvl.id)}
            className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-all border ${selectedLevel === lvl.id ? 'bg-senegal-green border-senegal-green text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}
          >
            {lvl.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-card h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredScholarships.map((s, index) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/scholarships/${s.id}`} className="glass-card group block h-full hover:border-senegal-yellow/50 border-l-4 border-l-senegal-yellow transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-senegal-yellow/10 rounded-xl flex items-center justify-center text-senegal-yellow">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 bg-slate-800 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {s.level}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-2 group-hover:text-senegal-yellow transition-colors">{s.name}</h3>
                <p className="text-senegal-green font-semibold text-sm mb-6 flex items-center gap-1">
                   <Building2 className="w-4 h-4" /> {s.provider}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <MapPin className="w-4 h-4" /> {s.country_name}
                   </div>
                   <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Calendar className="w-4 h-4" /> Limite: {s.deadline || 'A consulter'}
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-senegal-yellow font-bold text-sm">
                    En savoir plus <ChevronRight className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-500 italic">Posté il y a 2 jours</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScholarshipsList;
