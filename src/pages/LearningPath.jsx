import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Network } from 'lucide-react';
import { getLearningPath, markTopicProgress } from '../api';
import GraphViewer from '../components/GraphViewer';

const LearningPath = () => {
  const { topic } = useParams();
  const [pathData, setPathData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'graph'
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isUpdating, setIsUpdating] = useState(null);

  useEffect(() => {
    // Generate userId for anonymous progress tracking
    if (!localStorage.getItem('techpath_userId')) {
      localStorage.setItem('techpath_userId', crypto.randomUUID());
    }

    getLearningPath(topic)
      .then(data => {
        setPathData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.error || 'Failed to load learning path');
        setLoading(false);
      });
  }, [topic, refreshTrigger]);

  const handleToggleComplete = async (topicName, isCompleted) => {
    if (isCompleted) return; // For simplicity, only allow marking as complete
    setIsUpdating(topicName);
    try {
      await markTopicProgress(topicName);
      setRefreshTrigger(prev => prev + 1); // Refresh path to update progress
    } catch (err) {
      console.error("Failed to mark complete", err);
    } finally {
      setIsUpdating(null);
    }
  };

  if (loading) return <div className="loader"></div>;

  if (error) {
    return (
      <div className="empty-state">
        <Network className="empty-icon" />
        <h2>Path not found</h2>
        <p>{error}</p>
        <Link to="/" className="btn" style={{ marginTop: '2rem' }}>
          <ArrowLeft size={16} /> Back Home
        </Link>
      </div>
    );
  }

  // If the path length is 0, it means it's a root node with no prerequisites.
  // We still want to show the topic itself as the goal.
  const nodes = pathData.path.length > 0 ? pathData.path : [{
    name: pathData.goal,
    difficulty: 'Unknown',
    category: 'Unknown'
  }];

  return (
    <div className="animate-fade-in">
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back to Search
      </Link>
      
      <h1 className="title">Your Path to {pathData.goal}</h1>
      <p className="subtitle">Follow these steps to master your goal.</p>

      {pathData.progress && (
        <div className="progress-container" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Progress: {pathData.progress.completed} / {pathData.progress.total} Topics</span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{pathData.progress.percent}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pathData.progress.percent}%` }}></div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setViewMode('list')}
        >
          List View
        </button>
        <button 
          className={`btn ${viewMode === 'graph' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setViewMode('graph')}
        >
          Graph View
        </button>
      </div>

      {viewMode === 'list' ? (
        <div className="path-container">
        {nodes.map((node, index) => {
          // Deterministically generate some pseudo-skills based on topic name for UI demonstration
          const words = node.name.split(' ');
          const pseudoSkills = [
            `${node.name} Architecture`,
            `Applied ${words[0]}`,
            `${words[words.length - 1]} Patterns`
          ];

          return (
          <React.Fragment key={node.name}>
            <div className="path-node">
              <span className="step-number">{(index + 1).toString().padStart(2, '0')}</span>
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '0.5rem' }}>
                <div className={`card interactive ${node.completed ? 'completed-card' : ''}`} style={{ opacity: node.completed ? 0.7 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <Link to={`/topic/${encodeURIComponent(node.name)}`} style={{ textDecoration: 'none' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {node.name}
                          <ExternalLink size={16} style={{ color: 'var(--text-muted)' }} />
                        </h3>
                      </Link>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{node.category}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>•</span>
                        <span className={`badge badge-${node.difficulty?.toLowerCase()}`}>
                          {node.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {node.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                      {node.description}
                    </p>
                  )}

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Skills you'll learn</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {pseudoSkills.map(skill => (
                        <span key={skill} style={{ padding: '0.25rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', width: 'fit-content' }} onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={!!node.completed}
                      onChange={(e) => handleToggleComplete(node.name, e.target.checked)}
                      disabled={isUpdating === node.name}
                    />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                      {node.completed ? 'Completed' : 'Mark as complete'}
                    </span>
                    {isUpdating === node.name && <span className="loader" style={{ width: '16px', height: '16px', margin: '0', borderWidth: '2px' }}></span>}
                  </label>
                </div>
              </div>
            </div>
            
            {/* Don't render connector after the last node */}
            {index < nodes.length - 1 && (
              <div className="path-connector"></div>
            )}
          </React.Fragment>
        ))}
      </div>
      ) : (
        <div className="animate-fade-in" style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Legend:</strong></span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div> Beginner</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div> Intermediate</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div> Advanced</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#8b5cf6' }}></div> Expert</span>
          </div>
          {pathData.graph ? (
            <GraphViewer 
              graphData={pathData.graph} 
              onNodeClick={(id) => navigate(`/topic/${encodeURIComponent(id)}`)}
            />
          ) : (
            <div className="empty-state">Graph data not available</div>
          )}
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Link to={`/topic/${encodeURIComponent(pathData.goal)}`} className="btn btn-secondary">
          Explore Goal Details
        </Link>
      </div>
    </div>
  );
};

export default LearningPath;
