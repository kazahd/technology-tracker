// services/technologyResourcesApi.js
const technologyResourcesApi = {
  // Имитация API для получения ресурсов по технологии
  async getResourcesByTechnology(techName) {
    // В реальном приложении здесь будет fetch к вашему API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const resourcesMap = {
      'React': [
        {
          id: 1,
          title: 'React Official Docs',
          url: 'https://react.dev',
          type: 'documentation',
          language: 'en'
        },
        {
          id: 2,
          title: 'React Русская документация',
          url: 'https://ru.reactjs.org',
          type: 'documentation',
          language: 'ru'
        }
      ],
      'JavaScript': [
        {
          id: 1,
          title: 'MDN JavaScript Guide',
          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
          type: 'documentation',
          language: 'en'
        },
        {
          id: 2,
          title: 'Learn JavaScript',
          url: 'https://learn.javascript.ru',
          type: 'tutorial',
          language: 'ru'
        }
      ]
    };
    
    return resourcesMap[techName] || [
      {
        id: 1,
        title: `Search ${techName} tutorials`,
        url: `https://www.google.com/search?q=${encodeURIComponent(techName + ' tutorial')}`,
        type: 'search',
        language: 'any'
      }
    ];
  },
  
  // Имитация поиска ресурсов по теме
  async searchResources(query) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      {
        id: 1,
        title: `Результаты для "${query}"`,
        url: `https://www.google.com/search?q=${encodeURIComponent(query + ' programming tutorial')}`,
        type: 'search',
        source: 'Google'
      },
      {
        id: 2,
        title: `YouTube: ${query} tutorials`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' programming')}`,
        type: 'video',
        source: 'YouTube'
      }
    ];
  }
};

export default technologyResourcesApi;