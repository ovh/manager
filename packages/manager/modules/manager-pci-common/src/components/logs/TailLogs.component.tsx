import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  OsdsButton,
  OsdsIcon,
  OsdsSearchBar,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useTailLogs } from '../../api/hook/useLogs';
import { BlinkingCursor } from './BlinkingCursor.component';
import { LogContext } from './LogProvider.component';

import '../../translations/logs';

const highlightSearch = (text: string, search: string) => {
  if (!search) return text;
  try {
    const re = new RegExp(search, 'gi');
    return text.replace(
      re,
      (match) => `<span class="bg-white text-black">${match}</span>`,
    );
  } catch {
    return text;
  }
};

export interface TailLogsProps {
  isFullscreen?: boolean;
  onToggleFullscreen: () => void;
}

export function TailLogs({
  isFullscreen,
  onToggleFullscreen,
}: Readonly<TailLogsProps>) {
  const { t } = useTranslation('pci-logs');
  const logsElement = useRef(undefined);
  const logsContainer = useRef(undefined);
  const { logsApiURL, logsKeys, logsKind } = useContext(LogContext);
  const [search, setSearch] = useState('');

  const { messages, clearLogs, isPolling, setIsPolling, isError } = useTailLogs(
    logsApiURL,
    logsKind,
    logsKeys,
  );

  useEffect(() => {
    setIsPolling(true);
  }, []);

  // apply syntax highlighting on logs
  const output = useMemo(
    () =>
      messages?.reduce((rest, message) => {
        let result = rest;
        result += ` <span class="text-[var(--ods-color-warning-050)]">${highlightSearch(
          message.date,
          search,
        )}</span>`;
        result += ` <span class="text-[var(--ods-color-warning-100)]">${highlightSearch(
          message.time,
          search,
        )}</span>`;
        result += ` | <span class="text-[var(--ods-color-primary-300)]">${highlightSearch(
          message.level,
          search,
        )?.padStart(6, '')}</span> |`;
        logsKeys.forEach((key) => {
          result += highlightSearch(` ${message[key]}`, search);
        });
        result += '<br />';
        return result;
      }, ''),
    [search, messages],
  );

  const scrollToBottom = () => {
    setTimeout(() => {
      logsContainer.current.scrollTop = logsContainer.current.scrollHeight;
    }, 0);
  };

  // update logs and scroll to bottom
  useEffect(() => {
    if (!logsElement.current) return;
    const { scrollTop, scrollHeight, clientHeight } = logsContainer.current;
    // only apply autoscroll if the scrollbar is already near the bottom
    const shouldAutoScroll = scrollHeight - scrollTop <= clientHeight + 50;
    logsElement.current.innerHTML = output;
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [logsElement.current, output]);

  return (
    <div className="font-mono bg-black text-white">
      <div className="p-4 relative">
        <div className="flex">
          <OsdsSearchBar
            className="w-[25%] min-w-[10rem]"
            value={search}
            placeholder={t('search_placeholder')}
            onOdsValueChange={({ detail }) => {
              setSearch(detail.value);
            }}
            onOdsSearchSubmit={({ detail }) => {
              setSearch(detail.inputValue);
            }}
          />
          <OsdsButton
            className="ml-4 min-w-[2.5rem]"
            inline
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.stroked}
            size={ODS_BUTTON_SIZE.sm}
            onClick={() => setIsPolling((state) => !state)}
          >
            {isPolling ? '⏸︎' : '▶'}
          </OsdsButton>
          <OsdsButton
            className="ml-4 min-w-[5rem]"
            inline
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.stroked}
            size={ODS_BUTTON_SIZE.sm}
            onClick={clearLogs}
          >
            {t('clear_session')}
          </OsdsButton>
          <OsdsButton
            className="ml-auto min-w-[2.5rem] w-[2.5rem]"
            inline
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.stroked}
            size={ODS_BUTTON_SIZE.sm}
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? '-' : '⛶'}
          </OsdsButton>
        </div>
        <div
          ref={logsContainer}
          className="flex-1 font-mono text-sm text-[0.8rem] mt-4 h-[500px] overflow-y-auto"
        >
          <div ref={logsElement} />
          {isError && (
            <span className="text-[var(--ods-color-error-200)]">
              {t('error_get_url')}
            </span>
          )}
          {!output && t('list_no_logs')}
          <div>
            <BlinkingCursor />
          </div>
        </div>
        {output && (
          <div className="flex py-2">
            <OsdsButton
              className="ml-auto"
              inline
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.stroked}
              size={ODS_BUTTON_SIZE.sm}
              onClick={scrollToBottom}
            >
              <OsdsIcon
                name={ODS_ICON_NAME.ARROW_DOWN}
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_ICON_SIZE.xxs}
              ></OsdsIcon>
            </OsdsButton>
          </div>
        )}
      </div>
    </div>
  );
}
