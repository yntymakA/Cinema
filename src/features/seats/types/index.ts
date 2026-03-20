export interface Cinema {
  id: string;
  name: string;
  movie_id: string;
}

export interface Seat {
  id: string;
  cinema_id: string;
  seat_number: string;
  is_booked: boolean;
}

export interface Booking {
  id: string;
  user_id: string;
  seat_id: string;
  movie_id: string;
}
