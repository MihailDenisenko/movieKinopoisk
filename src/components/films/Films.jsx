/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import Film from '../Film/Film';
import { Flex, Spin } from 'antd';
import { useDebounce } from 'use-debounce';
import { HomeContext } from '../Home/Home';
import { useKinopoiskApi } from '../../hooks/useKinopoiskApi';

export default function Films() {
  const { setJson, paginPage, languageSearch, loading, searchVal, items, setItems } =
    useContext(HomeContext);

  const [loader, setLoader] = useState(false);
  const [searchValDebounse] = useDebounce(searchVal, 800);
  const { makeRequest } = useKinopoiskApi();

  const lang = languageSearch;
  const errorText =
    languageSearch !== 'en-En'
      ? 'К сожалению ничего не найдено, попробуйте изменить ваш запрос'
      : 'Sorry, nothing was found, please try to change your query.';

  const urlImg = 'https://st.kp.yandex.net/images/';

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoader(true);
      try {
        const data = await makeRequest({
          endpoint: 'movie',
          params: {
            limit: 20,
            sortField: 'votes.kp',
            sortType: '-1',
            page: paginPage,
          },
          cacheKey: `popular_movies_${lang}_${paginPage}`,
          priority: 'high',
        });

        const adaptedData = {
          results: data.docs || [],
          total_pages: data.pages || 1,
        };

        setJson(adaptedData);
        setItems(adaptedData.results);
        loading(false, adaptedData.total_pages);
      } catch (error) {
        console.error('Ошибка при загрузке фильмов:', error);
        setItems([]);
      } finally {
        setLoader(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      try {
        let data;

        if (searchVal.length !== 0) {
          data = await makeRequest({
            endpoint: 'movie',
            params: {
              query: searchVal,
              limit: 20,
              page: paginPage,
            },
            cacheKey: `search_${searchVal}_${lang}_${paginPage}`,
            priority: 'medium',
          });
        } else {
          data = await makeRequest({
            endpoint: 'movie',
            params: {
              limit: 20,
              sortField: 'votes.kp',
              sortType: '-1',
              page: paginPage,
            },
            cacheKey: `popular_movies_${lang}_${paginPage}`,
            priority: 'high',
          });
        }

        const adaptedData = {
          results: data.docs || [],
          total_pages: data.pages || 1,
        };

        setJson(adaptedData);
        loading(false, adaptedData.total_pages);
        setItems(adaptedData.results);
      } catch (error) {
        console.error('Ошибка при поиске фильмов:', error);
        setItems([]);
      } finally {
        setLoader(false);
      }
    };

    fetchData();
  }, [searchValDebounse, paginPage, lang]);

  const elements =
    items.length !== 0 ? (
      items.map((it, i) => {
        const { id, description, poster, name, rating, year, votes } = it;
        
        let colClass;
        const vote_average = rating?.kp || 0;

        if (vote_average >= 7) {
          colClass = 'm4';
        } else if (vote_average > 5) {
          colClass = 'm3';
        } else if (vote_average > 3) {
          colClass = 'm2';
        } else {
          colClass = 'm1';
        }

        return (
          <div className="films" key={id}>
            <Film
              vote_average={vote_average}
              lang={lang}
              id={id}
              label={name || 'Нет названия'}
              overview={description || 'Описание отсутствует'}
              img={poster?.previewUrl || poster?.url || null}
              title={name}
              popularity={votes?.kp || 0}
              release_date={year ? `${year}-01-01` : null}
              colClass={colClass}
            />
            <br />
          </div>
        );
      })
    ) : (
      <h1 className="error__h1">
        <span className="box">{errorText}</span>
      </h1>
    );

  const contentStyle = {
    padding: 200,
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
  };

  const content = <div className="loader" style={contentStyle} />;

  return (
    <div className="container">
      {loader ? (
        <div className="lodered">
          <Flex gap="middle" vertical>
            <Flex gap="middle">
              <Spin tip="Loading" size="small">
                {content}
              </Spin>
            </Flex>
          </Flex>
        </div>
      ) : (
        <div className="div__films">{elements}</div>
      )}
    </div>
  );
}
