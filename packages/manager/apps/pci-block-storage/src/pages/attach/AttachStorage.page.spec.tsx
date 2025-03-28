import { describe, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import AttachStorage from './AttachStorage.page';
import { useAttachableInstances } from '@/api/hooks/useInstance';
import { TAttachableInstance } from '@/api/select/instances';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn().mockReturnValue({
    t: vi.fn().mockReturnValue('Translated text'),
  }),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useNotifications: vi.fn().mockReturnValue({
    addError: vi.fn(),
    addSuccess: vi.fn(),
  }),
}));

vi.mock('@/api/hooks/useVolume', () => ({
  useAttachVolume: vi
    .fn()
    .mockReturnValue({ isPending: false, attachVolume: vi.fn() }),
  useVolume: vi
    .fn()
    .mockReturnValue({ data: { attachedTo: [] }, isPending: false }),
}));

vi.mock('@/api/hooks/useInstance');

describe('AttachStorage', () => {
  it('renders spinner when data is loading', () => {
    vi.mocked(useParams).mockReturnValue({ projectId: '1' });
    vi.mocked(useAttachableInstances).mockReturnValue({
      isPending: true,
    } as UseQueryResult<TAttachableInstance[]>);
    const { getByTestId } = render(<AttachStorage />);
    expect(getByTestId('attach-storage-spinner')).toBeInTheDocument();
  });
  it('renders NoInstanceWarningMessage when no instances are available', async () => {
    vi.mocked(useAttachableInstances).mockReturnValue({
      data: [],
      isPending: false,
    } as UseQueryResult<TAttachableInstance[]>);

    const { getByTestId } = render(<AttachStorage />);
    await waitFor(() =>
      expect(
        getByTestId('AttachStorage-NoInstanceWarningMessage'),
      ).toBeDefined(),
    );
  });

  it('does not render NoInstanceWarningMessage when instances are available', async () => {
    vi.mocked(useAttachableInstances).mockReturnValue({
      data: [{ id: '1', name: 'Instance 1' }],
      isPending: false,
    } as UseQueryResult<TAttachableInstance[]>);

    const { queryByTestId } = render(<AttachStorage />);
    await waitFor(() =>
      expect(
        queryByTestId('AttachStorage-NoInstanceWarningMessage'),
      ).toBeNull(),
    );
  });

  it('does not render NoInstanceWarningMessage when instances are pending', () => {
    vi.mocked(useAttachableInstances).mockReturnValue({
      data: undefined,
      isPending: true,
    } as UseQueryResult<TAttachableInstance[]>);

    render(<AttachStorage />);
    expect(
      screen.queryByText('No instances available'),
    ).not.toBeInTheDocument();
  });
});
