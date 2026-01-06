import { useState, useEffect } from 'react';
import './Dashboard.css';

interface DashboardProps {
  onLogout: () => void;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  phase: string;
  createdAt: string;
}

function Dashboard({ onLogout }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const getPhaseLabel = (phase: string) => {
    const phases: Record<string, string> = {
      discovery: 'Discovery',
      design: 'Design',
      build: 'Build',
      completed: 'Completed',
    };
    return phases[phase] || phase;
  };

  const getPhaseClass = (phase: string) => {
    return `phase-badge phase-${phase}`;
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>OneShot</h1>
          <button onClick={onLogout} className="btn btn-secondary">
            Sign Out
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="section-header">
            <h2>Your Projects</h2>
            <button className="btn btn-primary">
              + New Project
            </button>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <h3>No projects yet</h3>
              <p>Create your first project to start the CID journey.</p>
              <button className="btn btn-primary">
                Create Project
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.id} className="project-card card">
                  <div className="project-header">
                    <h3>{project.name}</h3>
                    <span className={getPhaseClass(project.phase)}>
                      {getPhaseLabel(project.phase)}
                    </span>
                  </div>
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}
                  <div className="project-footer">
                    <span className="project-date">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <button className="btn btn-secondary btn-small">
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
