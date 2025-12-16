// hooks/useTechnologiesApi.js
import { useState, useEffect, useCallback, useRef } from 'react';

// Кастомный хук для работы с API (по ТЗ Пример 3)
function useTechnologiesApi() {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Создаем AbortController для отмены запросов
    const abortControllerRef = useRef(null);

    // Функция для загрузки технологий из API (с useCallback как в ТЗ)
    const fetchTechnologies = useCallback(async () => {
        // Отменяем предыдущий запрос, если он существует
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Создаем новый AbortController для текущего запроса
        abortControllerRef.current = new AbortController();

        try {
            setLoading(true);
            setError(null);

            // В реальном приложении здесь будет запрос к вашему API
            // Сейчас имитируем загрузку с задержкой
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Мок данные - в реальном приложении замените на реальный API
            const mockTechnologies = [
                {
                    id: 1,
                    title: 'React',
                    description: 'Библиотека для создания пользовательских интерфейсов',
                    category: 'frontend',
                    difficulty: 'beginner',
                    resources: ['https://react.dev', 'https://ru.reactjs.org'],
                    status: 'not-started',
                    notes: ''
                },
                {
                    id: 2,
                    title: 'Node.js',
                    description: 'Среда выполнения JavaScript на сервере',
                    category: 'backend',
                    difficulty: 'intermediate',
                    resources: ['https://nodejs.org', 'https://nodejs.org/ru/docs/'],
                    status: 'not-started',
                    notes: ''
                },
                {
                    id: 3,
                    title: 'Typescript',
                    description: 'Типизированное надмножество JavaScript',
                    category: 'language',
                    difficulty: 'intermediate',
                    resources: ['https://www.typescriptlang.org'],
                    status: 'not-started',
                    notes: ''
                }
            ];

            // Имитируем реальный API запрос с AbortController
            if (!abortControllerRef.current.signal.aborted) {
                setTechnologies(mockTechnologies);
            }

        } catch (err) {
            // Игнорируем ошибки отмены запроса (как в ТЗ Пример 2)
            if (err.name !== 'AbortError') {
                setError('Не удалось загрузить технологии');
                console.error('Ошибка загрузки:', err);
            }
        } finally {
            setLoading(false);
        }
    }, []); // Пустой массив зависимостей как в ТЗ

    // Добавление новой технологии
    const addTechnology = useCallback(async (techData) => {
        try {
            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 500));

            const newTech = {
                id: Date.now(), // В реальном приложении ID генерируется на сервере
                ...techData,
                createdAt: new Date().toISOString(),
                status: techData.status || 'not-started',
                notes: techData.notes || ''
            };

            setTechnologies(prev => [...prev, newTech]);
            return newTech;

        } catch (err) {
            throw new Error('Не удалось добавить технологию');
        }
    }, []);

    // Функция для загрузки дополнительных ресурсов (Задание 2 из ТЗ)
    const fetchTechnologyResources = useCallback(async (techName) => {
        try {
            // Имитация API запроса для ресурсов
            await new Promise(resolve => setTimeout(resolve, 700));
            
            const resourcesMap = {
                'React': ['https://react.dev', 'https://ru.reactjs.org'],
                'Node.js': ['https://nodejs.org', 'https://nodejs.org/en/docs/'],
                'Typescript': ['https://www.typescriptlang.org'],
                'JavaScript ES6+': ['https://learn.javascript.ru', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'],
                'CSS Grid & Flexbox': ['https://css-tricks.com/snippets/css/a-guide-to-flexbox/'],
                'Express.js': ['https://expressjs.com']
            };
            
            return resourcesMap[techName] || [];
        } catch (err) {
            console.error('Ошибка загрузки ресурсов:', err);
            return [];
        }
    }, []);

    // Выполняем запрос при монтировании компонента (как в ТЗ)
    useEffect(() => {
        fetchTechnologies();

        // Функция очистки - отменяем запрос при размонтировании
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchTechnologies]);

    // Функция для повторного выполнения запроса
    const refetch = useCallback(() => {
        fetchTechnologies();
    }, [fetchTechnologies]);

    return {
        technologies,
        loading,
        error,
        refetch,
        addTechnology,
        fetchTechnologyResources
    };
}

export default useTechnologiesApi;