import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { motion } from 'framer-motion';
import { MapPin, Building2, Globe, Mail, Phone, Calendar, DollarSign, ChevronRight, CheckCircle2, Award } from 'lucide-react';

const UniversityDetail = () => {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUniversity();
  }, [id]);

  const fetchUniversity = async () => {
    try {
      const response = await api.get(`/universities/${id}/`);
      setUniversity(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (!university) return <div className="min-h-screen flex items-center justify-center">Université non trouvée.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Header & Main Info */}
        <div className="lg:col-span-2 space-y-12">
          <section className="relative p-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5">
                <Building2 className="w-64 h-64" />
             </div>
             <div className="relative z-10">
                <span className="px-4 py-1.5 bg-senegal-green rounded-xl text-xs font-bold text-white uppercase tracking-widest mb-6 inline-block">
                   {university.type}
                </span>
                <h1 className="text-5xl font-extrabold mb-6 leading-tight">{university.name}</h1>
                <div className="flex flex-wrap gap-6 text-slate-400">
                   <div className="flex items-center gap-2">
                      <MapPin className="text-senegal-green w-5 h-5" />
                      <span className="text-lg">{university.city}, {university.country_name}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Globe className="text-senegal-green w-5 h-5" />
                      <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-lg hover:text-white transition-colors">Site officiel</a>
                   </div>
                </div>
             </div>
          </section>

          {/* Programs Section */}
          <section>
             <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Award className="text-senegal-green" /> Programmes & Formations
             </h2>
             <div className="grid grid-cols-1 gap-4">
                {university.programs?.map((program) => (
                   <div key={program.id} className="glass-card flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                      <div>
                         <h3 className="text-xl font-bold mb-1">{program.name}</h3>
                         <div className="flex gap-4 text-xs font-semibold text-slate-500 uppercase tracking-tighter">
                            <span>{program.level}</span>
                            <span>•</span>
                            <span>{program.duration} ans</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-8">
                         <div className="text-right">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Frais annuels</p>
                            <p className="text-lg font-extrabold text-senegal-green">{program.tuition_fees.toLocaleString()} FCFA</p>
                         </div>
                         <button className="p-3 bg-slate-800 rounded-xl group-hover:bg-senegal-green group-hover:text-white transition-all">
                            <ChevronRight className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           <section className="glass-card">
              <h3 className="text-xl font-bold mb-6 border-b border-slate-800 pb-4">Résumé Admission</h3>
              <div className="space-y-6">
                 <AdmissionItem 
                    icon={<DollarSign className="text-senegal-green w-5 h-5" />}
                    label="Frais Min."
                    value={`${university.tuition_fees_min.toLocaleString()} FCFA / an`}
                 />
                 <AdmissionItem 
                    icon={<Calendar className="text-senegal-yellow w-5 h-5" />}
                    label="Date Limite"
                    value={university.admission_deadline || 'Voir site officiel'}
                 />
                 <AdmissionItem 
                    icon={<CheckCircle2 className="text-senegal-green w-5 h-5" />}
                    label="Sélectivité"
                    value={`${university.acceptance_rate}% de taux d'admission`}
                 />
              </div>
           </section>

           <section className="glass-card">
              <h3 className="text-xl font-bold mb-6 border-b border-slate-800 pb-4">Contact & Support</h3>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-2xl">
                    <Mail className="w-5 h-5 text-slate-500" />
                    <span className="text-sm truncate">{university.email || 'info@univ.edu'}</span>
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-2xl">
                    <Phone className="w-5 h-5 text-slate-500" />
                    <span className="text-sm">{university.phone || 'Non spécifié'}</span>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

const AdmissionItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
     <div className="p-2.5 bg-slate-800 rounded-xl">
        {icon}
     </div>
     <div>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-white leading-tight">{value}</p>
     </div>
  </div>
);

export default UniversityDetail;
