import { User } from '@ovh-ux/manager-config';
import user from '@/types/User';
import ai from '@/types/AI';

export const mockedUser: User = {
  nichandle: 'test123',
  address: 'address',
  area: 'area',
  auth: {
    description: 'description',
    method: 'method',
    roles: [],
    user: 'user',
    account: '',
    allowedRoutes: [],
    identities: [],
  },
  birthCity: 'birthCity',
  birthDay: 'birthDay',
  certificates: [],
  city: 'city',
  companyNationalIdentificationNumber: '0',
  corporationType: '',
  country: 'FR',
  currency: {
    code: '',
    format: '',
    symbol: '',
  },
  customerCode: '',
  email: '',
  enterprise: false,
  fax: '',
  firstname: '',
  isTrusted: false,
  italianSDI: '',
  kycValidated: false,
  language: 'fr_FR',
  legalform: 'individual',
  name: '',
  nationalIdentificationNumber: '0',
  organisation: '',
  ovhCompany: '',
  ovhSubsidiary: 'FR',
  phone: '',
  phoneCountry: 'FR',
  sex: '',
  spareEmail: '',
  state: '',
  supportLevel: {
    level: '',
  },
  vat: '',
  zip: '',
};

export const mockedUserDetails: user.UserDetail = {
  creationDate: '1989/04/08',
  description: 'description',
  id: 25,
  openstackId: 'openStackId',
  roles: [
    {
      description: 'description',
      id: 'idRole',
      name: 'roleName',
      permissions: ['RO'],
    },
  ],
  status: user.UserStatusEnum.ok,
  username: 'username',
  password: 'password',
};

export const mockedPublicCloudUser: user.User = {
  creationDate: '1989/04/08',
  description: 'description',
  id: 25,
  openstackId: 'openStackId',
  roles: [
    {
      id: 'idRole',
      description: 'roleDescription',
      name: 'roleName',
      permissions: ['RO'],
    },
  ],
  status: user.UserStatusEnum.ok,
  username: 'username',
};

export const mockedUserCreation = {
  description: 'description',
  role: ai.TokenRoleEnum.ai_training_operator,
};
