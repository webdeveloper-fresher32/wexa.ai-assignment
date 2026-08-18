import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Network } from 'lucide-react';
import { getLearningPath } from '../api';
import GraphViewer from '../components/GraphViewer';

const LearningPath = () => {
  const { topic } = useParams();
  const [pathData, setPathData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'graph'

  useEffect(() => {
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
  }, [topic]);

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
        {nodes.map((node, index) => (
          <React.Fragment key={node.name}>
            <div className="path-node">
              <span className="step-number">{(index + 1).toString().padStart(2, '0')}</span>
              <Link to={`/topic/${encodeURIComponent(node.name)}`}>
                <div className="card interactive" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{node.name}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      <span>{node.category}</span>
                      <span>•</span>
                      <span className={`badge badge-${node.difficulty?.toLowerCase() || 'beginner'}`}>
                        {node.difficulty || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="select-icon" size={20} />
                </div>
              </Link>
            </div>
            
            {/* Don't render connector after the last node */}
            {index < nodes.length - 1 && (
              <div className="path-connector"></div>
            )}
          </React.Fragment>
        ))}
      </div>
      ) : (
        <div style={{ height: '600px', marginBottom: '2rem' }}>
          {pathData.graph ? (
            <GraphViewer 
              graphData={pathData.graph} 
              onNodeClick={(id) => window.location.href = `/topic/${encodeURIComponent(id)}`}
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
