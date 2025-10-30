import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Alert, Space, Typography } from 'antd';
import { KeyOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

export default function TokenManager({ isOpen, onClose, onTokenSave }) {
  const [token, setToken] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    // Загружаем сохраненный токен при открытии
    if (isOpen) {
      const savedToken =
        localStorage.getItem('kinopoisk_user_token') ||
        import.meta.env.VITE_KINOPOISK_API_TOKEN ||
        '';
      setToken(savedToken);
      setTestResult(null);
    }
  }, [isOpen]);

  const testToken = async (testToken) => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('https://api.kinopoisk.dev/v1.4/movie?page=1&limit=1', {
        headers: {
          'X-API-KEY': testToken,
        },
      });

      if (response.ok) {
        setTestResult({ success: true, message: 'Токен работает корректно!' });
        return true;
      } else {
        setTestResult({
          success: false,
          message: `Ошибка: ${response.status} - ${response.statusText}`,
        });
        return false;
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Сетевая ошибка: ${error.message}`,
      });
      return false;
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    if (!token.trim()) {
      setTestResult({ success: false, message: 'Введите токен' });
      return;
    }

    const isValid = await testToken(token);
    if (isValid) {
      localStorage.setItem('kinopoisk_user_token', token);
      onTokenSave(token);
      onClose();
    }
  };

  const handleUseMock = () => {
    localStorage.setItem('use_mock_data', 'true');
    onTokenSave(null);
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <KeyOutlined />
          Настройка API токена Kinopoisk
        </Space>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="mock" onClick={handleUseMock}>
          Использовать демо-данные
        </Button>,
        <Button key="save" type="primary" loading={isTesting} onClick={handleSave}>
          {isTesting ? 'Проверка...' : 'Сохранить токен'}
        </Button>,
      ]}
      width={600}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Paragraph>
          Для полного функционала приложения необходим API токен от Kinopoisk.dev
        </Paragraph>

        <div>
          <Text strong>Как получить токен:</Text>
          <ol>
            <li>
              Зарегистрируйтесь на{' '}
              <a href="https://kinopoisk.dev/" target="_blank" rel="noopener noreferrer">
                kinopoisk.dev
              </a>
            </li>
            <li>Получите бесплатный токен в личном кабинете</li>
            <li>Вставьте его в поле ниже</li>
          </ol>
        </div>

        <Input.Password
          placeholder="Введите ваш API токен..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onPressEnter={handleSave}
          disabled={isTesting}
        />

        {testResult && (
          <Alert
            message={testResult.message}
            type={testResult.success ? 'success' : 'error'}
            showIcon
            icon={testResult.success ? <CheckCircleOutlined /> : <WarningOutlined />}
          />
        )}

        <Alert
          message="Демо-режим"
          description="Вы можете использовать приложение с демо-данными, но функционал будет ограничен"
          type="info"
          showIcon
        />
      </Space>
    </Modal>
  );
}
