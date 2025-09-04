import React from 'react';
import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import DatagridItemsCounter, {
  DatagridItemsCounterProps,
} from './DatagridItemsCounter.component';

/** MOCKS */
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string, params: Record<string, number>) => {
      return `key: ${translationKey}, params: ${JSON.stringify(params)}`;
    },
    i18n: { language: 'fr_FR' },
  }),
}));

/** RENDER */
const renderComponent = (props: DatagridItemsCounterProps) => {
  return render(<DatagridItemsCounter {...props} />);
};

describe('DatagridItemsCounter Component', async () => {
  it('Should display number of items while paginated', async () => {
    const { getByText } = renderComponent({
      pageSize: 10,
      currentPage: 1,
      totalItems: 100,
    });

    expect(
      getByText(
        'key: itemsCounter, params: {"numberOfDisplayedItems":10,"totalItems":100}',
      ),
    ).toBeInTheDocument();
  });

  it('Should display number of items when all displayed', async () => {
    const { getByText } = renderComponent({
      pageSize: 10,
      currentPage: 10,
      totalItems: 97,
    });

    expect(
      getByText(
        'key: itemsCounter, params: {"numberOfDisplayedItems":97,"totalItems":97}',
      ),
    ).toBeInTheDocument();
  });
});
