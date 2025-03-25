import { TServiceProperty } from '@/alldoms/types';
import { ServiceInfoType } from '../enum/service.enum';

export const serviceInfoProperty: TServiceProperty[] = [
  {
    iam: {
      id: '7b7be0c4-a42c-49cc-97fa-a3f4c5a52fdd',
      urn: 'urn:v1:eu:resource:alldom:testdomain-puweb',
    },
    name: 'testdomain-puweb',
    offer: 'gold',
    type: ServiceInfoType.FrenchInternational,
  },
];
