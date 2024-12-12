import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  OsdsButton,
  OsdsIcon,
  OsdsInput,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useLogTailMessages } from '../../../data/hooks/useLogTailMessages';
import { Log } from './log/Log.component';
import { TemporaryLogsLink } from '../../../data/types/dbaas/logs';

interface ISearchContext {
  query: string;
}

export const searchContext = createContext<ISearchContext>({
  query: undefined,
});

const BlinkingCursor = () => {
  return (
    <div className="w-4 h-6 bg-white animate-[cursor-blink_1s_step-end_infinite]" />
  );
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

  const {
    messages,
    error,
    isPending,
    isPolling,
    togglePolling,
    clearLogs,
  } = useLogTailMessages(logTailMessageUrl);

  const virtualizer = useVirtualizer({
    count: messages?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300,
    paddingEnd: 80,
  });

  const scrollToBottom = () => {
    virtualizer.scrollToIndex(messages.length - 1, { align: 'center' });
  };

  const resetSession = async () => {
    setAutoScroll(true);
    clearLogs();
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
      <div className="h-[--toolbox-height] flex items-center px-6 gap-4 box-border border-solid border-0 border-b border-slate-600">
        <OsdsInput
          type={ODS_INPUT_TYPE.search}
          icon={ODS_ICON_NAME.SEARCH}
          color={ODS_THEME_COLOR_INTENT.primary}
          placeholder={t('log_tail_search_placeholder')}
          contrasted
          size={ODS_INPUT_SIZE.md}
          class="min-w-80"
          onOdsValueChange={(e) => setSearchQuery(e.detail.value)}
          data-testid="logTail-searchInput"
        />
        <OsdsButton
          inline
          color={ODS_THEME_COLOR_INTENT.primary}
          contrasted
          variant={ODS_BUTTON_VARIANT.flat}
          size={ODS_BUTTON_SIZE.sm}
          onClick={togglePolling}
          data-testid="logTail-togglePolling"
        >
          {isPolling ? '⏸︎' : '▶'}
        </OsdsButton>
        <OsdsButton
          inline
          color={ODS_THEME_COLOR_INTENT.primary}
          contrasted
          variant={ODS_BUTTON_VARIANT.flat}
          size={ODS_BUTTON_SIZE.sm}
          onClick={resetSession}
          data-testid="logTail-clearSession"
        >
          {t('log_tail_clear_session')}
        </OsdsButton>
      </div>
      <div className="relative font-mono text-xs ">
        <div
          className={`px-6 overflow-y-auto contain-strict h-[--messages-height]`}
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
              className="pt-6 absolute top-0 left-0 w-full"
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
                <div
                  className="text-red-400"
                  data-testid="logTail-message-error"
                >
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
          <OsdsButton
            className="absolute right-12 bottom-9"
            inline
            color={ODS_THEME_COLOR_INTENT.primary}
            contrasted
            circle
            variant={ODS_BUTTON_VARIANT.flat}
            size={ODS_BUTTON_SIZE.md}
            onClick={scrollToBottom}
          >
            <OsdsIcon
              name={ODS_ICON_NAME.ARROW_DOWN}
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_ICON_SIZE.xxs}
            ></OsdsIcon>
          </OsdsButton>
        )}
      </div>
    </>
  );
};
