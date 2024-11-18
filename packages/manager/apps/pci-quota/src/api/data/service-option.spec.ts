import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getServiceOptions, TServiceOption } from './service-option';

describe('getServiceOptions', () => {
  it('fetches service options successfully', async () => {
    // Arrange
    const mockData: TServiceOption[] = [
      {
        exclusive: true,
        family: 'family',
        mandatory: true,
        planCode: 'planCode',
        prices: [
          {
            capacities: ['capacity1'],
            duration: 'duration',
            pricingMode: 'pricingMode',
            price: {
              text: 'priceText',
            },
          },
        ],
        productName: 'productName',
        productType: 'productType',
      },
    ];
    const projectId = 'test-project-id';
    const url = `/order/cartServiceOption/cloud/${projectId}`;
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });

    // Act
    const result = await getServiceOptions(projectId);

    // Assert
    expect(v6.get).toHaveBeenCalledWith(url);
    expect(result).toEqual(mockData);
  });

  it('handles errors when fetching service options', async () => {
    // Arrange
    const projectId = 'test-project-id';
    const url = `/order/cartServiceOption/cloud/${projectId}`;
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));

    // Act & Assert
    await expect(getServiceOptions(projectId)).rejects.toThrow(errorMessage);
    expect(v6.get).toHaveBeenCalledWith(url);
  });
});
