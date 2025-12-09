// components/RoadmapImporter.jsx (исправленная версия)
import { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies'; // Изменяем импорт
import './RoadmapImporter.css';

function RoadmapImporter() {
    const { technologies, setTechnologies } = useTechnologies(); // Используем обычный хук
    const [importing, setImporting] = useState(false);

    const handleImportRoadmap = async () => {
        try {
            setImporting(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const roadmapData = {
                technologies: [
                    {
                        id: Date.now() + 1,
                        title: 'JavaScript ES6+',
                        description: 'Современные возможности JavaScript',
                        category: 'frontend',
                        difficulty: 'beginner',
                        resources: ['https://learn.javascript.ru', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'],
                        status: 'not-started',
                        notes: 'Важно изучить async/await, promises, деструктуризацию'
                    },
                    {
                        id: Date.now() + 2,
                        title: 'CSS Grid & Flexbox',
                        description: 'Современные техники верстки',
                        category: 'frontend',
                        difficulty: 'beginner',
                        resources: ['https://css-tricks.com/snippets/css/a-guide-to-flexbox/'],
                        status: 'not-started',
                        notes: 'Основа современной верстки'
                    },
                    {
                        id: Date.now() + 3,
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

            // Добавляем к существующим технологиям
            const updatedTechnologies = [...technologies, ...roadmapData.technologies];
            setTechnologies(updatedTechnologies);

            alert(`✅ Успешно импортировано ${roadmapData.technologies.length} технологий`);
        } catch (err) {
            alert(`❌ Ошибка импорта: ${err.message}`);
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="roadmap-importer">
            <h3>📋 Импорт дорожной карты из API</h3>
            <div className="import-actions">
                <button
                    onClick={handleImportRoadmap}
                    disabled={importing}
                    className="import-button"
                    aria-label="Импортировать пример дорожной карты"
                >
                    {importing ? '⏳ Импорт...' : '📥 Импорт пример дорожной карты'}
                </button>
                <p className="import-hint">
                    Импортирует пример технологий с ресурсами и дедлайнами
                </p>
            </div>
        </div>
    );
}

export default RoadmapImporter;