import { render, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import Step1 from './Step1';
import { IpTypeEnum } from '@/data/constants';
import { MoveIpAvailableDestinationsResponse } from '@/data/api';
import { getComboboxByName } from '@/test-utils';

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

// Mock hooks
const useGetProductServicesMock = vi.fn(() => ({
  serviceList: [{ serviceName: 'dedicated-1', displayName: 'Dedicated 1' }],
  serviceByCategory: {
    [IpTypeEnum.DEDICATED]: [{ serviceName: 'dedicated-1' }],
  },
}));

const useCheckVmacAvailabilityMock = vi.fn(() => ({
  data: { canAddVmac: false, supported: false },
}));

vi.mock('@/data/hooks', async () => ({
  ...(await vi.importActual('@/data/hooks')),
  useGetProductServices: () => useGetProductServicesMock(),
  useCheckVmacAvailability: () => useCheckVmacAvailabilityMock(),
}));

describe('Step1 destination error use case', () => {
  it('sets destination error when dedicated server selected but vmac unavailable', async () => {
    const setDestinationService = vi.fn();
    const setDestinationError = vi.fn();
    const setNextHop = vi.fn();

    const availableDestinations = {
      dedicatedServer: [{ service: 'dedicated-1' }],
    } as MoveIpAvailableDestinationsResponse;

    const { container } = render(
      <Step1
        ip="1.2.3.4"
        currentService=""
        availableDestinations={availableDestinations}
        destinationService={undefined}
        setDestinationService={setDestinationService}
        destinationError={undefined}
        setDestinationError={setDestinationError}
        nextHopList={[]}
        setNextHop={setNextHop}
      />,
    );

    // find the combobox input - OdsCombobox renders a select/combobox element
    const combobox = await getComboboxByName({ container, name: 'service' });

    // Simulate selecting the dedicated service
    fireEvent.change(combobox, { target: { value: 'dedicated-1' } });

    await waitFor(() => {
      // effect should have been triggered and setDestinationError called with step1DestinationError
      expect(setDestinationService).toHaveBeenCalledWith('dedicated-1');
      expect(setDestinationError).toHaveBeenCalled();
    });
  });
});
