/* eslint-disable no-unused-vars */
import 'react';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import { Flex, Rate, message } from 'antd';
import styles from './Ratet.module.scss';
import { HomeContext } from '../Home/HomeContext';
import React from 'react';
import { useKinopoiskApi } from '../../hooks/useKinopoiskApi';

const customIcons = {
  1: <FrownOutlined />,
  2: <FrownOutlined />,
  3: <MehOutlined />,
  4: <SmileOutlined />,
  5: <SmileOutlined />,
};

export default function Ratet({ id }) {
  const [messageApi, contextHolder] = message.useMessage();
  const { rate, setRate, languageSearch } = React.useContext(HomeContext);
  const { makeRequest } = useKinopoiskApi();

  let mess;
  languageSearch === 'ru-Ru'
    ? (mess = 'Спасибо оценка принята')
    : (mess = 'Thank you, the rating is accepted');

  const cons = async (e) => {
    console.log(id, e);

    try {
      await makeRequest({
        endpoint: `movie/${id}/rating`,
        method: 'POST',
        data: { value: e * 2 },
        cacheKey: `rating_${id}`,
        priority: 'low',
      });

      messageApi.open({
        type: 'success',
        content: `${mess}`,
        className: 'custom-class',
        style: {
          marginTop: '20vh',
        },
      });
    } catch (error) {
      console.error('Ошибка при отправке оценки:', error);
    }
  };

  return (
    <div className={styles.root}>
      {contextHolder}
      <Flex gap="middle" vertical>
        <Rate
          defaultValue={rate}
          character={({ index = 0 }) => customIcons[index + 1]}
          tooltips={['Ужасно', 'Плохо', 'Пойдет', 'Хорошо', 'Отлично']}
          onChange={cons}
        />
      </Flex>
    </div>
  );
}
