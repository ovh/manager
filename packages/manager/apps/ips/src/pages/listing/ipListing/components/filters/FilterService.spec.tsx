import React from 'react';
import { vi } from 'vitest';
import { setupServer } from 'msw/node';
import { render, fireEvent, waitFor } from '@testing-library/react';
import {
  Handler,
  toMswHandlers,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ListingContext } from '@/pages/listing/listingContext';
import { listingContextDefaultParams } from '@/test-utils/setupUnitTests';
import { getComboboxByName } from '@/test-utils';
import { FilterService } from './FilterService';

const queryClient = new QueryClient();

/** MOCKS */
const setApiFilter = vi.fn();

/** RENDER */
const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContext.Provider
        value={{ ...listingContextDefaultParams, setApiFilter }}
      >
        <FilterService />
      </ListingContext.Provider>
    </QueryClientProvider>,
  );
};

describe('FilterService', () => {
  beforeEach(() => {
    ((global as unknown) as {
      server: ReturnType<typeof setupServer>;
    }).server.resetHandlers(
      ...toMswHandlers(
        [
          '/overTheBox',
          '/xdsl',
          '/pack/xdsl',
          '/ipLoadbalancing',
          '/dedicatedCloud',
          '/vrack',
          '/vps',
          '/dedicated/server',
          '/cloud/project',
        ].map(
          (url): Handler => ({
            url,
            api: 'v6',
            delay: 0,
            response: () => [
              {
                description: url,
                name: url,
                iam: { urn: `test:service${url.replace(/\//g, '_')}` },
              },
            ],
            status: 200,
          }),
        ),
      ),
    );
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('should display all options', async () => {
    const { container } = renderComponent();
    const combobox = await getComboboxByName({
      container,
      name: 'filter-service',
    });

    fireEvent.focus(combobox);

    await waitFor(() => {
      const options = combobox.querySelectorAll('ods-combobox-item');
      return expect(options.length).toBe(18);
    }, WAIT_FOR_DEFAULT_OPTIONS);
  });

  it('should set correct value when selecting an option', async () => {
    const { container } = renderComponent();
    const combobox = await getComboboxByName({
      container,
      name: 'filter-service',
    });

    const event = new CustomEvent('odsChange', {
      detail: { value: 'all_items_cloud' },
    });
    await waitFor(() => fireEvent(combobox, event));

    expect(setApiFilter).toHaveBeenCalledWith(expect.any(Function));
  });
});
