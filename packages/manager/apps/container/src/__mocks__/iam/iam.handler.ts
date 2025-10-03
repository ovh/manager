import { Handler } from "@ovh-ux/manager-core-test-utils";
import { iamResource } from "./iam.data";

export const getIamMocks = (params: {
  actions?: string[];
  isAuthorized?: boolean;
} = {}): Handler[] => {
  const {
    actions = ['account:apiovh:me/agreements/accept'],
    isAuthorized = true,
  } = params;

  const encodedUrn = encodeURIComponent(iamResource[0].urn);

  return [
    {
      url: 'iam/resource',
      response: iamResource,
      api: 'v2',
      delay: 0,
    },
    {
      method: 'post',
      url: `iam/resource/${encodedUrn}/authorization/check`,
      response: {
        authorizedActions: isAuthorized ? actions : [],
        unauthorizedActions: isAuthorized ? [] : actions,
      },
      api: 'v2',
      delay: 0,
    },
  ];
};
