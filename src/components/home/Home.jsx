import { useEffect, useRef, useState } from 'react';
import React from 'react';
import qs from 'qs';
import Pagin from '../Pagination/Pagin';
import Search from '../Search/Search';
import ButtonSearch from '../ButtonSearch/ButtonSearch';
import ButtonRate from '../ButtonRate/ButtonRate';
import Films from '../Films/Films';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

export const HomeContext = React.createContext();

export default function Home() {
  const lang = useSelector((state) => state.langFilter.value);
  const navigate = useNavigate();

  const [loader, setLoader] = useState(true);
  const [pages, setPages] = useState(0);
  const [searchVal, setSearchVal] = useState('');
  const [languageSearch, setLanguageSearch] = useState('ru-Ru');
  const [paginPage, setPaginPage] = useState(1);
  const [jsonFilms, setJson] = useState([]);
  const [favor, setFavor] = useState(false);
  const [items, setItems] = useState([]);

  const isRefer = useRef(true);

  React.useEffect(() => {
    const string = qs.stringify({
      lang: languageSearch,
    });

    if (!isRefer.current) {
      navigate(`?${string}`);
    }
    isRefer.current = false;
  }, [languageSearch]);

  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
    }
  }, []);

  const loading = (l, pages) => {
    setLoader(l);
    setPages(pages);
  };

  return (
    <div className="div__home">
      <HomeContext.Provider
        value={{
          searchVal,
          setSearchVal,
          languageSearch,
          setLanguageSearch,
          loading,
          paginPage,
          setJson,
          items,
          setItems,
          favor,
          setFavor,
          setPages,
          lang,
        }}
      >
        <div>
          <div className="div__search">
            <Search className="div__search" />
          </div>
          <div className="div__buttons">
            <ButtonSearch className="batSearch" />
            <ButtonRate />
          </div>
        </div>
        <Films />
        <div className="pagination">
          {!loader && (
            <Pagin
              pages={pages}
              paginPage={[paginPage]}
              setPaginPage={(e) => setPaginPage(e)}
              languageSearch={languageSearch}
            />
          )}
        </div>
      </HomeContext.Provider>
    </div>
  );
}
