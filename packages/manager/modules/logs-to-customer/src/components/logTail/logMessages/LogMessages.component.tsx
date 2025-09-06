import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useTranslation } from 'react-i18next';

import { OdsButton, OdsInput } from '@ovhcloud/ods-components/react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { useLogTailMessages } from '../../../data/hooks/useLogTailMessages';
import { TemporaryLogsLink } from '../../../data/types/dbaas/logs';
import useLogTrackingActions from '../../../hooks/useLogTrackingActions';
import { useZoomedInOut } from '../../../hooks/useZoomedInOut';
import { LogsActionEnum } from '../../../types/logsTracking';
import { Log } from './log/Log.component';

interface ISearchContext {
  query?: string;
}

export const searchContext = createContext<ISearchContext>({
  query: undefined,
});

const BlinkingCursor = () => {
  return <div className="w-2 h-4 bg-white animate-[cursor-blink_1s_step-end_infinite]" />;
};

interface ILogTailMessageUrl {
  logTailMessageUrl: TemporaryLogsLink['url'];
}

export const LogMessages = ({ logTailMessageUrl }: ILogTailMessageUrl) => {
  const { t } = useTranslation('logTail');
  const parentRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const { isZoomedIn, toggleZoom } = useZoomedInOut();
  const clearSessionLogsAccess = useLogTrackingActions(LogsActionEnum.clear_session_logs_access);
  const { trackClick } = useOvhTracking();
  const { messages, error, isPending, isPolling, togglePolling, clearLogs } =
    useLogTailMessages(logTailMessageUrl);

  const virtualizer = useVirtualizer({
    count: messages?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    paddingEnd: 80,
  });

  const scrollToBottom = () => {
    virtualizer.scrollToIndex(messages.length - 1, { align: 'center' });
  };

  const resetSession = () => {
    setAutoScroll(true);
    clearLogs();
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [clearSessionLogsAccess],
    });
  };

  useEffect(() => {
    if (autoScroll && !isPending && messages.length > 0) {
      scrollToBottom();
    }
  }, [isPending, messages.length, autoScroll]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isPending) {
          setAutoScroll(true);
        } else if (!isPending) {
          setAutoScroll(false);
        }
      });
    });

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isPending, messages.length]);

  const items = virtualizer.getVirtualItems();

  const searchContextObj: ISearchContext = useMemo(
    () => ({
      query: searchQuery,
    }),
    [searchQuery],
  );

  return (
    <>
      <div className="h-[--toolbox-height] flex items-center justify-between px-4 box-border border-solid border-0 border-b border-slate-600">
        <div className="flex gap-2 items-center w-full">
          <OdsInput
            name="log-tail-search"
            type="search"
            placeholder={t('log_tail_search_placeholder')}
            className="flex-grow max-w-80"
            onOdsChange={(e) => setSearchQuery(e.detail.value as string)}
            data-testid="logTail-searchInput"
          />
          <OdsButton
            className="bg-white [&::part(button)]:h-8 "
            variant="ghost"
            size="sm"
            onClick={togglePolling}
            data-testid="logTail-togglePolling"
            label={isPolling ? '⏸︎' : '▶'}
          />
          <OdsButton
            className="bg-white"
            variant="ghost"
            size="sm"
            onClick={resetSession}
            icon="refresh"
            data-testid="logTail-clearSession"
            label=""
          />
          <OdsButton
            className="bg-white h-auto ml-auto"
            variant="ghost"
            size="sm"
            onClick={() => toggleZoom()}
            data-testid="logTail-zoom"
            icon={isZoomedIn ? 'shrink' : 'resize'}
            label=""
          />
        </div>
      </div>
      <div className="relative font-mono text-xs ">
        <div
          className="px-4 overflow-y-auto contain-strict h-[--messages-height]"
          ref={parentRef}
          data-testid="logTail-listContainer"
        >
          <div
            className="relative w-full"
            style={{
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            <div
              className="pt-4 absolute top-0 left-0 w-full"
              style={{
                transform: `translateY(${items[0]?.start ?? 0}px)`,
              }}
            >
              <searchContext.Provider value={searchContextObj}>
                {items.map((virtualRow) => (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    data-testid="logTail-item"
                  >
                    <Log msg={messages[virtualRow.index]} />
                  </div>
                ))}
              </searchContext.Provider>
              {error && (
                <div className="text-red-400" data-testid="logTail-message-error">
                  {t('log_tail_error_get_logs')}
                </div>
              )}
              {isPolling && (
                <div className="text-slate-400" data-testid="logTail-polling">
                  {t('log_tail_polling')}
                </div>
              )}
              <div id="bottom" ref={bottomRef} />
              <BlinkingCursor />
            </div>
          </div>
        </div>
        {!autoScroll && (
          <OdsButton
            className="absolute right-10 bottom-8 bg-white"
            variant="ghost"
            size="sm"
            onClick={scrollToBottom}
            icon="arrow-down"
            label=""
          />
        )}
      </div>
    </>
  );
};
