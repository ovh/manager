import { IamActions, IamAuthorizationsResponse } from '@/api';

type CheckPermsUtils = {
  iamAuthorizations: IamAuthorizationsResponse[];
  urn: string;
  action: string;
};

export default ({
  iamAuthorizations,
  urn,
  action,
}: CheckPermsUtils): boolean => {
  let authorized = false;
  console.log(authorized);
  iamAuthorizations.forEach((authorization) => {
    if (
      authorization.resourceURN === urn &&
      authorization.authorizedActions.includes(action)
    ) {
      authorized = true;
    }
  });

  return authorized;
};
