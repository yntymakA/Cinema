import React, { useState, useEffect } from 'react';
import { movieService } from '../features/movies/services/movieService';
import type { Movie } from '../features/movies/types';

export const AdminDashboard: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await movieService.getMovies();
      setMovies(data);
    } catch (error) {
      console.error("Failed to load movies", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await movieService.addMovie({ title, description, imageUrl });
      setTitle('');
      setDescription('');
      setImageUrl('');
      await fetchMovies(); // Refresh the list
    } catch (error) {
      console.error("Failed to add movie", error);
      alert("Failed to add movie");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMovie = async (id: string, movieTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${movieTitle}"?`)) return;

    try {
      await movieService.deleteMovie(id);
      await fetchMovies(); // Refresh list
    } catch (error) {
      console.error("Failed to delete movie", error);
      alert("Failed to delete movie");
    }
  };

  if (loading) return <div className="loader-spinner"></div>;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1>Admin Dashboard</h1>
      <p style={{ marginBottom: '2rem' }}>Manage your cinema catalog and inventory.</p>

      {/* Add Movie Form */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fff' }}>Add a New Movie</h2>
        <form onSubmit={handleAddMovie}>
          <div>
            <label className="input-label">Movie Title *</label>
            <input 
              type="text" 
              className="input-field"
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required
              placeholder="e.g. Inception"
            />
          </div>
          <div>
            <label className="input-label">Description (Optional)</label>
            <textarea 
              className="input-field"
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows={3}
              placeholder="A brief summary of the movie..."
            />
          </div>
          <div>
            <label className="input-label">Image URL (Optional)</label>
            <input 
              type="url" 
              className="input-field"
              value={imageUrl} 
              onChange={e => setImageUrl(e.target.value)} 
              placeholder="https://example.com/movie-poster.jpg"
            />
          </div>
          <button 
            type="submit"  
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Movie to Catalog'}
          </button>
        </form>
      </div>

      {/* Existing Movies List */}
      <div className="glass-panel">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fff' }}>Existing Movies</h2>
        {movies.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No movies in the database.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {movies.map(movie => (
              <li 
                key={movie.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1.5rem',
                  borderBottom: '1px solid var(--glass-border)',
                  background: 'rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ paddingRight: '1rem' }}>
                  <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{movie.title}</strong>
                  <p style={{ marginTop: '0.25rem' }}>
                    {movie.description || 'No description provided'}
                  </p>
                </div>
                <button 
                  onClick={() => handleDeleteMovie(movie.id, movie.title)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
