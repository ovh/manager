import { useContext, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TemporaryLogsLink } from '../types/dbaas/logs';
import { getLogTailMessages, Tmessage } from '../api/logTailMessages';
import { LogsContext } from '../../LogsToCustomer.context';

export const getLogTailMessageQueryKey = (
  logTailMessageUrl: TemporaryLogsLink['url'],
) => ['getLogTailMessages', logTailMessageUrl];

export const useLogTailMessages = (
  logTailMessageUrl: TemporaryLogsLink['url'],
) => {
  const { currentLogKind } = useContext(LogsContext);
  const [messages, setMessages] = useState<Tmessage[]>([]);
  const messageIds = useRef(new Set());
  const [isPolling, setIsPolling] = useState(true);
  const queryClient = useQueryClient();

  const { data, error, isPending } = useQuery({
    queryKey: getLogTailMessageQueryKey(logTailMessageUrl),
    queryFn: () => getLogTailMessages({ logTailMessageUrl }),
    select: ({ messages: _msgs }) => _msgs?.map(({ message }) => message),
    refetchInterval: 2000,
    enabled: isPolling,
  });

  const togglePolling = () => {
    if (isPolling) {
      queryClient.cancelQueries({
        queryKey: getLogTailMessageQueryKey(logTailMessageUrl),
      });
      setIsPolling(false);
      return;
    }
    setIsPolling(true);
  };

  const clearLogs = () => {
    messageIds.current = new Set();
    setMessages([]);
    queryClient.resetQueries({
      queryKey: getLogTailMessageQueryKey(logTailMessageUrl),
    });
  };

  // filter, sort and add new messages
  useEffect(() => {
    const newMessages =
      data
        ?.filter(({ _id }) => !messageIds.current.has(_id))
        .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)) ||
      [];
    newMessages.forEach(({ _id }) => messageIds.current.add(_id));

    setMessages((msgs) => [...msgs, ...newMessages]);
  }, [data]);

  // Reset on logKind selection
  useEffect(() => {
    clearLogs();
    setIsPolling(true);
  }, [currentLogKind]);

  return {
    messages,
    error,
    isPending,
    isPolling,
    togglePolling,
    clearLogs,
  };
};
