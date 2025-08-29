import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ActivateMonthlyBilling from './ActivateMonthlyBilling.page';
import * as _useConsumptionHook from '@/api/hook/useConsumption';
import { wrapper } from '@/wrapperRenders';

describe('ActivateMonthlyBilling', () => {
  it('matches snapshot', () => {
    const mockedActivateMonthlyBilling = vi.fn();
    vi.spyOn(_useConsumptionHook, 'useActivateMonthlyBilling').mockReturnValue(
      ({
        activateMonthlyBilling: mockedActivateMonthlyBilling,
        isPending: false,
      } as unknown) as any,
    );

    const { asFragment } = render(<ActivateMonthlyBilling />, {
      wrapper,
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should call activateMonthlyBilling mutation when confirm btn is clicked', async () => {
    const mockedActivateMonthlyBilling = vi.fn();
    vi.spyOn(_useConsumptionHook, 'useActivateMonthlyBilling').mockReturnValue(
      ({
        activateMonthlyBilling: mockedActivateMonthlyBilling,
        isPending: false,
      } as unknown) as any,
    );

    const { getByTestId } = render(<ActivateMonthlyBilling />, {
      wrapper,
    });

    const confirmButton = getByTestId('pciModal-button_submit');

    act(() => {
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(mockedActivateMonthlyBilling).toHaveBeenNthCalledWith(
        1,
        'instance-id',
      );
    });
  });
});
