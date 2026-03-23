import { useState, useEffect } from 'react';
import api from '../api/client';
import { Link } from 'react-router-dom';
import { Search, Filter, GraduationCap, ChevronRight, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const CareersList = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await api.get('/careers/');
      setCareers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || career.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'ALL', name: 'Tous' },
    { id: 'SANTE', name: 'Santé' },
    { id: 'TECH', name: 'Technologie' },
    { id: 'COMMERCE', name: 'Commerce' },
    { id: 'DROIT', name: 'Droit' },
    { id: 'INGENIERIE', name: 'Ingénierie' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Catalogue des Métiers</h1>
          <p className="text-slate-400">Explore les opportunités professionnelles et les cursus associés.</p>
        </div>
        
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Rechercher un métier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-senegal-green transition-all"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-all border ${selectedCategory === cat.id ? 'bg-senegal-green border-senegal-green text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCareers.map((career, index) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/careers/${career.slug}`} className="glass-card group block h-full hover:border-senegal-green/50 transition-all">
                <div className="w-12 h-12 bg-senegal-green/10 rounded-xl flex items-center justify-center mb-6 text-senegal-green group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{career.name}</h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-3">
                  {career.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-800">
                  <span className="text-xs font-semibold px-3 py-1 bg-slate-800 rounded-full text-slate-300">
                    {career.category}
                  </span>
                  <div className="flex items-center gap-1 text-senegal-green font-bold text-sm">
                    Voir détails <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareersList;
