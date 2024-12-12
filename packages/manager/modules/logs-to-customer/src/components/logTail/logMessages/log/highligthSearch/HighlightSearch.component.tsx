import React, { useContext } from 'react';
import { searchContext } from '../../LogMessages.component';

export const HighlightSearch = ({ text }: { text: string }) => {
  const { query } = useContext(searchContext);

  if (!query) return <>{text}</>;

  try {
    const txt = text.replace(
      new RegExp(query, 'gi'),
      (match) => `<mark data-testid='tailLog-highlight'>${match}</mark>`,
    );
    return <span dangerouslySetInnerHTML={{ __html: txt }} />;
  } catch {
    return <>{text}</>;
  }
};
