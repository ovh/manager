import { ServiceKeyAction } from '@key-management-service/hooks/service-key/service-key.type';
import { useServiceKeyActionsList } from '@key-management-service/hooks/service-key/useServiceKeyActionsList';
import { OKMS } from '@key-management-service/types/okms.type';
import { OkmsServiceKey } from '@key-management-service/types/okmsServiceKey.type';

import { Button } from '@ovh-ux/muk';

type ServiceKeyStateActionsProps = {
  okms: OKMS;
  okmsKey: OkmsServiceKey;
};

const STATE_ACTION_BUTTON_IDS: ServiceKeyAction['buttonId'][] = [
  'service-key-deactivate_encryption_key',
  'service-key-reactivate_encryption_key',
  'service-key-delete_encryption_key',
];

const ServiceKeyStateActions = ({ okms, okmsKey }: ServiceKeyStateActionsProps) => {
  const actionList = useServiceKeyActionsList(okms, okmsKey, 'detail');
  const stateActions = actionList.filter((action) =>
    STATE_ACTION_BUTTON_IDS.includes(action.buttonId),
  );

  if (stateActions.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 space-y-3">
      {stateActions.map((action) => (
        <Button
          className="block"
          key={action.buttonId}
          id={action.buttonId}
          data-testid={action.buttonId}
          color={action.color}
          variant="ghost"
          size="sm"
          disabled={action.isDisabled}
          loading={action.isLoading}
          iamActions={action.iamActions}
          urn={action.urn}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default ServiceKeyStateActions;
