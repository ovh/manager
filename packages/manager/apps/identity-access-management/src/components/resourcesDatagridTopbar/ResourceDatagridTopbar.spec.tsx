import '@/test-utils/unit-test-setup';
import React, { PropsWithChildren } from 'react';
import { describe, it, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ResourcesDatagridContextProvider,
  ResourcesDatagridContextType,
  useResourcesDatagridContext,
} from '../resourcesDatagrid/ResourcesDatagridContext';
import ResourcesDatagridTopbar, {
  ResourcesDatagridTopbarProps,
} from './ResourcesDatagridTopbar.component';
import { ResourceDatagridColumn } from '../resourcesDatagrid/ResourcesDatagrid.component';
import { getButtonByLabel } from '@/test-utils/uiTestHelpers';

/** MOCKS */

const queryClient = new QueryClient();

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => ({
  ...(await importOriginal()),
  TagsFilterForm: () => <>tags-filter-form</>,
}));
vi.mock(
  '@/components/resourcesDatagrid/ResourcesDatagridContext',
  async (importOriginal) => ({
    ...(await importOriginal()),
    useResourcesDatagridContext: vi.fn(),
  }),
);

const useIamResourceTypeListMock = vi.hoisted(() =>
  vi.fn(() => ({
    data: ['dedicatedServer'],
  })),
);

vi.mock('@/data/hooks/useIamResources', () => ({
  useIamResourceTypeList: useIamResourceTypeListMock,
}));

/** RENDER */
const renderComponent = ({
  columns,
  children,
  addFilter,
}: PropsWithChildren<
  ResourcesDatagridTopbarProps & Partial<ResourcesDatagridContextType>
>) => {
  vi.mocked(useResourcesDatagridContext).mockReturnValue({
    selectedResourcesList: [],
    setSelectedResourcesList: vi.fn(),
    filters: [],
    addFilter: addFilter || vi.fn(),
    removeFilter: vi.fn(),
    setFilters: vi.fn(),
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ResourcesDatagridContextProvider>
        <ResourcesDatagridTopbar columns={columns} children={children} />
      </ResourcesDatagridContextProvider>
    </QueryClientProvider>,
  );
};

describe('resourcesDatagridTopbar Component', async () => {
  it('Should display filter button and children', async () => {
    const columns = [
      {
        id: 'col-1',
        label: ResourceDatagridColumn.DISPLAYNAME,
        cell: vi.fn(),
      },
    ];

    const children = <>Children</>;

    const { container, getByText } = renderComponent({ columns, children });

    expect(getByText('Children')).toBeDefined();
    getButtonByLabel({ container, label: `${NAMESPACES.ACTIONS}:filter` });
  });

  it('Should display a column selection', async () => {
    const columns = [
      {
        id: ResourceDatagridColumn.DISPLAYNAME,
        label: ResourceDatagridColumn.DISPLAYNAME,
        cell: vi.fn(),
      },
      {
        id: ResourceDatagridColumn.TYPE,
        label: ResourceDatagridColumn.TYPE,
        cell: vi.fn(),
      },
      {
        id: ResourceDatagridColumn.TAGS,
        label: ResourceDatagridColumn.TAGS,
        cell: vi.fn(),
      },
    ];

    const { container, getByText } = renderComponent({ columns });

    const filterButton = await getButtonByLabel({
      container,
      label: `${NAMESPACES.ACTIONS}:filter`,
    });

    fireEvent.click(filterButton);

    expect(getByText(ResourceDatagridColumn.DISPLAYNAME)).toBeInTheDocument();
    expect(getByText(ResourceDatagridColumn.TYPE)).toBeInTheDocument();
    expect(getByText(ResourceDatagridColumn.TAGS)).toBeInTheDocument();
  });

  it('Should select 1st column by default', async () => {
    const columns = [
      {
        id: ResourceDatagridColumn.DISPLAYNAME,
        label: ResourceDatagridColumn.DISPLAYNAME,
        cell: vi.fn(),
      },
      {
        id: ResourceDatagridColumn.TYPE,
        label: ResourceDatagridColumn.TYPE,
        cell: vi.fn(),
      },
      {
        id: ResourceDatagridColumn.TAGS,
        label: ResourceDatagridColumn.TAGS,
        cell: vi.fn(),
      },
    ];

    const { container, getByTestId } = renderComponent({ columns });

    const filterButton = await getButtonByLabel({
      container,
      label: `${NAMESPACES.ACTIONS}:filter`,
    });

    fireEvent.click(filterButton);

    expect(getByTestId('resource-displayname-input')).toBeInTheDocument();
  });

  it('Should display combobox if selected column is type', async () => {
    const columns = [
      {
        id: ResourceDatagridColumn.TYPE,
        label: ResourceDatagridColumn.TYPE,
        cell: vi.fn(),
      },
    ];

    const { container, getByTestId } = renderComponent({ columns });

    const filterButton = await getButtonByLabel({
      container,
      label: `${NAMESPACES.ACTIONS}:filter`,
    });

    fireEvent.click(filterButton);

    expect(getByTestId('resource-type-combobox')).toBeInTheDocument();
  });

  it('Should display tag form if selected column is tags', async () => {
    const columns = [
      {
        id: ResourceDatagridColumn.TAGS,
        label: ResourceDatagridColumn.TAGS,
        cell: vi.fn(),
      },
    ];

    const { container, getByText } = renderComponent({ columns });

    const filterButton = await getButtonByLabel({
      container,
      label: `${NAMESPACES.ACTIONS}:filter`,
    });

    fireEvent.click(filterButton);

    expect(getByText('tags-filter-form')).toBeInTheDocument();
  });

  it('Should update datagrid context with filter', async () => {
    const columns = [
      {
        id: ResourceDatagridColumn.DISPLAYNAME,
        label: ResourceDatagridColumn.DISPLAYNAME,
        cell: vi.fn(),
      },
    ];

    const addFilterMock = vi.fn();

    const { container, getByTestId } = renderComponent({
      columns,
      addFilter: addFilterMock,
    });

    const filterButton = await getButtonByLabel({
      container,
      label: `${NAMESPACES.ACTIONS}:filter`,
    });

    fireEvent.click(filterButton);

    const odsInput = getByTestId('resource-displayname-input');
    odsInput.setAttribute('value', 'test');
    const event = new CustomEvent('odsChange', {
      detail: { value: 'test' },
    });

    await fireEvent(odsInput, event);

    const validateButton = await getButtonByLabel({
      container,
      label: `${NAMESPACES.ACTIONS}:filter`,
      nth: 1,
    });

    fireEvent.click(validateButton);

    expect(addFilterMock).toHaveBeenCalledWith({
      id: `${ResourceDatagridColumn.DISPLAYNAME}:test`,
      column: ResourceDatagridColumn.DISPLAYNAME,
      value: 'test',
      tagKey: '',
    });
  });
});
