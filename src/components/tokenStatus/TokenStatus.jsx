import React from 'react';
import { Alert, Space, Typography, Progress } from 'antd';
import { KeyOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function TokenStatus({ tokenStatus, onShowTokenManager }) {
  if (!tokenStatus) return null;

  const { hasToken, isMockMode, lastError, requestsCount } = tokenStatus;

  if (isMockMode) {
    return (
      <Alert
        message="Демо-режим"
        description={
          <Space direction="vertical">
            <Text>Приложение работает на демо-данных</Text>
            <Text type="secondary">Для доступа к актуальным данным настройте API токен</Text>
          </Space>
        }
        type="warning"
        showIcon
        icon={<WarningOutlined />}
        action={
          <Button size="small" onClick={onShowTokenManager}>
            Настроить
          </Button>
        }
        style={{ marginBottom: 16 }}
      />
    );
  }

  if (lastError === 'QUOTA_EXCEEDED') {
    return (
      <Alert
        message="Лимит запросов исчерпан"
        description="Достигнут дневной лимит запросов для вашего токена. Используйте демо-режим или обновите токен."
        type="error"
        showIcon
        action={
          <Button size="small" onClick={onShowTokenManager}>
            Обновить
          </Button>
        }
        style={{ marginBottom: 16 }}
      />
    );
  }

  if (lastError === 'INVALID_TOKEN') {
    return (
      <Alert
        message="Неверный токен"
        description="Текущий API токен невалиден. Пожалуйста, обновите его."
        type="error"
        showIcon
        action={
          <Button size="small" onClick={onShowTokenManager}>
            Обновить
          </Button>
        }
        style={{ marginBottom: 16 }}
      />
    );
  }

  if (hasToken) {
    return (
      <Alert
        message="API токен активен"
        description={`Выполнено запросов: ${requestsCount}`}
        type="success"
        showIcon
        icon={<CheckCircleOutlined />}
        style={{ marginBottom: 16 }}
      />
    );
  }

  return null;
}
