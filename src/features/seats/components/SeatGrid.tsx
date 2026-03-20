import type { FC } from 'react';
import type { Seat } from '../types';

interface SeatGridProps {
  seats: Seat[];
  onSeatClick: (seat: Seat) => void;
  bookingInProgress: boolean;
}

export const SeatGrid: FC<SeatGridProps> = ({ seats, onSeatClick, bookingInProgress }) => {
  if (!seats || seats.length === 0) {
    return <div style={{ color: 'var(--text-secondary)' }}>No seats available for this cinema.</div>;
  }

  return (
    <div className="seats-grid">
      {seats.map(seat => {
        let seatClass = 'seat-button ';
        if (seat.is_booked) seatClass += 'booked ';
        if (bookingInProgress) seatClass += 'booking-in-progress ';

        return (
          <button
            key={seat.id}
            onClick={() => onSeatClick(seat)}
            disabled={seat.is_booked || bookingInProgress}
            className={seatClass.trim()}
            title={seat.is_booked ? "Occupied" : "Available"}
          >
            {seat.seat_number}
          </button>
        )
      })}
    </div>
  );
};
