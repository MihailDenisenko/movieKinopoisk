import 'react';
import styles from './Search.module.scss';
import { CloseOutlined } from '@ant-design/icons';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Typography } from 'antd';
import { HomeContext } from '../Home/HomeContext';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterEn, filterRu } from '../../redux/slices/langFilter';

const items = [
  {
    key: '1',
    label: 'Ру',
  },
  {
    key: '2',
    label: 'En',
  },
];

export default function Search() {
  const searchFocus = React.useRef();

  React.useEffect(() => {
    console.log(searchFocus);
  }, []);

  const onClickCleaner = () => {
    setSearchVal('');
    searchFocus.current.focus();
  };

  const lang = useSelector((state) => state.langFilter.value);
  const dispatch = useDispatch();

  const { searchVal, setSearchVal, languageSearch, setLanguageSearch, favor } =
    React.useContext(HomeContext);

  return (
    <div className={styles.root}>
      {searchVal ? <CloseOutlined className={styles.closed} onClick={onClickCleaner} /> : null}
      {!favor ? (
        <input
          ref={searchFocus}
          className={styles.input}
          type="text"
          placeholder={lang !== 'en-Us' ? 'Поиск фильмов' : 'Search movies'}
          onChange={(e) => setSearchVal(e.target.value)}
          value={searchVal}
        ></input>
      ) : null}

      <Dropdown
        className={styles.drop}
        menu={{
          onClick: function (e) {
            if (e.key === '1') {
              setLanguageSearch('ru-Ru');
              dispatch(filterRu());
            } else {
              setLanguageSearch('en-En');
              dispatch(filterEn());
            }
          },
          items,
          defaultSelectedKeys: [''],
        }}
      >
        <Typography.Link>
          <Space>
            {languageSearch === 'ru-Ru' ? 'Русский' : 'English'}
            <DownOutlined />
          </Space>
        </Typography.Link>
      </Dropdown>
    </div>
  );
}
