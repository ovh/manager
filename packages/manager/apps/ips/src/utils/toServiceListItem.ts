import { IamObject } from '@ovh-ux/manager-react-components';

export const toServiceListItem = ({
  name,
  iam,
}: {
  name: string;
  iam: IamObject;
}) => {
  const serviceName = iam.urn.split(':').pop();
  return {
    serviceName,
    displayName: iam.displayName || name || serviceName,
  };
};
