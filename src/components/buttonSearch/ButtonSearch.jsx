import { Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './ButtonSearch.module.scss';
import { HomeContext } from '../Home/HomeContext';
import { useKinopoiskApi } from '../../hooks/useKinopoiskApi';

export default function ButtonSearch() {
  const { setItems, setFavor, setPages, lang } = React.useContext(HomeContext);
  const { languageSearch } = React.useContext(HomeContext);
  const { makeRequest } = useKinopoiskApi();

  const searched = async () => {
    setFavor(false);

    try {
      const data = await makeRequest({
        endpoint: 'movie',
        params: {
          limit: 20,
          sortField: 'votes.kp',
          sortType: '-1',
          type: 'movie',
        },
        cacheKey: `popular_movies_${lang}`,
        priority: 'high',
      });

      const adaptedData = {
        results: data.docs || [],
        total_pages: data.pages || 1,
      };

      setItems(adaptedData.results);
      setPages(adaptedData.total_pages);
      console.log('Популярные фильмы:', adaptedData);
    } catch (error) {
      console.error('Ошибка при поиске популярных фильмов:', error);
      setItems([]);
      setPages(1);
    }
  };

  return (
    <div className={styles.root}>
      <Button
        onClick={searched}
        className={styles.button}
        type="primary"
        icon={<SearchOutlined />}
        iconPosition="end"
      >
        {languageSearch !== 'en-En' ? 'Поиск' : 'Search'}
      </Button>
    </div>
  );
}
