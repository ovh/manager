import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import {
  ResourcesDatagridContextProvider,
  ResourcesDatagridContextType,
  useResourcesDatagridContext,
} from '../resourcesDatagrid/ResourcesDatagridContext';
import { ResourcesDatagridFilter } from '../resourcesDatagridTopbar/ResourcesDatagridTopbar.component';
import ResourcesDatagridFilters from './ResourcesDatagridFilters.component';

/** MOCKS */

vi.mock(
  '@/components/resourcesDatagrid/ResourcesDatagridContext',
  async (importOriginal) => ({
    ...(await importOriginal()),
    useResourcesDatagridContext: vi.fn(),
  }),
);

/** RENDER */
const renderComponent = ({
  filters,
  removeFilter,
}: Partial<ResourcesDatagridContextType>) => {
  vi.mocked(useResourcesDatagridContext).mockReturnValue({
    selectedResourcesList: [],
    setSelectedResourcesList: vi.fn(),
    filters: filters || [],
    addFilter: vi.fn(),
    removeFilter: removeFilter || vi.fn(),
    setFilters: vi.fn(),
  });

  return render(
    <ResourcesDatagridContextProvider>
      <ResourcesDatagridFilters />
    </ResourcesDatagridContextProvider>,
  );
};

describe('ResourcesDatagridFilters Component', async () => {
  it('Should display filter list', async () => {
    const filters: ResourcesDatagridFilter[] = [
      {
        id: 'test',
        column: 'column',
        tagKey: '',
        value: 'value',
      },
      {
        id: 'test-2',
        column: 'tag',
        tagKey: 'key',
        value: 'value',
      },
    ];

    const { findAllByTestId } = renderComponent({ filters });

    const allTags = await findAllByTestId('filter-tag');
    expect(allTags[0]).toHaveAttribute(
      'label',
      'resourceDatagridColumn_column : value',
    );
    expect(allTags[1]).toHaveAttribute(
      'label',
      'resourceDatagridColumn_tag : key:value',
    );
  });

  it('Should remove filter from list', async () => {
    const filters: ResourcesDatagridFilter[] = [
      {
        id: 'test',
        column: 'column',
        tagKey: '',
        value: 'value',
      },
      {
        id: 'test-2',
        column: 'tag',
        tagKey: 'key',
        value: 'value',
      },
    ];

    const removeFilterMock = vi.fn();

    const { findAllByTestId } = renderComponent({
      filters,
      removeFilter: removeFilterMock,
    });

    const allTags = await findAllByTestId('filter-tag');

    fireEvent.click(allTags[0]);

    waitFor(() => {
      expect(removeFilterMock).toHaveBeenCalledWith(filters[0]);
    });
  });
});
