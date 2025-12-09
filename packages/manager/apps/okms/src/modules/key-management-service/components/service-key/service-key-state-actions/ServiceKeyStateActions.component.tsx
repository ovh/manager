import { useServiceKeyActionsList } from '@key-management-service/hooks/service-key/useServiceKeyActionsList';
import { OKMS } from '@key-management-service/types/okms.type';
import { OkmsServiceKey } from '@key-management-service/types/okmsServiceKey.type';

import {
  ODS_BUTTON_ICON_ALIGNMENT,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';

import { ManagerButton } from '@ovh-ux/manager-react-components';

type ServiceKeyStateActionsProps = {
  okms: OKMS;
  okmsKey: OkmsServiceKey;
};

const ServiceKeyStateActions = ({ okms, okmsKey }: ServiceKeyStateActionsProps) => {
  const actionList = useServiceKeyActionsList(okms, okmsKey, 'detail');

  return (
    <div className="mt-2 flex max-w-fit flex-col justify-start gap-3">
      {actionList.map((action) => (
        <ManagerButton
          {...action}
          key={`action-list-${action.name}`}
          id={`action-list-${action.name}`}
          color={action.color}
          variant={ODS_BUTTON_VARIANT.ghost}
          size={ODS_BUTTON_SIZE.sm}
          iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.right}
        />
      ))}
    </div>
  );
};

export default ServiceKeyStateActions;
