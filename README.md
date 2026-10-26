# 🌌 Atmosphere — Weather & Cinema

**Atmosphere** is a responsive web application that combines real-time weather information and movie discovery in one place. Check the weather in your city and explore movies through a modern, interactive interface.

## ✨ Features

### 🌦️ Weather App
- Search for weather information by city name.
- View the current temperature and weather conditions.
- Check humidity and wind speed.
- Display weather information using data from a weather API.
- Handle invalid city names and API errors gracefully.

### 🎬 Movie Search App
- Search for movies by title.
- Display movie posters and titles.
- View movie ratings and release years.
- Access additional movie information, such as plot and genre, when available.
- Handle empty searches and movies that cannot be found.

### 🎨 User Interface
- Modern dark-themed design.
- Clean layout with blue and cyan accents.
- Responsive design for desktop, tablet, and mobile devices.
- Interactive search forms and result cards.
- Loading indicators and error messages.

## 🛠️ Technologies Used

- **HTML5** — Website structure.
- **CSS3** — Styling and responsive layouts.
- **JavaScript (ES6+)** — Application logic and interactivity.
- **JavaScript Modules** — Organizing code into separate files.
- **Fetch API** — Retrieving weather and movie data.
- **Async/Await** — Handling asynchronous API requests.
- **Open-Meteo API** — Weather forecasts and city geocoding.
- **OMDb API** — Movie information and search results.
- **Git & GitHub** — Version control and project hosting.

## 📁 Project Structure

```text
atmosphere-cinema/
│
├── index.html
├── style.css
├── .gitignore
│
└── js/
    ├── main.js
    ├── weather.js
    ├── movies.js
    └── config.js
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Open the Project

Open the project folder in Visual Studio Code.

### 3. Configure the OMDb API Key

The movie search feature requires an OMDb API key.

1. Visit [OMDb API](https://www.omdbapi.com/apikey.aspx).
2. Request an API key and follow the activation instructions.
3. Open `js/config.js`.
4. Add your API key.

Example:

```javascript
export const OMDB_API_KEY = "YOUR_OMDB_API_KEY";
export const OMDB_BASE_URL = "https://www.omdbapi.com/";
```

Replace `YOUR_OMDB_API_KEY` with your actual key.

**Note:** The weather feature uses Open-Meteo, which does not normally require an API key for its public forecast and geocoding services.

### 4. Run the Application

Because the project uses JavaScript modules, run it through a local development server rather than opening `index.html` directly.

Using Visual Studio Code:

1. Install the **Live Server** extension if you haven't already.
2. Open `index.html`.
3. Right-click inside the file.
4. Select **Open with Live Server**.

The application should open in your browser.

## 🔑 API Information

### Weather API

**Provider:** Open-Meteo

Open-Meteo provides weather forecast data and geocoding services used to find a city's coordinates.

Website: [https://open-meteo.com/](https://open-meteo.com/)

### Movie API

**Provider:** OMDb API

OMDb provides movie search results and information such as titles, posters, release years, and ratings.

Website: [https://www.omdbapi.com/](https://www.omdbapi.com/)

API key registration: [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)

## 🔒 Security Notes

- Do not commit API keys or other secrets to a public GitHub repository.
- Add `js/config.js` to `.gitignore` if it contains your API key.
- If `js/config.js` is ignored, provide a separate example configuration file without a real key so other developers know how to configure the project.
- **Important:** An API key used in browser-side JavaScript can still be discovered by visitors. For production use, consider moving movie API requests to a backend and storing the key in an environment variable.
- If a key has already been pushed publicly, consider revoking or regenerating it.

## 📱 Responsive Design

Atmosphere is designed to adapt to different screen sizes, including:

- Desktop computers
- Laptops
- Tablets
- Mobile phones

## 🎯 Project Objectives

This project demonstrates practical application of:

- Building a responsive website using HTML and CSS.
- Using JavaScript to manipulate the DOM.
- Handling form submissions and user interactions.
- Fetching data from external APIs.
- Working with asynchronous JavaScript.
- Organizing code using ES modules.
- Handling loading states, errors, and missing results.
- Managing a project using Git and GitHub.

## 🔮 Future Improvements

Potential improvements include:

- Weather forecasts for multiple days.
- Weather icons and animated backgrounds.
- Movie genre filters.
- A movie details modal.
- A favorites list for movies.
- Search history.
- Improved accessibility.
- A backend for securely handling API requests.
- Deployment to a public hosting platform.

## 👨‍💻 Author

**Dharnesh Baala S**

Full Stack Developer | Aspiring Entrepreneur

## 📄 License

This project is intended for educational and portfolio purposes. Add a suitable open-source license if you plan to distribute it for reuse.