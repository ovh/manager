import { TServiceProperty } from '@/alldoms/types';
import { ServiceInfoType } from '../enum/service.enum';

export const serviceInfoProperty: TServiceProperty[] = [
  {
    iam: {
      id: '000',
      urn: 'urn:v1:eu:resource:alldom:testdomain',
    },
    name: 'testdomain-puweb',
    offer: 'gold',
    type: ServiceInfoType.FrenchInternational,
  },
];
