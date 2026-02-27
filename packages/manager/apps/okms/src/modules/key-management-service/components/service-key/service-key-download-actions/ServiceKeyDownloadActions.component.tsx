import { ServiceKeyAction } from '@key-management-service/hooks/service-key/service-key.type';
import { useServiceKeyActionsList } from '@key-management-service/hooks/service-key/useServiceKeyActionsList';
import { OKMS } from '@key-management-service/types/okms.type';
import { OkmsServiceKey } from '@key-management-service/types/okmsServiceKey.type';

import { Button } from '@ovh-ux/muk';

type ServiceKeyDownloadActionsProps = {
  okms: OKMS;
  okmsKey: OkmsServiceKey;
};

const DOWNLOAD_ACTION_BUTTON_IDS: ServiceKeyAction['buttonId'][] = [
  'service-key-download_encryption_key_pem',
  'service-key-download_encryption_key_jwk',
];

const ServiceKeyDownloadActions = ({ okms, okmsKey }: ServiceKeyDownloadActionsProps) => {
  const actionList = useServiceKeyActionsList(okms, okmsKey, 'detail');
  const downloadActions = actionList.filter((action) =>
    DOWNLOAD_ACTION_BUTTON_IDS.includes(action.buttonId),
  );

  if (downloadActions.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 space-y-3">
      {downloadActions.map((action) => (
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

export default ServiceKeyDownloadActions;
