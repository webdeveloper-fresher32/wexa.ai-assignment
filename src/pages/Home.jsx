import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchTopics } from '../api';

const POPULAR_PATHS = [
  'AWS Cloud Fundamentals', 
  'Docker Fundamentals', 
  'Kubernetes (K8s) Core', 
  'Git & GitHub Actions', 
  'High-Level Design (HLD)', 
  'React Foundations'
];

const Home = () => {
  const [topics, setTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    searchTopics()
      .then(data => {
        setTopics(data.sort((a, b) => a.name.localeCompare(b.name)));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load topics', err);
        setLoading(false);
      });
  }, []);

  const handleGenerate = (e) => {
    e?.preventDefault();
    if (searchQuery) {
      const match = topics.find(t => t.name.toLowerCase() === searchQuery.toLowerCase());
      if (match) {
        navigate(`/path/${encodeURIComponent(match.name)}`);
      } else {
        // If not exact match but we have something similar, use the first match
        const partialMatch = topics.find(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
        if (partialMatch) {
          navigate(`/path/${encodeURIComponent(partialMatch.name)}`);
        } else {
          // Just pass it as the goal, backend will handle 404
          navigate(`/path/${encodeURIComponent(searchQuery)}`);
        }
      }
    }
  };

  const selectPopularPath = (path) => {
    setSearchQuery(path);
    setShowSuggestions(false);
  };

  if (loading) return <div className="loader" style={{ marginTop: '20vh' }}></div>;

  return (
    <div className="animate-fade-in" style={{ 
      maxWidth: '640px', 
      margin: '4rem auto 2rem', 
      padding: '0 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }}>
      
      <div style={{ marginBottom: '2.5rem', width: '100%' }}>
        <h1 style={{ 
          fontFamily: 'var(--font-sans)', 
          fontSize: '1rem', 
          fontWeight: 600, 
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          marginBottom: '2rem'
        }}>
          TECHPATH
        </h1>
        
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 400, 
          lineHeight: 1.2, 
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          marginBottom: '1rem'
        }}>
          Build the shortest path to your next skill.
        </h2>
      </div>

      <div style={{ width: '100%', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '1rem' }}>
          What are you trying to learn?
        </p>
        
        <form onSubmit={handleGenerate} style={{ position: 'relative', width: '100%' }}>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="e.g. Kubernetes, React, AWS..." 
            style={{
              width: '100%',
              padding: '1.25rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-base)',
              color: 'var(--text-primary)',
              fontSize: '1.25rem',
              fontFamily: 'var(--font-sans)',
              transition: 'border-color 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--text-primary)';
              if (searchQuery) setShowSuggestions(true);
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            autoFocus
          />
          <button type="submit" style={{
            position: 'absolute',
            right: '1.25rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.5rem'
          }}>
            <Search size={24} />
          </button>
          
          {/* Autocomplete Dropdown */}
          {showSuggestions && searchQuery && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              marginTop: '0.5rem',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 10,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
            }}>
              {topics.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                topics.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).map(t => (
                  <div 
                    key={t.name} 
                    onClick={() => { setSearchQuery(t.name); setShowSuggestions(false); }} 
                    style={{ padding: '0.85rem 1.5rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {t.name}
                  </div>
                ))
              ) : (
                <div style={{ padding: '0.85rem 1.5rem', color: 'var(--text-muted)' }}>No topics found...</div>
              )}
            </div>
          )}
        </form>
      </div>

      <div style={{ width: '100%', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Popular paths
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {POPULAR_PATHS.map(path => (
            <button 
              key={path}
              type="button"
              onClick={() => selectPopularPath(path)}
              style={{
                padding: '0.5rem 1rem',
                background: searchQuery === path ? 'var(--text-primary)' : 'transparent',
                color: searchQuery === path ? 'var(--bg-base)' : 'var(--text-secondary)',
                border: `1px solid ${searchQuery === path ? 'var(--text-primary)' : 'var(--border-color)'}`,
                borderRadius: '6px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {path}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <button 
          className="btn" 
          disabled={!searchQuery}
          onClick={handleGenerate}
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          Generate learning path
        </button>
      </div>

    </div>
  );
};

export default Home;
