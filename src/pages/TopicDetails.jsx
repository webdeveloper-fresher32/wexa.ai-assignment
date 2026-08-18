import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, GitMerge, Network, ChevronDown, Clock, Layers } from 'lucide-react';
import { getTopicDetails, getTopicCourses } from '../api';
import { getSubtopics } from '../data/subtopics';

const difficultyColor = {
  Beginner: 'var(--diff-beginner)',
  Intermediate: 'var(--diff-intermediate)',
  Advanced: 'var(--diff-advanced)',
  Expert: 'var(--diff-expert)'
};

const Accordion = ({ subtopic, index }) => {
  const [open, setOpen] = useState(index === 0);
  return (
    <div style={{
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      marginBottom: '0.75rem',
      overflow: 'hidden',
      transition: 'border-color 0.2s ease'
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          background: open ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <span style={{
            minWidth: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--bg-base)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontFamily: 'monospace',
            fontWeight: 700
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>
              {subtopic.title}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0, marginTop: '0.15rem' }}>
              {subtopic.description}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <span style={{
            fontSize: '0.75rem',
            color: difficultyColor[subtopic.difficulty] || 'var(--text-muted)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {subtopic.difficulty}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={12} /> {subtopic.duration}
          </span>
          <ChevronDown
            size={16}
            style={{
              color: 'var(--text-muted)',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          />
        </div>
      </button>

      {open && (
        <div style={{
          padding: '1rem 1.25rem 1.25rem',
          background: 'var(--bg-base)',
          borderTop: '1px solid var(--border-color)',
          animation: 'fadeInUp 0.2s ease'
        }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {subtopic.points.map((point, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--text-muted)',
                  marginTop: '0.45rem',
                  flexShrink: 0
                }} />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const TopicDetails = () => {
  const { name } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const curriculum = getSubtopics(decodeURIComponent(name));

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getTopicDetails(name),
      getTopicCourses(name)
    ])
      .then(([details, courses]) => {
        setTopic({ ...details, courses });
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

      {/* Header Card */}
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
            {curriculum ? curriculum.overview : topic.description}
          </p>
        </div>

        {curriculum && (
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Layers size={14} />
              <span>{curriculum.subtopics.length} modules</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Clock size={14} />
              <span>{curriculum.estimatedTime}</span>
            </div>
          </div>
        )}
      </div>

      {/* Curriculum Accordion */}
      {curriculum && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BookOpen size={20} /> Curriculum
          </h2>
          <div>
            {curriculum.subtopics.map((subtopic, i) => (
              <Accordion key={subtopic.title} subtopic={subtopic} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Graph Relations + Courses Grid */}
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
