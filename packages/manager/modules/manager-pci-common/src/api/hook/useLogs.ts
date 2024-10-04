import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { Filter, fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { PaginationState } from '@ovh-ux/manager-react-components';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import * as dateFnsLocales from 'date-fns/locale';
import { differenceInMinutes, format, parseISO } from 'date-fns';
import {
  getDbaasLogs,
  getStream,
  getStreamURL,
  getStreams,
  getStreamsIds,
} from '../data/logs';
import { TSubscription } from '../data/dbaas-logs';

export const useDbaasLogs = () =>
  useQuery({
    queryKey: ['dbaas-logs'],
    queryFn: getDbaasLogs,
  });

export const useStream = (serviceName: string, streamId: string) =>
  useQuery({
    queryKey: ['dbaas-logs-stream', serviceName, streamId],
    queryFn: () => getStream(serviceName, streamId),
  });

export const useStreams = (
  serviceName: string,
  pagination: PaginationState,
  filters: Filter[],
) =>
  useQuery({
    queryKey: [
      'dbaas-logs-streams',
      serviceName,
      JSON.stringify({ pagination, filters }),
    ],
    queryFn: () => getStreams(serviceName, pagination, filters),
  });

export const useAllStreamIds = () => {
  const { data: logs } = useDbaasLogs();
  return useQueries({
    queries:
      logs?.map((log) => ({
        queryKey: ['dbaas-logs-stream-id', log.serviceName],
        queryFn: () => getStreamsIds(log.serviceName),
      })) || [],
    combine: (result) => ({
      data: result?.map(({ data }) => data).flat(),
      isPending: result.some(({ isPending }) => isPending),
    }),
  });
};

export const pollLogOperation = async (
  serviceName: string,
  operationId: string,
  intervalMs = 1000,
) => {
  const poll = async (): Promise<unknown> => {
    const { data: op } = await v6.get<{
      operationId: string;
      serviceName: string;
      state: string;
    }>(`/dbaas/logs/${serviceName}/operation/${operationId}`);
    if (op.state === 'SUCCESS') {
      return op;
    }
    if (op.state === 'ERROR') {
      throw new Error(op.state);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    return poll();
  };
  return poll();
};

export interface RemoveSubscriptionProps {
  logsApiURL: string;
  subscriptionId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export interface LogOperationResponse {
  serviceName: string;
  operationId: string;
}

export const useRemoveSubscription = ({
  logsApiURL,
  subscriptionId,
  onError,
  onSuccess,
}: RemoveSubscriptionProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const { data: operation } = await v6.delete<LogOperationResponse>(
        `${logsApiURL}/subscription/${subscriptionId}`,
      );
      return pollLogOperation(operation.serviceName, operation.operationId);
    },
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['dbaas-logs-subscriptions'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['dbaas-logs-streams'],
      });
      onSuccess();
    },
  });
  return {
    remove: () => mutation.mutate(),
    ...mutation,
  };
};

export const useSubscribedLogs = (logsApiURL: string, kind: string) =>
  useQuery({
    queryKey: [`dbaas-logs-subscriptions`, logsApiURL, kind],
    queryFn: async () => {
      const { data } = await fetchIcebergV6<TSubscription>({
        route: `${logsApiURL}/subscription?kind=${kind}`,
        disableCache: true,
      });
      return data;
    },
  });

export const useLogsDetails = (logsApiURL: string, logsKind: string) => {
  const { data: dbaasLogs, isPending: isDbaasLogsPending } = useDbaasLogs();
  const {
    data: subscribedLogs,
    isPending: isSubscribedLogsPending,
  } = useSubscribedLogs(logsApiURL, logsKind);
  return useQueries({
    queries:
      subscribedLogs?.map(({ serviceName, streamId }) => ({
        queryKey: ['dbaas-logs-details', logsApiURL, logsKind],
        queryFn: async () => {
          const stream = await getStream(serviceName, streamId);
          const streamURL = await getStreamURL(serviceName, streamId);
          return {
            stream,
            streamURL: streamURL.find(({ type }) => type === 'GRAYLOG_WEBUI'),
          };
        },
      })) || [],
    combine: (results) => ({
      data: results
        // combine subscribedLogs with stream and streamURL
        .map(({ data: streamWithURL }) => ({
          log: subscribedLogs.find(
            (log) => log.streamId === streamWithURL?.stream.streamId,
          ),
          ...streamWithURL,
        }))
        // combine with dbass logs
        .map((result) => ({
          ...result,
          data: dbaasLogs?.find(
            (log) => log.serviceName === result.log?.serviceName,
          ),
        })),
      isPending:
        results.some(({ isPending }) => isPending) ||
        isDbaasLogsPending ||
        isSubscribedLogsPending,
    }),
  });
};

export const LEVEL_LABELS = {
  0: 'EMERG',
  1: 'ALERT',
  2: 'CRIT',
  3: 'ERROR',
  4: 'WARN',
  5: 'NOTICE',
  6: 'INFO',
  7: 'DEBUG',
};

export function useTailLogs(
  logsApiURL: string,
  logsKind: string,
  logsKeys: string[],
) {
  const { i18n } = useTranslation();
  const locales = useRef({ ...dateFnsLocales }).current;
  const userLocale = getDateFnsLocale(i18n.language);
  const queryClient = useQueryClient();
  const [isPolling, setIsPolling] = useState(false);
  const [messages, setMessages] = useState([]);
  const messageIds = useRef(new Set());

  // get the URL to fetch logs
  const { data: logsURL, isFetching: isLogsURLFetching, isError } = useQuery({
    queryKey: ['logs-url', logsApiURL, logsKind],
    queryFn: async () => {
      const { data } = await v6.post<{
        expirationDate: string;
        url: string;
      }>(`${logsApiURL}/url`, {
        kind: logsKind,
      });
      return data;
    },
    select: (result) => ({
      ...result,
      expirationDate: parseISO(result.expirationDate),
    }),
    enabled: isPolling,
  });

  // check for URL expiration
  useEffect(() => {
    const isLogsExpired =
      !logsURL || differenceInMinutes(logsURL.expirationDate, Date.now()) <= 3;
    if (isLogsExpired && !isLogsURLFetching) {
      queryClient.invalidateQueries({
        queryKey: ['logs-url', logsApiURL, logsKind],
      });
    }
  }, [logsURL]);

  // fetch logs
  const { data: logs } = useQuery({
    queryKey: ['logs-data'],
    queryFn: (): Promise<{
      messages: {
        message: {
          _id: string;
          timestamp: string;
          level: number;
        };
      }[];
    }> =>
      fetch(`${logsURL?.url}&sort=asc&limit=20`).then((response) =>
        response.json(),
      ),
    select: ({ messages: _msgs }) => _msgs?.map(({ message }) => message),
    enabled: !!logsURL?.url && isPolling,
    refetchInterval: 2000,
  });

  // filter messages and avoid duplication
  useEffect(() => {
    const toAdd = logs?.filter(({ _id }) => !messageIds.current.has(_id)) || [];
    const toAddFormatted = toAdd.map(({ _id, ...msg }) => ({
      _id,
      date: format(parseISO(msg.timestamp), 'P', {
        locale: locales[userLocale as keyof typeof locales],
      }),
      time: format(parseISO(msg.timestamp), 'pp', {
        locale: locales[userLocale as keyof typeof locales],
      }),
      level: LEVEL_LABELS[msg.level as keyof typeof LEVEL_LABELS],
      ...logsKeys.reduce(
        (result, key) => ({ ...result, [key]: msg[key as keyof typeof msg] }),
        {},
      ),
    }));

    setMessages((msgs) => [...msgs, ...toAddFormatted]);
    toAdd.forEach(({ _id }) => messageIds.current.add(_id));
  }, [logs]);

  return {
    isError,
    isPolling,
    setIsPolling,
    clearLogs: () => {
      messageIds.current = new Set();
      setMessages([]);
    },
    messages,
  };
}
