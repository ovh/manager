import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import { differenceInMinutes, format, parseISO } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { getStream, getStreamURL } from '@/api/data/dbaas-logs';
import { postLogURL } from '@/api/data/kubernetes';
import { useLogs } from './useDbaasLogs';
import { useSubscribedLogs } from './useKubernetes';

// Aggregates data from dbaaslogs, subscribedlogs, stream and stream URL
export const useKubeLogs = (projectId: string, kubeId: string) => {
  const { data: dbaasLogs, isPending: isDbaasLogsPending } = useLogs();
  const {
    data: subscribedLogs,
    isPending: isSubscribedLogsPending,
  } = useSubscribedLogs(projectId, kubeId, 'audit');
  return useQueries({
    queries:
      subscribedLogs?.map(({ serviceName, streamId }) => ({
        queryKey: ['dbass-logs-kube', serviceName, streamId],
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

export function useKubeTailLogs(projectId: string, kubeId: string) {
  const { i18n } = useTranslation('common');
  const locales = useRef({ ...dateFnsLocales }).current;
  const userLocale = getDateFnsLocale(i18n.language);
  const queryClient = useQueryClient();
  const [isPolling, setIsPolling] = useState(false);
  const [messages, setMessages] = useState([]);
  const messageIds = useRef(new Set());

  // get the URL to fetch logs
  const { data: logsURL, isFetching: isLogsURLFetching, isError } = useQuery({
    queryKey: ['kube-log-url'],
    queryFn: () => postLogURL(projectId, kubeId, 'audit'),
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
        queryKey: ['kube-log-url'],
      });
    }
  }, [logsURL]);

  // fetch audit logs
  const { data: logs } = useQuery({
    queryKey: ['kube-audit-logs'],
    queryFn: () =>
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
        locale: locales[userLocale],
      }),
      time: format(parseISO(msg.timestamp), 'pp', {
        locale: locales[userLocale],
      }),
      level: LEVEL_LABELS[msg.level],
      audit_verb: msg.audit_verb,
      audit_authorizationDecision: msg.audit_authorizationDecision,
      audit_responseStatus: msg.audit_responseStatus,
      audit_user: msg.audit_user,
      audit_requestURI: msg.audit_requestURI,
      audit_groups: msg.audit_groups,
      audit_authorizationReason: msg.audit_authorizationReason,
      audit_userAgent: msg.audit_userAgent,
      audit_auditID: msg.audit_auditID,
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
