import { useParams } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useNotifications } from '@ovh-ux/manager-react-components';

import {
  useDeleteRestriction,
  useMappedRestrictions,
  useUpdateRestriction,
} from '@/api/hooks/useRestriction';
import { paginateResults } from '@/helpers';
import { wrapper } from '@/wrapperRenders';

import RestrictionsPage from './Restrictions.page';

vi.mock('@ovh-ux/manager-react-components', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...mod,
    useProjectUrl: vi.fn().mockReturnValue('mockProjectUrl'),
    Notifications: vi.fn(),
    useNotifications: vi.fn(),
  };
});

vi.mock('@/api/hooks/useRestriction', () => ({
  useDeleteRestriction: vi.fn(),
  useMappedRestrictions: vi.fn(),
  useUpdateRestriction: vi.fn(),
}));

const allData = [
  { index: 0, value: '192.168.1.1' },
  { index: 1, value: '192.168.1.1/2' },
  { index: 2, value: '192.168.1.2' },
  { index: 3, value: '192.168.1.3' },
  { index: 4, value: '192.168.1.4' },
  { index: 5, value: '192.168.1.5' },
  { index: 6, value: '192.168.1.6' },
  { index: 7, value: '192.168.1.7' },
  { index: 8, value: '192.168.1.8' },
  { index: 9, value: '192.168.1.9' },
  { index: 10, value: '192.168.1.10' },
  { index: 11, value: '192.168.1.11' },
  { index: 12, value: '192.168.1.12' },
  { index: 13, value: '192.168.1.13' },
  { index: 14, value: '192.168.1.14' },
];
describe('RestrictionsPage', () => {
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({ kubeId: '123', projectId: 'abc' });
    vi.mocked(useNotifications).mockReturnValue({
      addError: vi.fn(),
      addSuccess: vi.fn(),
    });

    vi.mocked(useMappedRestrictions).mockReturnValue({
      data: {
        rows: [paginateResults(allData, { pageIndex: 0, pageSize: 50 })],
        totalRows: allData.length,
      },
      mappedData: allData,
      isPending: false,
      addEmptyRow: vi.fn(),
      deleteRowByIndex: vi.fn(),
    } as unknown as ReturnType<typeof useMappedRestrictions>);
    vi.mocked(useDeleteRestriction).mockReturnValue({
      deleteRestriction: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteRestriction>);
    vi.mocked(useUpdateRestriction).mockReturnValue({
      updateRestriction: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateRestriction>);
    vi.clearAllMocks();
  });

  it('renders the component with text', () => {
    render(<RestrictionsPage />, { wrapper });
    expect(screen.getByText('kube_restrictions_manage')).toBeInTheDocument();
    expect(screen.getByText('kube_restrictions_manage_description')).toBeInTheDocument();
  });

  it('calls addEmptyRow when add button is clicked', () => {
    const addEmptyRowMock = vi.fn();
    vi.mocked(useMappedRestrictions).mockReturnValueOnce({
      ...useMappedRestrictions('testProjectId', 'testKubeId', {
        pageIndex: 0,
        pageSize: 10,
      }),
      addEmptyRow: addEmptyRowMock,
    });
    render(<RestrictionsPage />, { wrapper });
    fireEvent.click(screen.getByText('kube_restrictions_add'));
    expect(addEmptyRowMock).toHaveBeenCalled();
  });
});
