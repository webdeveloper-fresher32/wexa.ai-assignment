import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowRight, Search } from 'lucide-react';
import { searchTopics } from '../api';

const Home = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    searchTopics()
      .then(data => {
        // Sort topics alphabetically
        setTopics(data.sort((a, b) => a.name.localeCompare(b.name)));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load topics', err);
        setLoading(false);
      });
  }, []);

  const handleGenerate = () => {
    if (selectedTopic) {
      navigate(`/path/${encodeURIComponent(selectedTopic)}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      // Find exact match or close match
      const match = topics.find(t => t.name.toLowerCase() === searchQuery.toLowerCase());
      if (match) {
        navigate(`/topic/${encodeURIComponent(match.name)}`);
      } else {
        alert('Topic not found in graph');
      }
    }
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1 className="title">Build your learning path</h1>
      <p className="subtitle">Choose what you want to learn. We'll show you the path.</p>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>What do you want to learn?</h2>
        
        <div className="select-wrapper">
          <select 
            className="topic-select" 
            value={selectedTopic} 
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="" disabled>Select a goal...</option>
            {topics.map(topic => (
              <option key={topic.name} value={topic.name}>
                {topic.name}
              </option>
            ))}
          </select>
          <ChevronDown className="select-icon" size={24} />
        </div>

        <button 
          className="btn" 
          disabled={!selectedTopic} 
          onClick={handleGenerate}
          style={{ width: '100%', maxWidth: '400px', padding: '1rem', fontSize: '1.1rem' }}
        >
          Generate Learning Path <ArrowRight size={20} />
        </button>
      </div>

      <div style={{ marginTop: '4rem', maxWidth: '400px', margin: '4rem auto 0' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Or explore a specific topic:</p>
        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics (e.g. Docker)..." 
            style={{
              width: '100%',
              padding: '1rem 3rem 1rem 1.5rem',
              borderRadius: '9999px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}
          />
          <button type="submit" style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}>
            <Search size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
