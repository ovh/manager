import { IAM_ACTION } from '../../src/utils/iamActions.constants';

const defaultUrn = 'urn:v1:eu:resource:vrackServices:vrs-ar7-72w-poh-3qe';

export const configureIamResponse = ({
  unauthorizedActions = [],
  urn,
}: {
  unauthorizedActions?: string[];
  urn?: string;
}) => {
  const allActions = Object.values(IAM_ACTION);
  const authorizedActions = allActions.filter(
    (action) => !unauthorizedActions.includes(action),
  );
  return {
    urn: urn || defaultUrn,
    authorizedActions,
    unauthorizedActions,
  };
};
