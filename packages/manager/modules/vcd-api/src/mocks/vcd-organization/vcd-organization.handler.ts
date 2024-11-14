import { PathParams } from 'msw';
import { Handler } from '../../types';
import { organizationList } from './vcd-organization.mock';

export type GetOrganizationMocksParams = {
  isOrganizationKo?: boolean;
  isOrganizationUpdateKo?: boolean;
  isOrganizationResetPasswordKo?: boolean;
  nbOrganization?: number;
  allOrgsBackedUp?: boolean;
};

const findOrganizationById = (params: PathParams) =>
  organizationList.find(({ id }) => id === params.id);

export const getOrganizationMocks = ({
  isOrganizationKo,
  isOrganizationUpdateKo,
  isOrganizationResetPasswordKo,
  nbOrganization = Number.POSITIVE_INFINITY,
  allOrgsBackedUp,
}: GetOrganizationMocksParams): Handler[] => {
  const nb = allOrgsBackedUp ? 1 : nbOrganization;
  return [
    {
      url: '/vmwareCloudDirector/organization/:id',
      response: isOrganizationUpdateKo
        ? { message: 'Organization update error' }
        : {},
      method: 'put',
      api: 'v2',
      status: isOrganizationUpdateKo ? 500 : 200,
    },
    {
      url: '/vmwareCloudDirector/organization/:id/password',
      response: isOrganizationResetPasswordKo
        ? { message: 'Organization reset password error' }
        : {},
      method: 'post',
      api: 'v2',
      status: isOrganizationResetPasswordKo ? 500 : 200,
    },
    {
      url: '/vmwareCloudDirector/organization/:id',
      response: (_: unknown, params: PathParams) =>
        isOrganizationKo
          ? { message: 'Organization error' }
          : findOrganizationById(params),
      api: 'v2',
      status: isOrganizationKo ? 500 : 200,
    },
    {
      url: '/vmwareCloudDirector/organization',
      response: isOrganizationKo
        ? { message: 'Organization error' }
        : organizationList.slice(0, nb),
      status: isOrganizationKo ? 500 : 200,
      api: 'v2',
    },
  ];
};
