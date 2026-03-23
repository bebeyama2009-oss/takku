import { ArrowRight, Sparkles, Globe, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Éclaire ton <span className="text-gradient">Avenir</span> Post-Bac
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Découvre le métier qui te correspond, explore les meilleures universités et accède à des bourses exclusives pour réussir ton parcours.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/orientation" className="btn-primary text-lg flex items-center gap-2 group">
                Passer le test d'orientation <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/opportunities" className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all border border-slate-700">
                Explorer les opportunités
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-senegal-green/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-senegal-yellow/5 blur-[120px] rounded-full" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Sparkles className="w-6 h-6 text-senegal-green" />}
              title="Test Intelligent"
              description="Algorithme psychométrique adapté au marché sénégalais."
            />
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-senegal-green" />}
              title="Universités Mondiales"
              description="Sénégal, France, Canada, Maroc... explore tous tes choix."
            />
            <FeatureCard 
              icon={<Award className="w-6 h-6 text-senegal-green" />}
              title="Bourses & Aide"
              description="Maximise tes chances de financement avec notre catalogue."
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-senegal-green" />}
              title="Communauté"
              description="Partage des opportunités et concours avec d'autres élèves."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-card group hover:-translate-y-2">
    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-senegal-green/20 group-hover:scale-110 transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

export default Home;
