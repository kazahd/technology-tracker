import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="main-navigation">
      <div className="nav-brand">
        <Link to="/">
          <h2>🎯 Трекер технологий</h2>
        </Link>
      </div>

      <ul className="nav-menu">
        <li>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            🏠 Главная
          </Link>
        </li>
        <li>
          <Link
            to="/technologies"
            className={`nav-link ${isActive('/technologies') ? 'active' : ''}`}
          >
            📚 Все технологии
          </Link>
        </li>
        <li>
          <Link
            to="/add"
            className={`nav-link ${isActive('/add') ? 'active' : ''}`}
          >
            ➕ Добавить технологию
          </Link>
        </li>
        <li>
          <Link
            to="/statistics"
            className={`nav-link ${isActive('/statistics') ? 'active' : ''}`}
          >
            📊 Статистика
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
          >
            ⚙️ Настройки
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;