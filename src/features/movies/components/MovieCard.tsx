import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1rem' }}>
      {movie.imageUrl ? (
        <img 
          src={movie.imageUrl} 
          alt={movie.title} 
          style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.1)' }} 
        />
      ) : (
        <div style={{ width: '100%', height: '300px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '3rem', opacity: 0.5 }}>🎬</span>
        </div>
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{movie.title}</h3>
          {movie.description && (
            <p style={{ marginTop: '0', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {movie.description}
            </p>
          )}
        </div>

        <Link 
          to={`/movie/${movie.id}/seats`}
          className="btn-primary"
          style={{ marginTop: '1.5rem', width: '100%' }}
        >
          Select Seats
        </Link>
      </div>
    </div>
  );
};
