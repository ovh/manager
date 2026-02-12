import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { LogsContext } from '@/LogsToCustomer.context';
import { Tmessage, getLogTailMessages } from '@/data/api/logTailMessages';
import { TemporaryLogsLink } from '@/data/types/dbaas/logs/Logs.type';
import useLogTrackingActions from '@/hooks/useLogTrackingActions';
import { LogsActionEnum } from '@/types/logsTracking';

export const getLogTailMessageQueryKey = (logTailMessageUrl: TemporaryLogsLink['url']) => [
  'getLogTailMessages',
  logTailMessageUrl,
];

export const useLogTailMessages = (logTailMessageUrl: TemporaryLogsLink['url']) => {
  const { currentLogKind } = useContext(LogsContext);
  const pauseLogsAccess = useLogTrackingActions(LogsActionEnum.pause_logs_access);
  const { trackClick } = useOvhTracking();
  const [messages, setMessages] = useState<Tmessage[]>([]);
  const messageIds = useRef(new Set<string>());
  const [isPolling, setIsPolling] = useState(true);
  const prevLogKindRef = useRef(currentLogKind?.kindId);
  const queryClient = useQueryClient();

  const { data, error, isPending } = useQuery({
    queryKey: getLogTailMessageQueryKey(logTailMessageUrl),
    queryFn: () => getLogTailMessages({ logTailMessageUrl }),
    select: ({ messages: _msgs }) => _msgs?.map(({ message }) => message),
    refetchInterval: 2000,
    enabled: isPolling,
  });

  const togglePolling = useCallback(() => {
    if (isPolling) {
      void queryClient.cancelQueries({
        queryKey: getLogTailMessageQueryKey(logTailMessageUrl),
      });
      setIsPolling(false);
      trackClick({
        location: PageLocation.page,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: [pauseLogsAccess],
      });
      return;
    }
    setIsPolling(true);
  }, [isPolling, queryClient, logTailMessageUrl, trackClick, pauseLogsAccess]);

  const clearLogs = useCallback(() => {
    messageIds.current = new Set();
    setMessages([]);
    void queryClient.resetQueries({
      queryKey: getLogTailMessageQueryKey(logTailMessageUrl),
    });
  }, [queryClient, logTailMessageUrl]);

  // filter, sort and add new messages
  useEffect(() => {
    if (!data?.length) return;
    const newMessages = data
      .filter(({ _id }) => !messageIds.current.has(_id))
      .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
    if (newMessages.length === 0) return;
    newMessages.forEach(({ _id }) => messageIds.current.add(_id));
    setMessages((msgs) => [...msgs, ...newMessages]);
  }, [data]);

  // Reset on logKind selection - this is a legitimate use case where we need to
  // clear state when an external dependency changes
  useEffect(() => {
    const currentKindId = currentLogKind?.kindId;
    if (prevLogKindRef.current !== currentKindId) {
      prevLogKindRef.current = currentKindId;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional reset when logKind changes
      clearLogs();
      setIsPolling(true);
    }
  }, [currentLogKind?.kindId, clearLogs]);

  return {
    messages,
    error,
    isPending,
    isPolling,
    togglePolling,
    clearLogs,
  };
};
