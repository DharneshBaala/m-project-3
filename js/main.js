import { getWeatherByCity } from "./weather.js";

import {
  searchMovies,
  getMovieDetails
} from "./movies.js";

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];

const views = ["overview", "weather", "movies"];

const toast = $("#toast");

let toastTimer;

// Display today's date in the header.
$("#today-label").textContent = new Intl.DateTimeFormat(
  "en",
  {
    weekday: "short",
    month: "short",
    day: "numeric"
  }
)
  .format(new Date())
  .toUpperCase();

// Display a temporary notification.
function showToast(message) {
  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

// Switch between the overview, weather and movies views.
function setView(name) {
  views.forEach(view => {
    $(`#${view}-view`).classList.toggle(
      "active-view",
      view === name
    );

    $(`.nav-item[data-view="${view}"]`).classList.toggle(
      "active",
      view === name
    );
  });

  $("#breadcrumb-current").textContent = {
    overview: "Overview",
    weather: "Weather explorer",
    movies: "Movie discovery"
  }[name];

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Sidebar navigation buttons.
$$(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    setView(button.dataset.view);
  });
});

// Buttons that open a particular section.
$$("[data-go]").forEach(button => {
  button.addEventListener("click", () => {
    setView(button.dataset.go);
  });
});

// Display status messages.
function setStatus(id, message, type = "") {
  const element = $(id);

  if (!element) return;

  element.textContent = message;

  element.className = `status-message ${type}`.trim();
}

// Update the weather information in a weather card.
function updateWeatherCard(prefix, weather) {
  const set = (suffix, value) => {
    const node = $(`#${prefix}${suffix}`);

    if (node) {
      node.textContent = value;
    }
  };

  set(
    "weather-city",
    `${weather.city}${weather.region ? `, ${weather.region}` : ""}`
  );

  set("weather-temp", `${weather.temperature}°`);
  set("weather-condition", weather.condition);

  set(
    "weather-range",
    weather.isDay
      ? "Daytime conditions"
      : "Night-time conditions"
  );

  set("weather-symbol", weather.icon);
  set("weather-feels", `${weather.feelsLike}°C`);
  set("weather-humidity", `${weather.humidity}%`);
  set("weather-wind", `${weather.wind} km/h`);
}

// Fetch weather data and update both weather cards.
async function loadWeather(city) {
  setStatus(
    "#weather-status",
    `Looking up ${city.trim()}…`
  );

  try {
    const weather = await getWeatherByCity(city);

    // Update the overview weather card.
    updateWeatherCard("", weather);

    // Update the detailed weather card.
    updateWeatherCard("detail-", weather);

    $("#local-time").textContent = weather.localTime;

    $("#wind-direction").textContent =
      weather.windDirection;

    $("#coordinates").textContent =
      `${weather.latitude}, ${weather.longitude}`;

    setStatus(
      "#weather-status",
      `Updated just now · ${weather.city}, ${weather.country}`,
      "success"
    );
  } catch (error) {
    setStatus(
      "#weather-status",
      error.message,
      "error"
    );

    showToast(error.message);
  }
}

// Handle weather search form submission.
$("#weather-search-form").addEventListener(
  "submit",
  event => {
    event.preventDefault();

    const city = $("#city-query").value.trim();

    if (city) {
      loadWeather(city);
    } else {
      showToast("Please enter a city name.");
    }
  }
);

// Create and display movie cards.
function renderMovieCards(movies, target) {
  target.innerHTML = "";

  if (!movies.length) {
    target.innerHTML = `
      <div class="empty-state">
        <strong>No movies to show yet.</strong>
        Search for a title to fill this space with stories.
      </div>
    `;

    return;
  }

  movies.forEach(movie => {
    const card = document.createElement("article");

    card.className = "movie-card";
    card.tabIndex = 0;

    card.setAttribute("role", "button");

    card.setAttribute(
      "aria-label",
      `View details for ${movie.title}`
    );

    const poster =
      movie.poster && movie.poster !== "N/A"
        ? `
          <img
            src="${escapeHtml(movie.poster)}"
            alt="${escapeHtml(movie.title)} poster"
            loading="lazy"
          >
        `
        : `<div class="poster-placeholder">✦</div>`;

    card.innerHTML = `
      <div class="poster-wrap">
        ${poster}

        <span class="rating-pill">
          ★ ${
            escapeHtml(
              movie.rating && movie.rating !== "NR"
                ? movie.rating
                : "IMDb"
            )
          }
        </span>
      </div>

      <div class="movie-info">
        <h3 title="${escapeHtml(movie.title)}">
          ${escapeHtml(movie.title)}
        </h3>

        <div class="movie-meta">
          <span>${escapeHtml(movie.year || "Year unknown")}</span>
          <span>FILM ↗</span>
        </div>
      </div>
    `;

    // Clicking a card displays more movie information.
    card.addEventListener("click", () => {
      showMovieDetails(movie);
    });

    // Allow keyboard users to open a movie card.
    card.addEventListener("keydown", event => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        showMovieDetails(movie);
      }
    });

    // Show a placeholder if the poster cannot load.
    const img = card.querySelector("img");

    if (img) {
      img.addEventListener("error", () => {
        const placeholder = document.createElement("div");

        placeholder.className = "poster-placeholder";
        placeholder.textContent = "✦";

        img.replaceWith(placeholder);
      });
    }

    target.append(card);
  });
}

// Escape text before placing API values inside HTML.
function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]
  );
}

// Fetch and display details when a movie card is clicked.
async function showMovieDetails(movie) {
  try {
    const detail = await getMovieDetails(movie.id);

    const message =
      `${detail.title} (${detail.year}) · ` +
      `IMDb ${detail.rating || "N/A"} · ` +
      `${detail.genre || "Genre N/A"} — ` +
      `${detail.plot || "No plot summary available."}`;

    showToast(
      message.length > 210
        ? `${message.slice(0, 207)}…`
        : message
    );
  } catch (error) {
    showToast(error.message);
  }
}

// Handle searches from both movie search forms.
async function handleMovieSearch(form) {
  const input = $('input[name="query"]', form);

  const query = input.value.trim();

  const isPage =
    form.closest("#movies-view") !== null;

  if (!query) {
    showToast("Type a movie title first.");
    input.focus();
    return;
  }

  const status = isPage
    ? "#movie-status"
    : null;

  if (status) {
    setStatus(
      status,
      `Searching for "${query}"…`
    );
  } else {
    $("#overview-movie-results").innerHTML = `
      <div class="empty-state">
        <strong>Searching the archives…</strong>
        Looking for "${escapeHtml(query)}".
      </div>
    `;

    setView("overview");
  }

  try {
    const movies = await searchMovies(query);

    // Search results do not include IMDb ratings.
    // Fetch details for a small number of results.
    const ratedMovies = await Promise.all(
      movies
        .slice(0, isPage ? 8 : 4)
        .map(async movie => {
          try {
            const detail = await getMovieDetails(
              movie.id
            );

            return {
              ...movie,
              rating:
                detail.rating &&
                detail.rating !== "N/A"
                  ? detail.rating
                  : "NR"
            };
          } catch {
            return {
              ...movie,
              rating: "NR"
            };
          }
        })
    );

    if (isPage) {
      $("#movie-results-title").textContent =
        `Results for "${query}"`;

      $("#movie-result-count").textContent =
        `${movies.length} TITLES FOUND`;

      renderMovieCards(
        ratedMovies,
        $("#movie-results")
      );

      setStatus(
        status,
        `Showing matches for "${query}".`,
        "success"
      );
    } else {
      renderMovieCards(
        ratedMovies,
        $("#overview-movie-results")
      );

      showToast(
        `${movies.length} movie results found.`
      );
    }
  } catch (error) {
    if (isPage) {
      $("#movie-results").innerHTML = "";

      $("#movie-result-count").textContent =
        "SEARCH INCOMPLETE";

      setStatus(
        status,
        error.message,
        "error"
      );
    } else {
      $("#overview-movie-results").innerHTML = `
        <div class="empty-state">
          <strong>Ready for your first search.</strong>
          ${escapeHtml(error.message)}
        </div>
      `;

      showToast(error.message);
    }
  }
}

// Attach search handlers to both movie forms.
$$("[data-movie-search]").forEach(form => {
  form.addEventListener("submit", event => {
    event.preventDefault();

    handleMovieSearch(form);

    if (form.id !== "") {
      setView("movies");
    }
  });
});

// Load an initial weather report when the app opens.
loadWeather("Coimbatore");