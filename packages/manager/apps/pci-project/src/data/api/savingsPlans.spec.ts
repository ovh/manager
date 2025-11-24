import { describe, it, expect, beforeEach, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getSavingsPlans } from './savingsPlans';
import { SavingsPlan } from '@/data/types/savingPlan.type';

const mockedV6Get = vi.mocked(v6.get);

describe('getSavingsPlans', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call v6.get with correct endpoint', async () => {
    const mockResponse = {
      data: [],
    };

    mockedV6Get.mockResolvedValue(mockResponse);

    await getSavingsPlans('service-123');

    expect(mockedV6Get).toHaveBeenCalledWith(
      'services/service-123/savingsPlans/subscribed',
    );
  });

  it('should return savings plans data when API call succeeds', async () => {
    const mockSavingsPlans: SavingsPlan[] = [
      {
        id: 'sp-1',
        displayName: 'Test Savings Plan 1',
        status: 'active',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2025-01-01T00:00:00Z',
        flavor: 't1-45',
        offerId: 'offer-1',
        period: '12',
        periodEndAction: 'renew',
        periodEndDate: '2025-01-01T00:00:00Z',
        periodStartDate: '2024-01-01T00:00:00Z',
        plannedChanges: [
          {
            plannedOn: '2024-12-01T00:00:00Z',
            properties: {
              status: 'active',
            },
          },
        ],
        size: 4,
      },
      {
        id: 'sp-2',
        displayName: 'Test Savings Plan 2',
        status: 'pending',
        startDate: '2024-02-01T00:00:00Z',
        endDate: '2025-02-01T00:00:00Z',
        flavor: 't1-90',
        offerId: 'offer-2',
        period: '24',
        periodEndAction: 'terminate',
        periodEndDate: '2025-02-01T00:00:00Z',
        periodStartDate: '2024-02-01T00:00:00Z',
        plannedChanges: [],
        size: 8,
      },
    ];

    const mockResponse = {
      data: mockSavingsPlans,
    };

    mockedV6Get.mockResolvedValue(mockResponse);

    const result = await getSavingsPlans('service-123');

    expect(result).toEqual(mockSavingsPlans);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('sp-1');
    expect(result[1].id).toBe('sp-2');
  });

  it('should return empty array when no savings plans exist', async () => {
    const mockResponse = {
      data: [],
    };

    mockedV6Get.mockResolvedValue(mockResponse);

    const result = await getSavingsPlans('service-123');

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should throw error when API call fails', async () => {
    const mockError = new Error('API Error');
    mockedV6Get.mockRejectedValue(mockError);

    await expect(getSavingsPlans('service-123')).rejects.toThrow('API Error');
  });
});
