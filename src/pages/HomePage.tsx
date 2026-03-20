import React, { useEffect, useState } from 'react';
import { movieService } from '../features/movies/services/movieService';
import { MovieCard } from '../features/movies/components/MovieCard';
import type { Movie } from '../features/movies/types';

export const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieService.getMovies();
        setMovies(data);
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div className="loader-spinner"></div>;
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2 style={{ color: 'var(--danger-color)' }}>Oops!</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Now Showing</h1>
      <p style={{ marginBottom: '1rem' }}>Select a movie to book your tickets.</p>
      
      {movies.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h3>No movies available</h3>
          <p style={{ marginTop: '0.5rem' }}>If you are an admin, head to the Admin Portal to add some!</p>
        </div>
      ) : (
        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};
