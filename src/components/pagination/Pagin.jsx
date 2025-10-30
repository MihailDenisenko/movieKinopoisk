import 'react';
import React from 'react';
import { Pagination } from 'antd';

export default function Pagin({ pages, paginPage, setPaginPage, languageSearch }) {
  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      if (languageSearch !== 'en-En') {
        return <a>Предыдущий</a>;
      } else return <a>Previous</a>;
    }
    if (type === 'next') {
      if (languageSearch !== 'en-En') {
        return <a>Следующий</a>;
      } else return <a>Next</a>;
    }
    return originalElement;
  };

  return (
    <div className="pagin">
      <Pagination
        align="center"
        total={pages * 10}
        itemRender={itemRender}
        defaultCurrent={paginPage}
        onChange={(e) => setPaginPage(e)}
        showSizeChanger={false}
      />
    </div>
  );
}
