import React from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  useNavigate,
  useRouteLoaderData,
  useSearchParams,
} from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { UseQueryResult } from '@tanstack/react-query';
import RenewModalPage from './index';
import { renderWithMockedWrappers } from '@/__tests__/wrapper';
import { tMock } from '@/utils/test/setupTests';
import { useSavingsPlan, useSavingsPlanId } from '@/hooks/useSavingsPlan';
import { pciSavingsPlanMocked } from '@/__mocks__/savingsPlan';
import { SavingsPlanService } from '@/types';

const serviceId = 2025;
const navigate = vi.fn();
const listSubscribedSavingsPlans = vi.fn();
const changePeriodEndAction = vi.fn();
const addSuccess = vi.fn();
const addError = vi.fn();
const clearNotifications = vi.fn();
const refetchSavingsPlan = vi.fn();

vi.mock('react-router-dom');
vi.mocked(useNavigate).mockReturnValue(navigate);
vi.mocked(useRouteLoaderData).mockReturnValue({ serviceId });
vi.mocked(useSearchParams).mockReturnValue([
  new URLSearchParams('sorted=status'),
  vi.fn(),
]);

vi.mock('@/hooks/useSavingsPlan', async (importOriginal) => {
  const original: typeof import('@/hooks/useSavingsPlan') = await importOriginal();
  return {
    ...original,
    useSavingsPlanId: vi.fn(),
    useSavingsPlan: vi.fn(),
  };
});

vi.mocked(useSavingsPlanId).mockReturnValue(pciSavingsPlanMocked.id);
vi.mocked(useSavingsPlan).mockReturnValue(({
  data: [pciSavingsPlanMocked],
  refetch: refetchSavingsPlan,
} as unknown) as UseQueryResult<SavingsPlanService[]>);

vi.mock('@ovh-ux/manager-core-api');
vi.mocked(v6.get).mockImplementation(listSubscribedSavingsPlans);
vi.mocked(v6.post).mockImplementation(changePeriodEndAction);
listSubscribedSavingsPlans.mockResolvedValue({
  data: [pciSavingsPlanMocked],
});

vi.mock('@ovh-ux/manager-react-components');
vi.mocked(useNotifications).mockImplementation(() => ({
  addSuccess,
  addError,
  clearNotifications,
}));

const confirmRenewalChange = async () => {
  renderWithMockedWrappers(<RenewModalPage />);

  const button = screen.getByTestId('renewModal-button_confirm');
  await act(() => userEvent.click(button));

  return button;
};

describe('Considering RenewModal page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should notify the failure and close the modal when the renewal change fails', async () => {
    changePeriodEndAction.mockRejectedValue(
      new Error('changePeriodEndAction KO'),
    );

    await confirmRenewalChange();

    await waitFor(() =>
      expect(addError).toHaveBeenCalledWith('banner_renew_error'),
    );
    expect(tMock).toHaveBeenCalledWith('banner_renew_error', {
      planName: pciSavingsPlanMocked.displayName,
      error: 'changePeriodEndAction KO',
    });
    expect(addSuccess).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith({
      pathname: '..',
      search: 'sorted=status',
    });
  });

  it('should notify the success and close the modal when the renewal change succeeds', async () => {
    changePeriodEndAction.mockResolvedValue({ data: {} });

    await confirmRenewalChange();

    await waitFor(() =>
      expect(addSuccess).toHaveBeenCalledWith('banner_renew_deactivate'),
    );
    expect(addError).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith({
      pathname: '..',
      search: 'sorted=status',
    });
  });

  it('should clear previous notifications and disable the renewal on the subscribed plan', async () => {
    changePeriodEndAction.mockResolvedValue({ data: {} });

    await confirmRenewalChange();

    expect(clearNotifications).toHaveBeenCalled();
    expect(
      changePeriodEndAction,
    ).toHaveBeenCalledWith(
      `/services/${serviceId}/savingsPlans/subscribed/${pciSavingsPlanMocked.id}/changePeriodEndAction`,
      { periodEndAction: 'TERMINATE' },
    );
  });

  it('should keep the confirm button loading while the renewal change is pending', async () => {
    changePeriodEndAction.mockReturnValue(new Promise(() => {}));

    const button = await confirmRenewalChange();

    await waitFor(() => expect(button).toHaveAttribute('is-loading', 'true'));
    expect(navigate).not.toHaveBeenCalled();
  });
});
