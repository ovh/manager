import React from 'react';

import { render } from '@testing-library/react';

import { searchContext } from '../../LogMessages.component';
import { HighlightSearch } from './HighlightSearch.component';

type TUseCase = {
  query: string | undefined;
  text: string;
  highlighted: boolean;
};

const useCases: TUseCase[] = [
  {
    query: undefined,
    text: 'test content',
    highlighted: false,
  },
  {
    query: 'other',
    text: 'test content',
    highlighted: false,
  },
  {
    query: 'cont',
    text: 'test content',
    highlighted: true,
  },
];

describe('HighlightSearch test suite', () => {
  test.each(useCases)('should render search query', ({ query, text, highlighted }) => {
    const { getByTestId, queryAllByTestId } = render(
      <searchContext.Provider value={{ query }}>
        <HighlightSearch text={text} />
      </searchContext.Provider>,
    );

    if (highlighted && query !== undefined) {
      expect(getByTestId('tailLog-highlight')).toHaveTextContent(query);
    } else {
      expect(queryAllByTestId('tailLog-highlight')).toHaveLength(0);
    }
  });
});
