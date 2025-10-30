/* eslint-disable no-unused-vars */
import { useState, useCallback, useEffect } from 'react';
import { mockMovies, mockFilmDetails } from '../data/mockData';

const KINOPOISK_API_URL =
  import.meta.env.VITE_KINOPOISK_API_URL || 'https://api.kinopoisk.dev/v1.4';

// Функция для получения токена из разных источников
const getToken = () => {
  // 1. Пользовательский токен из localStorage
  const userToken = localStorage.getItem('kinopoisk_user_token');
  if (userToken) return userToken;

  // 2. Токен из environment variables
  const envToken = import.meta.env.VITE_KINOPOISK_API_TOKEN;
  if (envToken) return envToken;

  // 3. Нет токена
  return null;
};

// Функция проверки использования мок-данных
const shouldUseMock = () => {
  return localStorage.getItem('use_mock_data') === 'true' || !getToken();
};

export const useKinopoiskApi = () => {
  const [cache] = useState(new Map());
  const [isOnline] = useState(navigator.onLine);
  const [tokenState, setTokenState] = useState(getToken());
  const [requestsCount, setRequestsCount] = useState(0);
  const [lastError, setLastError] = useState(null);

  // Обновляем состояние токена при изменении
  useEffect(() => {
    const handleStorageChange = () => {
      setTokenState(getToken());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const makeRequest = useCallback(
    async ({
      endpoint,
      params = {},
      method = 'GET',
      data = null,
      cacheKey = null,
      priority = 'medium',
      retryCount = 0,
    }) => {
      const currentToken = getToken();
      const useMock = shouldUseMock() || !currentToken || !isOnline;

      // Приоритеты для кэширования
      const priorities = {
        high: 1000 * 60 * 5, // 5 минут
        medium: 1000 * 60 * 10, // 10 минут
        low: 1000 * 60 * 30, // 30 минут
      };

      // Проверка кэша
      if (cacheKey && cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.timestamp < (priorities[priority] || priorities.medium)) {
          console.log(`Используем кэшированные данные для: ${cacheKey}`);
          return cached.data;
        }
      }

      // Используем мок-данные если нет токена или оффлайн
      if (useMock) {
        console.log('Используем мок-данные (отсутствует токен или оффлайн режим)');

        if (endpoint.includes('movie/') && !endpoint.includes('rating')) {
          return { ...mockFilmDetails, id: endpoint.split('/')[1] };
        } else if (endpoint.includes('rating')) {
          return { success: true };
        } else {
          return mockMovies;
        }
      }

      // Реальный запрос к API
      try {
        setRequestsCount((prev) => prev + 1);

        const url = new URL(`${KINOPOISK_API_URL}/${endpoint}`);

        // Добавляем параметры в URL
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
          }
        });

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': currentToken,
          },
          body: data ? JSON.stringify(data) : null,
        });

        if (!response.ok) {
          // Обработка ошибок API
          if (response.status === 402) {
            setLastError('QUOTA_EXCEEDED'); // Закончились запросы
            throw new Error('Достигнут лимит запросов для токена');
          } else if (response.status === 401) {
            setLastError('INVALID_TOKEN'); // Невалидный токен
            throw new Error('Неверный API токен');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const result = await response.json();
        setLastError(null);

        // Сохраняем в кэш
        if (cacheKey) {
          cache.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
          });
        }

        return result;
      } catch (error) {
        console.error('API request failed:', error);

        // Retry логика для сетевых ошибок
        if (error.message.includes('network') && retryCount < 3) {
          console.log(`Retry attempt ${retryCount + 1}`);
          await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));
          return makeRequest({
            endpoint,
            params,
            method,
            data,
            cacheKey,
            priority,
            retryCount: retryCount + 1,
          });
        }

        // Fallback to mock data on error
        console.log('Fallback to mock data due to error');
        if (endpoint.includes('movie/') && !endpoint.includes('rating')) {
          return mockFilmDetails;
        } else {
          return mockMovies;
        }
      }
    },
    [cache, isOnline],
  );

  const getCachedData = useCallback(
    (cacheKey) => {
      const cached = cache.get(cacheKey);
      return cached ? cached.data : null;
    },
    [cache],
  );

  const clearCache = useCallback(() => {
    cache.clear();
  }, [cache]);

  const getTokenStatus = useCallback(() => {
    const token = getToken();
    return {
      hasToken: !!token,
      isMockMode: shouldUseMock(),
      lastError,
      requestsCount,
    };
  }, [lastError, requestsCount]);

  const resetToken = useCallback(() => {
    localStorage.removeItem('kinopoisk_user_token');
    localStorage.removeItem('use_mock_data');
    setTokenState(null);
    setLastError(null);
  }, []);

  return {
    makeRequest,
    getCachedData,
    clearCache,
    getTokenStatus,
    resetToken,
    isOnline,
  };
};
