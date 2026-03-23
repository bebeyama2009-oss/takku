import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { motion } from 'framer-motion';
import { Trophy, Building2, MapPin, Calendar, CheckSquare, ExternalLink, GraduationCap, DollarSign, Info } from 'lucide-react';

const ScholarshipDetail = () => {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScholarship();
  }, [id]);

  const fetchScholarship = async () => {
    try {
      const response = await api.get(`/scholarships/${id}/`);
      setScholarship(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (!scholarship) return <div className="min-h-screen flex items-center justify-center">Bourse non trouvée.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="glass-card !p-0 overflow-hidden border-senegal-yellow/30 bg-gradient-to-b from-senegal-yellow/5 to-transparent">
         <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-senegal-yellow/20 rounded-2xl flex items-center justify-center text-senegal-yellow">
                     <Trophy className="w-10 h-10" />
                  </div>
                  <div>
                     <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 inline-block">
                        {scholarship.level}
                     </span>
                     <h1 className="text-4xl font-extrabold leading-tight">{scholarship.name}</h1>
                  </div>
               </div>
               <a 
                 href={scholarship.application_link} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="btn-primary !bg-senegal-yellow !text-slate-900 flex items-center gap-2"
               >
                  Postuler maintenant <ExternalLink className="w-5 h-5" />
               </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-slate-800/50 mb-12">
               <div className="flex flex-col items-center text-center">
                  <Building2 className="text-senegal-green w-6 h-6 mb-2" />
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Organisme</p>
                  <p className="font-bold">{scholarship.provider}</p>
               </div>
               <div className="flex flex-col items-center text-center border-x border-slate-800/50">
                  <MapPin className="text-senegal-green w-6 h-6 mb-2" />
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Pays</p>
                  <p className="font-bold">{scholarship.country_name}</p>
               </div>
               <div className="flex flex-col items-center text-center">
                  <Calendar className="text-senegal-green w-6 h-6 mb-2" />
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Date Limite</p>
                  <p className="font-bold">{scholarship.deadline || 'Non spécifié'}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="space-y-8">
                  <section>
                     <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Info className="text-senegal-yellow" /> Critères d'Éligibilité
                     </h2>
                     <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                        <p className="text-slate-100 whitespace-pre-line leading-relaxed">
                           {scholarship.eligibility_criteria}
                        </p>
                     </div>
                  </section>
                  
                  <section>
                     <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <DollarSign className="text-senegal-green" /> Couverture Financière
                     </h2>
                     <div className="p-6 bg-senegal-green/5 rounded-2xl border border-senegal-green/20">
                        <p className="text-slate-100 font-medium"> 
                           Type de couverture: <span className="text-senegal-green font-bold">{scholarship.coverage_type}</span>
                        </p>
                        <p className="mt-4 text-slate-400 text-sm italic">
                           * Les montants exacts peuvent varier selon le profil et l'établissement d'accueil.
                        </p>
                     </div>
                  </section>
               </div>

               <div className="space-y-8">
                  <section>
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                         <GraduationCap className="text-senegal-yellow" /> Domaines d'Études
                      </h2>
                      <div className="flex flex-wrap gap-3">
                         {scholarship.fields_covered?.map(field => (
                            <span key={field} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 transition-colors rounded-xl text-sm font-semibold border border-slate-700">
                               {field}
                            </span>
                         ))}
                      </div>
                  </section>

                  <section className="p-8 bg-slate-900 rounded-3xl border border-slate-800">
                     <h3 className="text-xl font-bold mb-6">Documents Requis</h3>
                     <div className="space-y-4">
                        {['Diplômes & Relevés de notes', 'Lettre de Motivation', 'CV actualisé', 'Lettres de Recommendation'].map(doc => (
                           <div key={doc} className="flex items-center gap-3">
                              <CheckSquare className="text-senegal-green w-5 h-5" />
                              <span className="text-slate-300 font-medium">{doc}</span>
                           </div>
                        ))}
                     </div>
                  </section>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ScholarshipDetail;
