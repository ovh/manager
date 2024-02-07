import { describe, expect, vi } from 'vitest';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import PageSize from '@/components/datagrid/pagination/PageSize';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string, params?: Record<string, unknown>) =>
        `${str}_${JSON.stringify(params)}`,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

describe('Datagrid Pagination Page Size selector options strategy', () => {
  it('should not display page size selector when less than 10 items', async () => {
    render(
      <PageSize
        numItems={9}
        currentPageSize={100}
        pageSizes={[10, 50, 100]}
        onPageSizeChange={() => {}}
      ></PageSize>,
    );

    let select: HTMLElement | undefined;
    try {
      select = screen.getByTestId('select');
    } catch (error) {
      select = undefined;
    }

    const resultsDisplay = screen.getByText(
      'common_pagination_nresults_{"TOTAL_ITEMS":9}',
    );

    expect(select).toBeUndefined();
    expect(resultsDisplay).toBeInTheDocument();
  });

  it('should display page size selector when more than 9 items', async () => {
    render(
      <PageSize
        numItems={234}
        currentPageSize={100}
        pageSizes={[10, 50, 100]}
        onPageSizeChange={() => {}}
      ></PageSize>,
    );

    const select = screen.getByTestId('select');
    const resultsDisplay = screen.getByText(
      'common_pagination_ofnresults_{"TOTAL_ITEMS":234}',
    );

    expect(select).toBeInTheDocument();
    expect(resultsDisplay).toBeInTheDocument();
  });

  it('should display only range page size until 300 items', async () => {
    render(
      <PageSize
        numItems={300}
        currentPageSize={10}
        pageSizes={[10, 100, 500, 1000]}
        onPageSizeChange={() => {}}
      ></PageSize>,
    );

    const select = screen.getByTestId('select');

    const option10 = within(select).getByText(10);
    const option100 = within(select).getByText(100);
    const option500 = within(select).getByText(300);

    let option1000: HTMLElement | null;
    try {
      option1000 = within(select).getByText(1000);
    } catch (error) {
      option1000 = null;
    }

    await waitFor(() => {
      expect(option10).toBeInTheDocument();
      expect(option10).toHaveAttribute('value', '10');
      expect(option100).toBeInTheDocument();
      expect(option100).toHaveAttribute('value', '100');
      expect(option500).toBeInTheDocument();
      expect(option500).toHaveAttribute('value', '500');
      expect(option1000).toBeNull();
    });
  });

  it('should display all page size when more than 300 items', async () => {
    render(
      <PageSize
        numItems={301}
        currentPageSize={10}
        pageSizes={[10, 100, 500, 1000]}
        onPageSizeChange={() => {}}
      ></PageSize>,
    );

    const select = screen.getByTestId('select');

    const option10 = within(select).getByText(10);
    const option100 = within(select).getByText(100);
    const option500 = within(select).getByText(500);

    const option1000 = within(select).getByText(301);

    await waitFor(() => {
      expect(option10).toBeInTheDocument();
      expect(option10).toHaveAttribute('value', '10');
      expect(option100).toBeInTheDocument();
      expect(option100).toHaveAttribute('value', '100');
      expect(option500).toBeInTheDocument();
      expect(option500).toHaveAttribute('value', '500');
      expect(option1000).toBeInTheDocument();
      expect(option1000).toHaveAttribute('value', '1000');
    });
  });

  it('should select current page size', async () => {
    render(
      <PageSize
        numItems={100}
        currentPageSize={100}
        pageSizes={[10, 50, 100]}
        onPageSizeChange={() => {}}
      ></PageSize>,
    );

    const select = screen.getByTestId('select');

    await waitFor(() => {
      expect(select).toHaveAttribute('default-value', '100');
    });
  });
});

describe('Datagrid Pagination Page Size selector user interaction', () => {
  it('should trigger onClick when clicked', async () => {
    const handlePageSizeChange = vi.fn();

    render(
      <PageSize
        numItems={100}
        currentPageSize={100}
        pageSizes={[10, 50, 100]}
        onPageSizeChange={handlePageSizeChange}
      ></PageSize>,
    );

    const select = screen.getByTestId('select');
    fireEvent.change(select, {
      target: {
        value: '50',
      },
    });
    // it seems we have to manually trigger the ods event
    select.odsValueChange.emit({ value: '50' });

    expect(handlePageSizeChange).toHaveBeenCalledWith(50);
    expect(handlePageSizeChange).toHaveBeenCalledOnce();
  });
});
