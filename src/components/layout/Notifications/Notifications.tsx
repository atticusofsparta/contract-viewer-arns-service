import { notification } from 'antd';
import { useEffect } from 'react';

import eventEmitter from '../../../utils/events';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export default function Notifications() {
  const [api, contextHolder] = notification.useNotification({
    maxCount: 3,
  });

  function handleError(error: Error) {
    console.debug('Error:', error);
    showNotification({
      type: 'error',
      title: error.name,
      description: error.message,
    });
  }

  function handleWarning(n: {name:string, message:string}) {
    console.warn('Warning:', n);
    showNotification({
        type: 'warning',
        title: n.name,
        description: n.message,
        });
    }

    function handleInfo(n: {name:string, message:string}) {
        console.info('Info:', n);
        showNotification({
            type: 'info',
            title: n.name,
            description: n.message,
            });
        }


  function showNotification({
    type,
    title,
    description,
  }: {
    type: NotificationType;
    title: string;
    description: string;
  }) {
    api[type]({
      message: title,
      description,
      placement: 'bottomRight',
      style: {
        fontFamily: 'Rubik',
      },
    });
  }

  // error notifications
  useEffect(() => {
    eventEmitter.on('error', (error: Error) => handleError(error));
    eventEmitter.on('warning', (error: Error) => handleWarning(error));
    eventEmitter.on('info', (error: Error) => handleInfo(error));

    return () => {
      eventEmitter.off('error');
        eventEmitter.off('warning');
        eventEmitter.off('info');
    };
  });

  return contextHolder;
}
