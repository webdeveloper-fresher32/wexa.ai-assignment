import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Network } from 'lucide-react';
import Home from './pages/Home';
import LearningPath from './pages/LearningPath';
import TopicDetails from './pages/TopicDetails';
import './index.css';

function App() {
  return (
    <Router>
      <div className="container">
        <header className="header">
          <Link to="/" className="logo">
            <Network className="logo-icon" size={32} />
            TECHPATH
          </Link>
          <nav>
            <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Explore
            </Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/path/:topic" element={<LearningPath />} />
            <Route path="/topic/:name" element={<TopicDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
