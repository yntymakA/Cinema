import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  addDoc, 
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { Cinema, Seat } from '../types';

export const seatService = {
  // Finds or creates a cinema and its seats for a given movie
  getSeatsForMovie: async (movieId: string): Promise<{ cinema: Cinema, seats: Seat[] }> => {
    try {
      // 1. Check if a cinema already exists for this movie
      const cinemasRef = collection(db, 'cinemas');
      const q = query(cinemasRef, where('movie_id', '==', movieId));
      const cinemaSnap = await getDocs(q);

      let cinemaId = '';
      let cinemaData: Partial<Cinema> = {};

      if (cinemaSnap.empty) {
        // 2. No cinema found. Let's auto-generate one for this movie so we can test bookings easily
        const newCinemaRef = await addDoc(cinemasRef, {
          name: 'Main Hall',
          movie_id: movieId
        });
        cinemaId = newCinemaRef.id;
        cinemaData = { id: cinemaId, name: 'Main Hall', movie_id: movieId };

        // Generate 9 seats (A1-A3, B1-B3, C1-C3)
        const batch = writeBatch(db);
        const rows = ['A', 'B', 'C'];
        for (const row of rows) {
          for (let i = 1; i <= 3; i++) {
            const seatRef = doc(collection(db, 'seats'));
            batch.set(seatRef, {
              cinema_id: cinemaId,
              seat_number: `${row}${i}`,
              is_booked: false
            });
          }
        }
        await batch.commit();
      } else {
        cinemaId = cinemaSnap.docs[0].id;
        cinemaData = { id: cinemaId, ...cinemaSnap.docs[0].data() } as Cinema;
      }

      // 3. Fetch all seats for this cinema
      const seatsRef = collection(db, 'seats');
      const seatsQuery = query(seatsRef, where('cinema_id', '==', cinemaId));
      const seatsSnap = await getDocs(seatsQuery);

      const seats: Seat[] = seatsSnap.docs.map(s => ({
        id: s.id,
        ...s.data()
      })) as Seat[];

      // Sort seats alphabetically (A1, A2, B1...)
      seats.sort((a, b) => a.seat_number.localeCompare(b.seat_number));

      return {
        cinema: cinemaData as Cinema,
        seats
      };
    } catch (error) {
      console.error("Error fetching/generating seats:", error);
      throw error;
    }
  },

  // Securely book a seat using a Firestore Transaction to prevent double-booking
  bookSeat: async (seatId: string, userId: string, movieId: string): Promise<void> => {
    const seatRef = doc(db, 'seats', seatId);
    const bookingsRef = collection(db, 'bookings');

    try {
      await runTransaction(db, async (transaction) => {
        const seatDoc = await transaction.get(seatRef);

        if (!seatDoc.exists()) {
          throw new Error("Seat does not exist!");
        }

        const seatData = seatDoc.data() as Seat;
        if (seatData.is_booked) {
          // If transaction hits this, another user beat them to it!
          throw new Error("Sorry, this seat has already been booked by someone else.");
        }

        // 1. Mark seat as booked
        transaction.update(seatRef, { is_booked: true });

        // 2. Create the booking record
        const newBookingRef = doc(bookingsRef);
        transaction.set(newBookingRef, {
          user_id: userId,
          seat_id: seatId,
          movie_id: movieId
        });
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
      throw error; 
    }
  }
};
