import {
  OMDB_API_KEY,
  OMDB_BASE_URL
} from "./config.js";

export async function searchMovies(title) {
  const query = title.trim();

  if (!query) {
    throw new Error(
      "Enter a movie title to start searching."
    );
  }

  if (
    !OMDB_API_KEY ||
    OMDB_API_KEY === "ADD_YOUR_OMDB_API_KEY_HERE"
  ) {
    throw new Error(
      "Add your OMDb API key in js/config.js to enable movie search."
    );
  }

  const url =
    `${OMDB_BASE_URL}?apikey=${encodeURIComponent(OMDB_API_KEY)}` +
    `&s=${encodeURIComponent(query)}&type=movie`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "The movie service is unavailable. Please try again."
    );
  }

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(
      data.Error || "No movies found. Try another title."
    );
  }

  return (data.Search || []).map(
    ({ Title, Year, imdbID, Poster, Type }) => ({
      title: Title,
      year: Year,
      id: imdbID,
      poster: Poster,
      type: Type
    })
  );
}

export async function getMovieDetails(id) {
  const url =
    `${OMDB_BASE_URL}?apikey=${encodeURIComponent(OMDB_API_KEY)}` +
    `&i=${encodeURIComponent(id)}&plot=short`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Couldn't load movie details.");
  }

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(
      data.Error || "Couldn't load movie details."
    );
  }

  return {
    title: data.Title,
    year: data.Year,
    rated: data.Rated,
    released: data.Released,
    runtime: data.Runtime,
    genre: data.Genre,
    director: data.Director,
    plot: data.Plot,
    rating: data.imdbRating,
    poster: data.Poster,
    actors: data.Actors
  };
}