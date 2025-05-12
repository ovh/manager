import { vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { deleteService } from './post';

const mockId = 123123;

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    post: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('delete service test suite', () => {
  const useCases: {
    ovhSubsidiary: string;
    apiEndpoint: string;
    httpMethod: keyof typeof v6;
  }[] = [
    {
      ovhSubsidiary: 'FR',
      apiEndpoint: `/services/${mockId}/terminate`,
      httpMethod: 'post',
    },
    {
      ovhSubsidiary: 'US',
      apiEndpoint: `/services/${mockId}`,
      httpMethod: 'delete',
    },
  ];

  test.each(useCases)(
    'should use the correct API endpoint for subsidiary: $ovhSubsidiary',
    async ({ ovhSubsidiary, apiEndpoint: apiEnpoint, httpMethod }) => {
      await deleteService({ serviceId: mockId }, ovhSubsidiary);

      expect(v6[httpMethod]).toHaveBeenCalledWith(apiEnpoint);
    },
  );
});
