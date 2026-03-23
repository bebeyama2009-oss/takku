import { useState, useEffect } from 'react';
import api from '../api/client';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, ChevronRight, Globe, School } from 'lucide-react';
import { motion } from 'framer-motion';

const UniversitiesList = () => {
  const [universities, setUniversities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [uniRes, countryRes] = await Promise.all([
        api.get('/universities/'),
        api.get('/countries/')
      ]);
      setUniversities(uniRes.data);
      setCountries(countryRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUnis = universities.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          uni.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'ALL' || uni.country_name === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Universités & Grandes Écoles</h1>
          <p className="text-slate-400">Trouve l'établissement idéal pour ton futur cursus au Sénégal ou à l'international.</p>
        </div>
        
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Rechercher une ville, une école..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-senegal-green transition-all"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCountry('ALL')}
          className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-all border ${selectedCountry === 'ALL' ? 'bg-senegal-green border-senegal-green text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}
        >
          Tous les pays
        </button>
        {countries.map(country => (
          <button
            key={country.id}
            onClick={() => setSelectedCountry(country.name)}
            className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-all border flex items-center gap-2 ${selectedCountry === country.name ? 'bg-senegal-green border-senegal-green text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}
          >
            <span>{country.flag_emoji}</span> {country.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card h-72 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUnis.map((uni, index) => (
            <motion.div
              key={uni.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/universities/${uni.id}`} className="glass-card group block h-full hover:border-senegal-green/50 transition-all flex flex-col">
                <div className="relative h-40 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-2xl bg-slate-800">
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent flex items-end p-6">
                      <span className="px-3 py-1 bg-senegal-green rounded-lg text-xs font-bold text-white uppercase tracking-wider">
                         {uni.type}
                      </span>
                   </div>
                   <div className="w-full h-full flex items-center justify-center">
                      <School className="w-16 h-16 text-slate-700" />
                   </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 line-clamp-1">{uni.name}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                   <MapPin className="w-4 h-4 text-senegal-green" />
                   <span>{uni.city}, {uni.country_name}</span>
                </div>
                
                <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex -space-x-2">
                     <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">L</div>
                     <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">M</div>
                     <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">D</div>
                  </div>
                  <div className="flex items-center gap-1 text-senegal-green font-bold text-sm">
                    Découvrir <ChevronRight className="w-4 h-4" />
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

export default UniversitiesList;
