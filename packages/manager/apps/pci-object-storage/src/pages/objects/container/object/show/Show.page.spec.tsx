import { UseQueryResult } from '@tanstack/react-query';
import { describe, vi } from 'vitest';
import { render } from '@testing-library/react';
import { useProductMaintenance } from '@ovh-ux/manager-react-components';
import { TServerContainer } from '@/api/data/container';
import {
  usePaginatedObjects,
  useServerContainer,
} from '@/api/hooks/useContainer';
import ShowPage from './Show.page';

import { useStorageEndpoint } from '@/api/hooks/useStorages';
import { wrapperShow } from '@/wrapperRenders';

vi.mock('@/api/hooks/useContainer', () => {
  return {
    useServerContainer: vi.fn(),
    usePaginatedObjects: vi.fn(),
  };
});

vi.mock('@/api/hooks/useStorages', async () => {
  const mod = await vi.importActual('@/api/hooks/useStorages');
  return {
    ...mod,
    useStorageEndpoint: vi.fn(),
  };
});

vi.mock('date-fns', () => {
  const formatMock = vi.fn(() => 'formattedDate');
  return {
    format: formatMock,
  };
});
vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-react-shell-client');
  return {
    ...mod,
    useOvhTracking: vi.fn().mockReturnValue({
      trackPage: vi.fn(),
      trackClick: vi.fn(),
    }),
  };
});

describe('Show page', () => {
  it('should display spinner', () => {
    vi.fn(useProductMaintenance).mockReturnValue({
      hasMaintenance: false,
    } as never);
    vi.mocked(useServerContainer).mockReturnValue({
      isPending: true,
      data: {},
    } as UseQueryResult<TServerContainer>);
    vi.mocked(usePaginatedObjects).mockReturnValue({
      isPending: true,
    } as never);
    vi.mocked(useStorageEndpoint).mockReturnValue({
      isPending: true,
    } as never);
    const { container } = render(<ShowPage />, { wrapper: wrapperShow });
    expect(container).toMatchSnapshot();
  });

  it('should display datagrid', () => {
    const serverContainer = ({
      name: 'name',
      id: 'id',
      region: 'region',
      objects: [
        {
          name: 'name',
          size: 1,
          lastModified: new Date('2023-10-31T23:00:00.000Z'),
          contentType: 'contentType',
        },
      ],
    } as unknown) as TServerContainer;
    vi.mocked(useServerContainer).mockReturnValue({
      data: serverContainer,
      isPending: false,
    } as UseQueryResult<TServerContainer>);
    vi.mocked(usePaginatedObjects).mockReturnValue({
      isPending: false,
      paginatedObjects: {
        rows: serverContainer.objects,
        totalRows: 1,
      },
    } as never);
    vi.fn(useProductMaintenance).mockReturnValue({
      hasMaintenance: false,
    } as never);
    vi.mocked(useStorageEndpoint).mockReturnValue({
      url: 'https://api.ovh.com',
      isPending: false,
    } as never);
    const { container } = render(<ShowPage />, { wrapper: wrapperShow });
    expect(container).toMatchSnapshot();
  });
});
