import { useState, useEffect } from 'react';
import './App.scss';
import Home from './Components/Home/Home';
import TokenManager from './components/tokenManager/TokenManager';
import { Offline, Online } from 'react-detect-offline';
import { Alert, Spin, FloatButton } from 'antd';
import { KeyOutlined, SettingOutlined } from '@ant-design/icons';
import { useKinopoiskApi } from './hooks/useKinopoiskApi';
import logo from './Components/img/notInternet.png';

const contentStyle = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};

const content = (
  <div className="loder">
    <div style={contentStyle} />
  </div>
);

function App() {
  const [loader, setLoader] = useState(true);
  const [showTokenManager, setShowTokenManager] = useState(false);
  const [tokenStatus, setTokenStatus] = useState(null);
  const { getTokenStatus } = useKinopoiskApi();

  // Проверяем статус токена при загрузке
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoader(false);

      // Проверяем нужен ли токен
      const status = getTokenStatus();
      setTokenStatus(status);

      // Показываем менеджер токена если его нет
      if (!status.hasToken && !status.isMockMode) {
        setTimeout(() => setShowTokenManager(true), 1000);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [getTokenStatus]);

  const handleTokenSave = (token) => {
    const status = getTokenStatus();
    setTokenStatus(status);

    if (token) {
      console.log('Токен сохранен, перезагрузите страницу для применения');
    }
  };

  const loaded = (
    <div className="loadered">
      <div className="loder">
        <Spin tip="Загрузка приложения..." size="large">
          {content}
        </Spin>
      </div>
    </div>
  );

  return (
    <>
      {loader ? (
        loaded
      ) : (
        <Online>
          <Home />

          {/* Кнопка управления токеном */}
          <FloatButton.Group
            trigger="click"
            type="primary"
            icon={<SettingOutlined />}
            style={{ right: 24 }}
          >
            <FloatButton
              icon={<KeyOutlined />}
              tooltip="Управление API токеном"
              onClick={() => setShowTokenManager(true)}
            />
            {tokenStatus?.isMockMode && (
              <FloatButton type="warning" tooltip="Режим демо-данных" badge={{ count: 'DEMO' }} />
            )}
          </FloatButton.Group>

          {/* Менеджер токена */}
          <TokenManager
            isOpen={showTokenManager}
            onClose={() => setShowTokenManager(false)}
            onTokenSave={handleTokenSave}
          />
        </Online>
      )}

      <Offline>
        {!loader && (
          <div className="alert">
            <Alert
              message="Отсутствует подключение к интернету"
              description="Проверьте настройки сети или подключитесь к интернету для работы с каталогом фильмов"
              type="error"
              showIcon
            />
            <img className="notInternet" src={logo} alt="Нет подключения к интернету" />
          </div>
        )}
      </Offline>
    </>
  );
}

export default App;
