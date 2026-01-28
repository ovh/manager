import { Icon } from '@ovhcloud/ods-react';

import { Button } from '@ovh-ux/muk';

type RemoveIdentityButtonProps = {
  onClick: () => void;
  testId: string;
};

export const RemoveIdentityButton = ({ onClick, testId }: RemoveIdentityButtonProps) => {
  return (
    <Button data-testid={testId} color="critical" size="sm" onClick={onClick}>
      <Icon name="trash" />
    </Button>
  );
};
