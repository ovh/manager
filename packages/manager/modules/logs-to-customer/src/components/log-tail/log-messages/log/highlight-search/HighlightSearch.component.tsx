import React, { useContext, useMemo } from 'react';

import { searchContext } from '@/components/log-tail/log-messages/SearchContext';

const getHighlightedHtml = (text: string, query: string): string | null => {
  try {
    return text.replace(
      new RegExp(query, 'gi'),
      (match) => `<mark data-testid='tailLog-highlight'>${match}</mark>`,
    );
  } catch {
    return null;
  }
};

export const HighlightSearch = ({ text }: { text: string }) => {
  const { query } = useContext(searchContext);

  const highlightedHtml = useMemo(
    () => (query ? getHighlightedHtml(text, query) : null),
    [text, query],
  );

  if (!query || highlightedHtml === null) return <>{text}</>;

  return <span dangerouslySetInnerHTML={{ __html: highlightedHtml }} />;
};
