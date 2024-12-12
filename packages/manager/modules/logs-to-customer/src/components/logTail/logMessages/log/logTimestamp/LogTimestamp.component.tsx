import React from 'react';
import { useTranslation } from 'react-i18next';
import { HighlightSearch } from '../highligthSearch/HighlightSearch.component';
import { Tmessage } from '../../../../../data/api/logTailMessages';

export const LogTimestamp = ({
  timestamp,
}: {
  timestamp: Tmessage['timestamp'];
}) => {
  const { i18n } = useTranslation();
  const date = new Date(timestamp);
  const locale = i18n?.language?.replace('_', '-');

  const formattedDate = date.toLocaleDateString(locale, { dateStyle: 'short' });
  const formattedTime = date.toLocaleTimeString(locale, {
    timeStyle: 'medium',
  });

  return (
    <>
      <span className="text-yellow-100" data-testid="logTail-date">
        <HighlightSearch text={`${formattedDate} `} />
      </span>
      <span className="text-yellow-200" data-testid="logTail-time">
        <HighlightSearch text={formattedTime} />
      </span>
    </>
  );
};
