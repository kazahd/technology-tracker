import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Technologies from './pages/Technologies';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/technologies" element={<Technologies />} />
            <Route path="/technology/:techId" element={<TechnologyDetail />} />
            <Route path="/add" element={<AddTechnology />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Редирект для старых маршрутов */}
            <Route path="/add-technology" element={<AddTechnology />} />
          </Routes>
        </main>

        <footer className="App-footer">
          <p>Трекер изучения технологий • Практическое занятие 23 • {new Date().getFullYear()}</p>
          <p style={{ fontSize: '0.8em', marginTop: '5px', opacity: 0.7 }}>
            React Router • Многостраничное SPA • Данные сохраняются в localStorage
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;