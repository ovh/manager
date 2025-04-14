import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NotificationType } from '@ovh-ux/manager-react-components';

const MESSAGES_TYPES: NotificationType[] = [
  NotificationType.Success,
  NotificationType.Warning,
  NotificationType.Error,
  NotificationType.Info,
];

export const useUrlSearchMessages = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const messages = useMemo(
    () =>
      Object.fromEntries(
        MESSAGES_TYPES.map((messageType) => [
          messageType,
          searchParams.getAll(`${messageType}Messages`),
        ]),
      ),
    [searchParams],
  );

  const dismissMessage = useCallback(
    (type: NotificationType, content: string) => {
      setSearchParams((prev) => {
        prev.delete(`${type}Messages`, content);
        return prev;
      });
    },
    [setSearchParams],
  );

  return {
    messages,
    dismissMessage,
  };
};
