// components/RoadmapImporter.jsx
import { useState } from 'react';
import useTechnologiesApi from '../hooks/useTechnologiesApi';
import './RoadmapImporter.css';

function RoadmapImporter() {
  const { addTechnology } = useTechnologiesApi();
  const [importing, setImporting] = useState(false);

  const handleImportRoadmap = async () => {
    try {
      setImporting(true);

      // Имитация загрузки дорожной карты из API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Мок данные дорожной карты
      const roadmapData = {
        technologies: [
          {
            title: 'JavaScript ES6+',
            description: 'Современные возможности JavaScript',
            category: 'frontend',
            difficulty: 'beginner',
            resources: ['https://learn.javascript.ru', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'],
            status: 'not-started',
            notes: 'Важно изучить async/await, promises, деструктуризацию'
          },
          {
            title: 'CSS Grid & Flexbox',
            description: 'Современные техники верстки',
            category: 'frontend',
            difficulty: 'beginner',
            resources: ['https://css-tricks.com/snippets/css/a-guide-to-flexbox/'],
            status: 'not-started',
            notes: 'Основа современной верстки'
          },
          {
            title: 'Express.js',
            description: 'Фреймворк для Node.js',
            category: 'backend',
            difficulty: 'intermediate',
            resources: ['https://expressjs.com'],
            status: 'not-started',
            notes: ''
          }
        ]
      };

      // Добавляем каждую технологию из дорожной карты
      for (const tech of roadmapData.technologies) {
        await addTechnology(tech);
      }

      alert(`Успешно импортировано ${roadmapData.technologies.length} технологий`);

    } catch (err) {
      alert(`Ошибка импорта: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="roadmap-importer">
      <h3>📋 Импорт дорожной карты</h3>

      <div className="import-actions">
        <button
          onClick={handleImportRoadmap}
          disabled={importing}
          className="import-button"
        >
          {importing ? 'Импорт...' : '📥 Импорт пример дорожной карты'}
        </button>
      </div>
    </div>
  );
}

export default RoadmapImporter;