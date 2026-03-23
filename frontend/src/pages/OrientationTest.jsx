import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, Loader2, Sparkles, Award, GraduationCap, ArrowRight } from 'lucide-react';

const OrientationTest = () => {
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/questions/');
      setQuestions(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const testResponse = await api.post('/tests/', {});
      const submitResponse = await api.post(`/tests/${testResponse.data.id}/submit/`, { answers });
      setResults(submitResponse.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-senegal-green w-12 h-12" />
    </div>
  );

  if (results) return <Results results={results} />;

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-4">Test d'Orientation</h1>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-senegal-green"
          />
        </div>
        <p className="mt-2 text-sm text-slate-400">Question {currentStep + 1} sur {questions.length}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card p-10"
        >
          <span className="inline-block px-3 py-1 bg-senegal-green/10 text-senegal-green rounded-full text-xs font-semibold mb-6">
            {currentQuestion.section}
          </span>
          <h2 className="text-2xl font-bold mb-10 leading-snug">
            {currentQuestion.question_text}
          </h2>

          <div className="space-y-4">
            {currentQuestion.question_type === 'SCALE' ? (
              <div className="flex justify-between items-center gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAnswer(currentQuestion.id, val)}
                    className={`w-14 h-14 rounded-2xl border transition-all flex items-center justify-center font-bold text-lg ${answers[currentQuestion.id] === val ? 'bg-senegal-green border-senegal-green text-white scale-110' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(currentQuestion.id, option)}
                    className={`p-5 rounded-2xl border transition-all text-left flex items-center justify-between ${answers[currentQuestion.id] === option ? 'bg-senegal-green/20 border-senegal-green text-senegal-green shadow-lg shadow-senegal-green/5' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}
                  >
                    <span>{option}</span>
                    {answers[currentQuestion.id] === option && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex justify-between">
        <button 
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6 py-3 border border-slate-700 rounded-xl hover:bg-slate-800 disabled:opacity-30 flex items-center gap-2 transition-all"
        >
          <ChevronLeft className="w-5 h-5" /> Précédent
        </button>
        
        {currentStep === questions.length - 1 ? (
          <button 
            onClick={handleSubmit}
            disabled={!answers[currentQuestion.id] || submitting}
            className="btn-primary flex items-center gap-2"
          >
            {submitting ? <Loader2 className="animate-spin" /> : <>Découvrir mes résultats <Sparkles className="w-5 h-5" /></>}
          </button>
        ) : (
          <button 
            onClick={nextStep}
            disabled={!answers[currentQuestion.id]}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-2 transition-all"
          >
            Suivant <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

const Results = ({ results }) => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-16"
    >
      <div className="w-20 h-20 bg-senegal-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Award className="text-senegal-green w-10 h-10" />
      </div>
      <h1 className="text-4xl font-extrabold mb-4">Tes recommandations sont prêtes !</h1>
      <p className="text-xl text-slate-400">Voici les métiers qui correspondent le mieux à ton profil et tes intérêts.</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {results.map((career, index) => (
        <motion.div
           key={career.id}
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: index * 0.1 }}
           className="glass-card relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
             <GraduationCap className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 rounded-xl bg-senegal-green flex items-center justify-center text-xl font-bold">
                {index + 1}
             </div>
             <div>
                <h3 className="text-2xl font-bold">{career.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-senegal-green" style={{ width: `${career.score}%` }} />
                   </div>
                   <span className="text-xs font-semibold text-senegal-green">{career.score}% de match</span>
                </div>
             </div>
          </div>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
             Ton profil indique un fort potentiel pour ce domaine. Explore le cursus complet pour te préparer.
          </p>
          {career.slug ? (
            <Link
              to={`/careers/${career.slug}`}
              className="w-full py-3 bg-slate-800/50 hover:bg-senegal-green/10 hover:text-senegal-green transition-all rounded-xl font-semibold border border-slate-700 hover:border-senegal-green/50 flex items-center justify-center gap-2"
            >
              Voir le cursus complet <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/careers"
              className="w-full py-3 bg-slate-800/50 hover:bg-senegal-green/10 hover:text-senegal-green transition-all rounded-xl font-semibold border border-slate-700 hover:border-senegal-green/50 flex items-center justify-center gap-2"
            >
              Explorer les métiers <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </motion.div>
      ))}
    </div>

    <div className="mt-20 text-center">
       <Link to="/dashboard" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-lg transition-all border border-slate-700 inline-block">
          Voir mon tableau de bord
       </Link>
    </div>
  </div>
);

export default OrientationTest;
