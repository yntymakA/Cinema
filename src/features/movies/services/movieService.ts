import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { Movie } from '../types';

const moviesCollection = collection(db, 'movies');

export const movieService = {
  // Get all movies
  getMovies: async (): Promise<Movie[]> => {
    try {
      const snapshot = await getDocs(moviesCollection);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Movie[];
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  },

  // Get a single movie by ID
  getMovieById: async (id: string): Promise<Movie | null> => {
    try {
      const movieDoc = doc(db, 'movies', id);
      const snapshot = await getDoc(movieDoc);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Movie;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching movie ${id}:`, error);
      throw error;
    }
  },

  // Add a new movie (Admin)
  addMovie: async (movie: Omit<Movie, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(moviesCollection, movie);
      return docRef.id;
    } catch (error) {
      console.error("Error adding movie:", error);
      throw error;
    }
  },

  // Update a movie (Admin)
  updateMovie: async (id: string, updates: Partial<Movie>): Promise<void> => {
    try {
      const movieDoc = doc(db, 'movies', id);
      await updateDoc(movieDoc, updates);
    } catch (error) {
      console.error(`Error updating movie ${id}:`, error);
      throw error;
    }
  },

  // Delete a movie (Admin)
  deleteMovie: async (id: string): Promise<void> => {
    try {
      const movieDoc = doc(db, 'movies', id);
      await deleteDoc(movieDoc);
    } catch (error) {
      console.error(`Error deleting movie ${id}:`, error);
      throw error;
    }
  }
};
