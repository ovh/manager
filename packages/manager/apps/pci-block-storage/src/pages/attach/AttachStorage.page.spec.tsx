import { describe, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import AttachStorage from './AttachStorage.page';
import * as useInstanceModule from '@/api/hooks/useInstance';
import { Instance } from '@/api/data/instance';

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

describe('AttachStorage', () => {
  it('renders spinner when data is loading', () => {
    vi.mocked(useParams).mockReturnValue({ projectId: '1' });
    vi.spyOn(useInstanceModule, 'useInstances').mockReturnValue({
      isPending: true,
    } as UseQueryResult<Instance[]>);
    const { getByTestId } = render(<AttachStorage />);
    expect(getByTestId('attach-storage-spinner')).toBeInTheDocument();
  });
  it('renders NoInstanceWarningMessage when no instances are available and not pending', () => {
    vi.spyOn(useInstanceModule, 'useInstances').mockReturnValue({
      data: [],
      isPending: false,
    } as UseQueryResult<Instance[]>);

    const { getByTestId } = render(<AttachStorage />);
    waitFor(() =>
      expect(
        getByTestId('AttachStorage-NoInstanceWarningMessage'),
      ).toBeDefined(),
    );
  });

  it('does not render NoInstanceWarningMessage when instances are available', () => {
    vi.spyOn(useInstanceModule, 'useInstances').mockReturnValue({
      data: [{ id: '1', name: 'Instance 1' }],
      isPending: false,
    } as UseQueryResult<Instance[]>);

    const { getByTestId } = render(<AttachStorage />);
    waitFor(() =>
      expect(
        getByTestId('AttachStorage-NoInstanceWarningMessage'),
      ).not.toBeDefined(),
    );
  });

  it('does not render NoInstanceWarningMessage when instances are pending', () => {
    vi.spyOn(useInstanceModule, 'useInstances').mockReturnValue({
      data: undefined,
      isPending: true,
    } as UseQueryResult<Instance[]>);

    render(<AttachStorage />);
    expect(
      screen.queryByText('No instances available'),
    ).not.toBeInTheDocument();
  });
});
