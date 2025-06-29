import React, { useState, useEffect } from 'react';

const DebugProjects = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('🔍 Debug: Fetching projects from API...');
        
        const response = await fetch('http://localhost:8000/api/projects/public/');
        console.log('🔍 Debug: Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('🔍 Debug: Raw API data:', data);
          setApiData(data);
        } else {
          setError(`API Error: ${response.status}`);
        }
      } catch (err) {
        console.error('🔍 Debug: Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div style={{padding: '2rem'}}>Loading debug data...</div>;
  if (error) return <div style={{padding: '2rem', color: 'red'}}>Error: {error}</div>;

  return (
    <div style={{
      padding: '2rem',
      background: '#f5f5f5',
      minHeight: '100vh',
      fontFamily: 'monospace'
    }}>
      <h1>🔍 DEBUG: Project Data</h1>
      
      <div style={{background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>
        <h2>Raw API Response:</h2>
        <pre style={{background: '#f0f0f0', padding: '1rem', overflow: 'auto'}}>
          {JSON.stringify(apiData, null, 2)}
        </pre>
      </div>

      {apiData?.results && (
        <div style={{background: 'white', padding: '1rem', borderRadius: '8px'}}>
          <h2>📋 Projects Analysis:</h2>
          {apiData.results.map((project, index) => (
            <div key={project.id} style={{
              border: '1px solid #ddd',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '4px'
            }}>
              <h3>Project #{index + 1}: {project.title}</h3>
              
              <div style={{background: '#f9f9f9', padding: '0.5rem', marginBottom: '0.5rem'}}>
                <strong>Client Data:</strong>
                <pre>{JSON.stringify(project.client, null, 2)}</pre>
              </div>
              
              <div style={{background: '#e6f7ff', padding: '0.5rem'}}>
                <strong>Frontend Logic Result:</strong>
                {(() => {
                  const client = project.client;
                  if (!client) return 'No client data';
                  
                  const firstName = client.first_name || '';
                  const lastName = client.last_name || '';
                  const fullName = `${firstName} ${lastName}`.trim();
                  
                  if (fullName) return fullName;
                  if (client.username) return client.username;
                  return 'Utilisateur';
                })()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DebugProjects; 
 