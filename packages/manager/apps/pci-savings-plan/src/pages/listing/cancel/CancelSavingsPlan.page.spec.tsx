import React from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, vi } from 'vitest';
import { renderWithMockedWrappers } from '@/__tests__/wrapper';
import CancelSavingsPlan from './CancelSavingsPlan.page';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cancelSavingsPlan } from '@/data/api/services';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useSavingsPlan } from '@/hooks/useSavingsPlan';
import { UseQueryResult } from '@tanstack/react-query';
import { SavingsPlanService } from '@/types';

const navigate = vi.fn();
const cancelSavingsPlanMock = vi.fn();
const addSuccess = vi.fn();
const addError = vi.fn();
const refetchSavingsPlan = vi.fn();
const useSearchParamsMocked = vi
  .fn()
  .mockReturnValue([new URLSearchParams('sorted=status'), vi.fn]);

vi.mock('react-router-dom');
vi.mocked(useNavigate).mockReturnValue(navigate);
vi.mocked(useSearchParams).mockImplementation(useSearchParamsMocked);

vi.mock('@/hooks/useSavingsPlan', async (importOriginal) => {
  const original: typeof import('@/hooks/useSavingsPlan') = await importOriginal();
  return {
    ...original,
    useServiceId: vi.fn().mockReturnValue(2025),
    useSavingsPlanId: vi.fn().mockReturnValue('fakeSavingsPlanId'),
    useSavingsPlan: vi.fn(),
  };
});

vi.mock('@/data/api/services');
vi.mocked(cancelSavingsPlan).mockImplementation(cancelSavingsPlanMock);

vi.mock('@ovh-ux/manager-react-components');
vi.mocked(useNotifications).mockImplementation(() => ({
  addSuccess,
  addError,
}));

vi.mocked(useSavingsPlan).mockReturnValue(({
  refetch: refetchSavingsPlan,
} as unknown) as UseQueryResult<SavingsPlanService[]>);

describe('Considering CancelSavingsPlan page', () => {
  it('should navigate back with current sorted query search params when cancel', async () => {
    renderWithMockedWrappers(<CancelSavingsPlan />);

    const button = screen.getByRole('button', { name: 'close_modal' });

    await userEvent.click(button);

    expect(button).toBeVisible();
    expect(navigate).toHaveBeenCalledWith({
      pathname: '..',
      search: 'sorted=status',
    });
  });

  it('should call cancelSavingsPlan mutation', async () => {
    cancelSavingsPlanMock.mockResolvedValue({});
    renderWithMockedWrappers(<CancelSavingsPlan />);

    const button = screen.getByRole('button', { name: 'confirm' });

    await act(() => userEvent.click(button));

    waitFor(() => {
      expect(button).toBeVisible();
      expect(button).toHaveAttribute('is-loading', 'true');
      expect(cancelSavingsPlan).toHaveBeenCalledWith(2025, 'fakeSavingsPlanId');
    });
  });

  it('should refetch savingsPlan and call addSuccess notification when successfully cancel savings plan', async () => {
    cancelSavingsPlanMock.mockResolvedValue(null);
    renderWithMockedWrappers(<CancelSavingsPlan />);

    const button = screen.getByRole('button', { name: 'confirm' });

    await act(() => userEvent.click(button));

    expect(refetchSavingsPlan).toHaveBeenCalled();
    expect(addSuccess).toHaveBeenCalledWith('cancel_savings_plan_success');
  });

  it('should call addError notification when error occurs on cancel savings plan', async () => {
    cancelSavingsPlanMock.mockRejectedValue(
      new Error('cancelSavingsPlan failed'),
    );
    renderWithMockedWrappers(<CancelSavingsPlan />);

    const button = screen.getByRole('button', { name: 'confirm' });

    await act(() => userEvent.click(button));

    expect(addError).toHaveBeenCalledWith('cancel_savings_plan_error');
  });
});
