import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OrientationTest from './pages/OrientationTest';
import CareersList from './pages/CareersList';
import CareerDetail from './pages/CareerDetail';
import UniversitiesList from './pages/UniversitiesList';
import UniversityDetail from './pages/UniversityDetail';
import ScholarshipsList from './pages/ScholarshipsList';
import ScholarshipDetail from './pages/ScholarshipDetail';
import OpportunitiesFeed from './pages/OpportunitiesFeed';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/orientation" element={<OrientationTest />} />
              <Route path="/careers" element={<CareersList />} />
              <Route path="/careers/:slug" element={<CareerDetail />} />
              <Route path="/universities" element={<UniversitiesList />} />
              <Route path="/universities/:id" element={<UniversityDetail />} />
              <Route path="/scholarships" element={<ScholarshipsList />} />
              <Route path="/scholarships/:id" element={<ScholarshipDetail />} />
              <Route path="/opportunities" element={<OpportunitiesFeed />} />
              <Route path="/dashboard" element={<Dashboard />} />
            {/* 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/orientation" element={<OrientationTest />} />
            <Route path="/careers" element={<CareersList />} />
            <Route path="/scholarships" element={<ScholarshipsList />} />
            <Route path="/opportunities" element={<OpportunitiesFeed />} />
            <Route path="/dashboard" element={<Dashboard />} />
            */}
          </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
