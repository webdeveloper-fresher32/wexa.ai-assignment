import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Network, LayoutList, Share2, Circle } from 'lucide-react';
import { getLearningPath, markTopicProgress } from '../api';
import GraphViewer from '../components/GraphViewer';

const LearningPath = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [pathData, setPathData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'graph'
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isUpdating, setIsUpdating] = useState(null);
  const [requestId, setRequestId] = useState('');

  useEffect(() => {
    // Generate userId for anonymous progress tracking
    if (!localStorage.getItem('techpath_userId')) {
      localStorage.setItem('techpath_userId', crypto.randomUUID());
    }
    
    setRequestId(crypto.randomUUID().split('-')[0]);

    getLearningPath(topic)
      .then(data => {
        setPathData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.error || 'The learning graph is temporarily unavailable.');
        setLoading(false);
      });
  }, [topic, refreshTrigger]);

  const handleToggleComplete = async (topicName, isCompleted) => {
    setIsUpdating(topicName);
    try {
      await markTopicProgress(topicName, isCompleted);
      setRefreshTrigger(prev => prev + 1); // Refresh path to update progress
    } catch (err) {
      console.error("Failed to mark complete", err);
    } finally {
      setIsUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ padding: '6rem 2rem', fontFamily: 'monospace', maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Building your learning graph</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p className="loading-step" style={{ animation: 'fadeInUp 0.3s ease forwards' }}>[+] Analyzing prerequisites...</p>
          <p className="loading-step" style={{ opacity: 0, animation: 'fadeInUp 0.3s ease 0.6s forwards' }}>[+] Mapping dependencies...</p>
          <p className="loading-step" style={{ opacity: 0, animation: 'fadeInUp 0.3s ease 1.2s forwards' }}>[+] Calculating optimal learning order...</p>
        </div>
        <div className="loader" style={{ marginLeft: 0, marginTop: '2.5rem', width: '20px', height: '20px', borderWidth: '2px' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in" style={{ padding: '6rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: 'var(--diff-advanced)', marginBottom: '1rem', fontSize: '1.5rem' }}>Couldn't generate this path.</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>{error}</p>
        <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Request ID: {requestId}</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" className="btn btn-secondary">
            <ArrowLeft size={16} /> Back to Search
          </Link>
          <button onClick={() => window.location.reload()} className="btn">
            Try again
          </button>
        </div>
      </div>
    );
  }

  const nodes = pathData.path.length > 0 ? pathData.path : [{
    name: pathData.goal,
    difficulty: 'Unknown',
    category: 'Unknown'
  }];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Explore paths
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setViewMode('list')}
            style={{ 
              padding: '0.5rem 1rem', 
              background: viewMode === 'list' ? 'var(--bg-base)' : 'transparent',
              color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)',
              border: viewMode === 'list' ? '1px solid var(--border-color)' : '1px solid transparent',
              borderRadius: '6px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <LayoutList size={14} /> Learning Mode
          </button>
          <button 
            onClick={() => setViewMode('graph')}
            style={{ 
              padding: '0.5rem 1rem', 
              background: viewMode === 'graph' ? 'var(--bg-base)' : 'transparent',
              color: viewMode === 'graph' ? 'var(--text-primary)' : 'var(--text-muted)',
              border: viewMode === 'graph' ? '1px solid var(--border-color)' : '1px solid transparent',
              borderRadius: '6px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <Share2 size={14} /> Dependency Graph
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{pathData.goal}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Generated graph-powered learning roadmap.</p>
      </div>

      {pathData.progress && (
        <div style={{ marginBottom: '4rem', paddingBottom: '3rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.25rem' }}>{pathData.progress.total}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Topics</p>
            </div>
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.25rem' }}>~{pathData.progress.total * 4}h</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimated</p>
            </div>
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--diff-beginner)', lineHeight: 1, marginBottom: '0.25rem' }}>{pathData.progress.completed}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed</p>
            </div>
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1, marginBottom: '0.25rem' }}>{pathData.progress.total - pathData.progress.completed}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Remaining</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, width: '40px' }}>{pathData.progress.percent}%</span>
            <div className="progress-track" style={{ flex: 1 }}>
              <div className="progress-fill" style={{ width: `${pathData.progress.percent}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'list' ? (
        <div className="path-container" style={{ maxWidth: '700px', margin: '0 0' }}>
        {nodes.map((node, index) => {
          return (
          <React.Fragment key={node.name}>
            <div className="path-node" style={{ display: 'flex', gap: '2rem' }}>
              
              {/* Vertical Timeline Track */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px', flexShrink: 0 }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: node.completed ? 'var(--diff-beginner)' : 'var(--bg-surface)',
                  border: `2px solid ${node.completed ? 'var(--diff-beginner)' : 'var(--border-color)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2
                }}>
                  {node.completed && <div style={{ width: '8px', height: '8px', background: 'var(--bg-base)', borderRadius: '50%' }}></div>}
                </div>
                {index < nodes.length - 1 && (
                  <div style={{ width: '2px', height: '100%', background: 'var(--border-color)', margin: '4px 0' }}></div>
                )}
              </div>

              {/* Node Content */}
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '0.5rem', paddingBottom: '3rem', marginTop: '-4px' }}>
                <div className={`card`} style={{ 
                  opacity: node.completed ? 0.6 : 1, 
                  borderLeft: node.completed ? '1px solid var(--border-color)' : `2px solid var(--text-primary)`,
                  background: node.completed ? 'transparent' : 'var(--bg-surface)'
                }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>STEP {(index + 1).toString().padStart(2, '0')}</span>
                      <span className={`badge badge-${node.difficulty?.toLowerCase()}`}>
                        {node.difficulty}
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {node.name}
                  </h3>
                  
                  {node.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                      {node.description}
                    </p>
                  )}

                  {/* Dependency Inspector Context (Learning Mode) */}
                  <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Why you're learning this</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {index < nodes.length - 1 
                        ? <>{node.name} is a foundational requirement for <strong>{nodes[index + 1].name}</strong>.</>
                        : <>This is your target goal. You are ready to master <strong>{node.name}</strong>.</>
                      }
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={!!node.completed}
                        onChange={(e) => handleToggleComplete(node.name, e.target.checked)}
                        disabled={isUpdating === node.name}
                        style={{ width: '1.1rem', height: '1.1rem', accentColor: 'var(--text-primary)' }}
                      />
                      <span style={{ color: node.completed ? 'var(--text-muted)' : 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>
                        {node.completed ? 'Completed' : 'Mark as complete'}
                      </span>
                      {isUpdating === node.name && <span className="loader" style={{ width: '14px', height: '14px', margin: '0', borderWidth: '2px' }}></span>}
                    </label>

                    <Link to={`/topic/${encodeURIComponent(node.name)}`} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      View Resources <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
          );
        })}
        
        {/* Why this order section */}
        <div style={{ padding: '2rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Why this order?</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            The path is ordered strictly from foundational dependencies to your target skill. 
            Each topic listed relies on the knowledge gained in the preceding topics (e.g. {nodes.length > 1 ? `${nodes[1].name} depends on ${nodes[0].name}` : 'the prerequisites build upward'}). 
            By following this order, you ensure you satisfy the graph's required prerequisites before tackling advanced concepts.
          </p>
        </div>

      </div>
      ) : (
        <div className="animate-fade-in" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legend</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--diff-beginner)' }}></div> Beginner</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--diff-intermediate)' }}></div> Intermediate</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--diff-advanced)' }}></div> Advanced</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--diff-expert)' }}></div> Expert</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Interactive Force Simulation</span>
            </div>
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
    </div>
  );
};

export default LearningPath;
