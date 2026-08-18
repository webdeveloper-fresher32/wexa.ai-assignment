import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, GitMerge, Network } from 'lucide-react';
import { getTopicByName } from '../api';

const TopicDetails = () => {
  const { name } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getTopicByName(name)
      .then(data => {
        setTopic(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.error || 'Topic not found');
        setLoading(false);
      });
  }, [name]);

  if (loading) return <div className="loader"></div>;

  if (error || !topic) {
    return (
      <div className="empty-state">
        <Network className="empty-icon" />
        <h2>Not found</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="btn" style={{ marginTop: '2rem' }}>
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h1 className="title" style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>{topic.name}</h1>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
              <span>{topic.category}</span>
              <span className={`badge badge-${topic.difficulty?.toLowerCase()}`}>
                {topic.difficulty}
              </span>
            </div>
          </div>
          
          <Link to={`/path/${encodeURIComponent(topic.name)}`} className="btn">
            View Path to Here
          </Link>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <h2 className="section-title">About</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            {topic.description}
          </p>
        </div>
      </div>

      <div className="details-grid">
        <div className="graph-relations">
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitMerge size={20} /> Prerequisites
            </h2>
            {topic.prerequisites && topic.prerequisites.length > 0 ? (
              <div className="related-items">
                {topic.prerequisites.map(p => (
                  <Link key={p.name} to={`/topic/${encodeURIComponent(p.name)}`} className="btn btn-secondary">
                    {p.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No prerequisites required. This is a foundational topic.</p>
            )}
          </div>

          <div className="card">
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Network size={20} /> Leads To
            </h2>
            {topic.leadsTo && topic.leadsTo.length > 0 ? (
              <div className="related-items">
                {topic.leadsTo.map(l => (
                  <Link key={l.name} to={`/topic/${encodeURIComponent(l.name)}`} className="btn btn-secondary" style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}>
                    {l.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>This is an end node in our current graph.</p>
            )}
          </div>
        </div>

        <div className="courses">
          <div className="card" style={{ height: '100%' }}>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} /> Recommended Courses
            </h2>
            {topic.courses && topic.courses.length > 0 ? (
              <div>
                {topic.courses.map(c => (
                  <div key={c.title} className="course-item">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{c.title}</h3>
                    <div className="course-meta">
                      <span>{c.provider}</span>
                      <span>{c.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No courses currently recommended for this topic.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetails;
