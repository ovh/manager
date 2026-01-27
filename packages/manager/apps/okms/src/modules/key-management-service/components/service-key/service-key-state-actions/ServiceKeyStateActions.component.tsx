import { useServiceKeyActionsList } from '@key-management-service/hooks/service-key/useServiceKeyActionsList';
import { OKMS } from '@key-management-service/types/okms.type';
import { OkmsServiceKey } from '@key-management-service/types/okmsServiceKey.type';

import { Icon } from '@ovhcloud/ods-react';

import { Button } from '@ovh-ux/muk';

type ServiceKeyStateActionsProps = {
  okms: OKMS;
  okmsKey: OkmsServiceKey;
};

const ServiceKeyStateActions = ({ okms, okmsKey }: ServiceKeyStateActionsProps) => {
  const actionList = useServiceKeyActionsList(okms, okmsKey, 'detail');

  return (
    <div className="mt-2 flex max-w-fit flex-col justify-start gap-3">
      {actionList.map((action) => (
        <Button
          key={action.buttonId}
          id={action.buttonId}
          data-testid={action.buttonId}
          color={action.color}
          variant="ghost"
          size="sm"
          disabled={action.disabled}
          loading={action.loading}
          iamActions={action.iamActions}
          urn={action.urn}
          onClick={action.onClick}
        >
          <>
            {action.label}
            <Icon name={action.icon} />
          </>
        </Button>
      ))}
    </div>
  );
};

export default ServiceKeyStateActions;
