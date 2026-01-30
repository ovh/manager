import { ContactType, ServiceDetailsType } from '@/data/types/product/service';
import {
  PublicService,
  ResourceStatus,
} from '@/data/types/product/videoManagerCenter/publicService';

export const publicServiceMock: PublicService = {
  id: 'test-service-id',
  resourceStatus: ResourceStatus.READY,
  currentState: {
    createdAt: new Date('2024-01-15T10:00:00Z'),
    offerName: 'Premium',
    vodCount: {
      hostable: 100,
      allocated: 50,
    },
    vodDurationMinutes: {
      hostable: 1000,
      allocated: 500,
    },
  },
};

export const serviceDetailsMock: ServiceDetailsType = {
  customer: {
    contacts: [
      {
        customerCode: 'CUST-001',
        type: ContactType.administrator,
      },
    ],
  },
};
