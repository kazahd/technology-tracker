// components/RoadmapImporter.jsx
import { useState } from 'react';
import useTechnologiesApi from '../hooks/useTechnologiesApi';
import './RoadmapImporter.css';

function RoadmapImporter() {
    const { addTechnology, loading, error } = useTechnologiesApi();
    const [importing, setImporting] = useState(false);

    const handleImportRoadmap = async () => {
        try {
            setImporting(true);
            
            // УДАЛИТЬ ЭТУ СТРОКУ:
            // const response = await fetch('https://api.example.com/roadmaps/frontend');
            
            // ВМЕСТО ЭТОГО использовать мок-данные:
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Мок данные (как было в коде)
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

            // Добавляем каждую технологию
            let importedCount = 0;
            for (const tech of roadmapData.technologies) {
                await addTechnology(tech);
                importedCount++;
            }

            alert(`✅ Успешно импортировано ${importedCount} технологий из API`);

        } catch (err) {
            // Теперь здесь будет реальная ошибка (если addTechnology сломается)
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
                    disabled={importing || loading}
                    className="import-button"
                    aria-label="Импортировать пример дорожной карты"
                >
                    {importing ? '⏳ Импорт...' : '📥 Импорт пример дорожной карты'}
                </button>
                <p className="import-hint">
                    Импортирует пример технологий из внешнего API с ресурсами
                </p>
            </div>

            {error && (
                <div className="error-message">
                    Ошибка API: {error}
                </div>
            )}
        </div>
    );
}

export default RoadmapImporter;