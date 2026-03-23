import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Wallet, TrendingUp, CheckCircle, ChevronRight, BookOpen, Building2 } from 'lucide-react';

const CareerDetail = () => {
  const { slug } = useParams();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareer();
  }, [slug]);

  const fetchCareer = async () => {
    try {
      const response = await api.get(`/careers/${slug}/`);
      setCareer(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (!career) return <div className="min-h-screen flex items-center justify-center">Métier non trouvé.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="inline-block px-3 py-1 bg-senegal-green/10 text-senegal-green rounded-full text-xs font-semibold mb-4">
              {career.category}
            </div>
            <h1 className="text-5xl font-extrabold mb-6">{career.name}</h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              {career.description}
            </p>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard 
              icon={<Wallet className="text-senegal-green" />}
              label="Salaire Débutant"
              value={`${career.salary_entry.toLocaleString()} FCFA`}
            />
            <StatCard 
              icon={<TrendingUp className="text-senegal-yellow" />}
              label="Demande du Marché"
              value={`${career.market_demand}/5`}
            />
            <StatCard 
              icon={<BookOpen className="text-senegal-green" />}
              label="Niveau Études"
              value={career.required_education}
            />
          </div>

          {/* Cursus Section */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <GraduationCap className="text-senegal-green" /> Cursus Académique
            </h2>
            <div className="space-y-0 relative before:absolute before:left-[31px] before:top-2 before:bottom-2 before:w-1 before:bg-slate-800">
              {career.paths?.map((path, index) => (
                <div key={path.id} className="relative pl-20 pb-12">
                  <div className="absolute left-0 top-0 w-16 h-16 bg-slate-900 border-4 border-premium-dark flex items-center justify-center rounded-2xl z-10">
                    <span className="text-xl font-bold text-senegal-green">{path.level}</span>
                  </div>
                  <div className="glass-card !p-8 group hover:bg-slate-800/40 transition-colors">
                    <h3 className="text-2xl font-bold mb-2">{path.degree_name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" /> {path.duration_years} ans</span>
                    </div>
                    <p className="text-slate-400 mb-6">{path.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {path.available_countries.map(country => (
                        <span key={country} className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-medium text-slate-300">
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Skills & Univs */}
        <div className="space-y-12">
          <section className="glass-card">
            <h3 className="text-xl font-bold mb-6 border-b border-slate-800 pb-4">Compétences Clés</h3>
            <div className="space-y-4">
              {career.skills?.map(skill => (
                <div key={skill} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-senegal-green/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-senegal-green" />
                  </div>
                  <span className="text-slate-300 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card bg-gradient-to-br from-senegal-green/5 to-transparent border-senegal-green/20">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-senegal-green" /> Où étudier ?
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Nous avons sélectionné les meilleures universités pour ce métier au Sénégal et à l'étranger.
            </p>
            <div className="space-y-4">
               <Link to="/universities" className="w-full py-3 bg-senegal-green text-white font-bold rounded-xl flex items-center justify-center gap-2">
                  Voir les universités <ChevronRight className="w-5 h-5" />
               </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="glass-card !p-6 flex items-start gap-4">
    <div className="p-3 bg-slate-800 rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  </div>
);

export default CareerDetail;
