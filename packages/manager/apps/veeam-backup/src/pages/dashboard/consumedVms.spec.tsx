import { vitest } from 'vitest';
import { waitFor, screen, render } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';

import { ConsumedVms } from './ConsumedVms.component';
import { VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE } from '@/pages/dashboard/Dashboard.constants';

vitest.mock('@/data/hooks/useVeeamBackupConsumption', () => ({
  useVeeamBackupConsumptionQueryOptions: vitest.fn(() => ({})),
}));

vitest.mock('@tanstack/react-query', () => ({
  useQuery: vitest.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
    isPending: false,
  })),
}));
describe('Consumed VMs display', () => {
  beforeAll(() => {
    vitest.resetAllMocks();
  });

  const testCases = [
    {
      contextLabel: 'displays 0 VMs when consumption data is empty',
      mock: {
        data: { data: [] },
        isLoading: false,
        isError: false,
      },
      expected: '0 VM(s)',
      expectedTestId: 'consumed-vms',
    },
    {
      contextLabel:
        'displays 0 VM(s) when consumption data does not have the correct plan code',
      mock: {
        data: {
          data: [
            { planCode: 'randomCode', uniqueId: 'id1', quantity: 0 },
            { planCode: 'randomCode2', uniqueId: 'id2', quantity: 0 },
          ],
        },
        isLoading: false,
        isError: false,
      },
      expected: '0 VM(s)',
      expectedTestId: 'consumed-vms',
    },
    {
      contextLabel:
        'displays 2 VM(s) when consumption data contains two items with the correct plan code',
      mock: {
        data: {
          data: [
            { planCode: 'randomCode1', uniqueId: 'id1', quantity: 0 },
            { planCode: 'randomCode2', uniqueId: 'id2', quantity: 0 },
            {
              planCode: VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE,
              uniqueId: 'id3',
              quantity: 0,
            },
            {
              planCode: VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE,
              uniqueId: 'id4',
              quantity: 0,
            },
          ],
        },
        isLoading: false,
        isError: false,
      },
      expected: '2 VM(s)',
      expectedTestId: 'consumed-vms',
    },
    {
      contextLabel:
        'displays 1 VM(s) when consumption data contains one items with the correct plan code',
      mock: {
        data: {
          data: [
            { planCode: 'randomCode1', uniqueId: 'id1', quantity: 0 },
            { planCode: 'randomCode2', uniqueId: 'id2', quantity: 0 },
            {
              planCode: VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE,
              uniqueId: 'id3',
              quantity: 0,
            },
          ],
        },
        isLoading: false,
        isError: false,
      },
      expected: '1 VM(s)',
      expectedTestId: 'consumed-vms',
    },
    {
      contextLabel: 'displays "-" when the consumption query is loading',
      mock: {
        data: null as any,
        isLoading: true,
        isError: false,
      },
      expected: 2,
    },
    {
      contextLabel: 'displays "-" when the consumption query has an error',
      mock: {
        data: null,
        isLoading: false,
        isError: true,
      },
      expected: '-',
      expectedTestId: 'consumed-vms',
    },

    {
      contextLabel:
        'displays 0 Vm(s) when the return query is  error with code 404',
      mock: {
        data: null as unknown,
        isLoading: false,
        isError: true,
        error: { response: { status: 404 } },
      },
      expected: '0 VM(s)',
      expectedTestId: 'consumed-vms',
    },
    {
      contextLabel:
        'displays "-" when the return query is error with code different than 404',
      mock: {
        data: null as unknown,
        isLoading: false,
        isError: true,
        error: { response: { status: 503 } },
      },
      expected: '-',
      expectedTestId: 'consumed-vms',
    },
  ];

  testCases.forEach(({ contextLabel, mock, expected, expectedTestId }) => {
    it(contextLabel, async () => {
      vitest.mocked(useQuery).mockImplementation((options) => {
        return {
          ...mock,
          data: mock.data ? options.select(mock.data) : null,
        } as ReturnType<typeof useQuery>;
      });

      const { container } = render(
        <ConsumedVms id="toto" backup={undefined} />,
      );

      if (expectedTestId) {
        await waitFor(() => {
          expect(screen.queryByTestId(expectedTestId)).toHaveAttribute(
            'label',
            expected,
          );
        });
      } else {
        await waitFor(() => {
          expect(container.getElementsByTagName('ods-skeleton')).toHaveLength(
            expected as number,
          );
        });
      }
    });
  });
});
