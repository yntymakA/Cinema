import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService } from '../features/movies/services/movieService';
import { seatService } from '../features/seats/services/seatService';
import { SeatGrid } from '../features/seats/components/SeatGrid';
import { useAuth } from '../features/auth/hooks/useAuth';
import type { Movie } from '../features/movies/types';
import type { Cinema, Seat } from '../features/seats/types';

export const MovieSeatsPage: React.FC = () => {
  const { id: movieId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [cinema, setCinema] = useState<Cinema | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) return;
    fetchData(movieId);
  }, [movieId]);

  const fetchData = async (mId: string) => {
    try {
      setLoading(true);
      setError(null);

      const movieData = await movieService.getMovieById(mId);
      if (!movieData) {
        setError('Movie not found');
        return;
      }
      setMovie(movieData);

      const { cinema: cData, seats: sData } = await seatService.getSeatsForMovie(mId);
      setCinema(cData);
      setSeats(sData);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load seat data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = async (seat: Seat) => {
    if (!user || !movieId || seat.is_booked) return;

    const confirm = window.confirm(`Do you want to book seat ${seat.seat_number}?`);
    if (!confirm) return;

    try {
      setBookingInProgress(true);
      await seatService.bookSeat(seat.id, user.id, movieId);
      setSeats(prev => prev.map(s => s.id === seat.id ? { ...s, is_booked: true } : s));
      alert(`Successfully booked ${seat.seat_number}!`);
    } catch (err: any) {
      console.error("Booking error:", err);
      alert(err.message || "Failed to book seat.");
      fetchData(movieId);
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) return <div className="loader-spinner"></div>;
  if (error || !movie) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2 style={{ color: 'var(--danger-color)' }}>Oops!</h2>
        <p>{error || 'Movie not found.'}</p>
        <button onClick={() => navigate(-1)} className="btn-primary" style={{ marginTop: '2rem' }}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="container">
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          marginBottom: '2rem', 
          background: 'none', 
          border: 'none', 
          color: 'var(--accent-color)', 
          cursor: 'pointer', 
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '600',
          fontSize: '1rem'
        }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back to Movies
      </button>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'center' }}>
        {movie.imageUrl && (
          <img 
            src={movie.imageUrl} 
            alt={movie.title} 
            style={{ width: '100px', height: '150px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }} 
          />
        )}
        <div>
          <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>{movie.title}</h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            Cinema: <strong style={{ color: 'white' }}>{cinema?.name}</strong>
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <div className="screen-marker"></div>

        <SeatGrid 
          seats={seats} 
          onSeatClick={handleSeatClick} 
          bookingInProgress={bookingInProgress} 
        />

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'rgba(108, 92, 231, 0.05)', border: '2px solid var(--accent-color)', borderRadius: '6px' }}></div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}></div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Occupied</span>
          </div>
        </div>
      </div>
    </div>
  );
};
