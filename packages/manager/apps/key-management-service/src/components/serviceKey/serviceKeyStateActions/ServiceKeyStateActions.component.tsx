import React from 'react';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { ManagerButton } from '@ovh-ux/manager-react-components';
import {
  ODS_LINK_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_ICON_ALIGNMENT,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_LINK_ICON_ALIGNMENT,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import {
  useOvhTracking,
  ButtonType,
  PageLocation,
} from '@ovh-ux/manager-react-shell-client';
import {
  OkmsServiceKey,
  OkmsKeyTypes,
  OkmsServiceKeyState,
} from '@/types/okmsServiceKey.type';
import useServiceKeyActionsList from '@/hooks/serviceKey/useServiceKeyActionsList';
import { OKMS } from '@/types/okms.type';

type ServiceKeyStateActionsProps = {
  okms: OKMS;
  okmsKey: OkmsServiceKey;
};

const ActionsIcons = [
  { id: 1, icon: ODS_ICON_NAME.download },
  { id: 2, icon: ODS_ICON_NAME.lockClose },
  { id: 3, icon: ODS_ICON_NAME.refresh },
  { id: 4, icon: ODS_ICON_NAME.trash },
];

const getActionIcon = (id: number) =>
  ActionsIcons.find((actionIcon) => actionIcon.id === id)?.icon;

const ServiceKeyStateActions = ({
  okms,
  okmsKey,
}: ServiceKeyStateActionsProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const actionList = useServiceKeyActionsList(okms, okmsKey);
  const { trackClick } = useOvhTracking();

  return (
    <div className="flex flex-col max-w-fit justify-start gap-3 mt-2">
      {okmsKey?.type !== OkmsKeyTypes.oct && (
        <OdsLink
          className="block pl-1"
          label={t('key_management_service_service-keys_link_download_key')}
          color={ODS_LINK_COLOR.primary}
          isDisabled={okmsKey?.state !== OkmsServiceKeyState.active}
          download={`${okmsKey?.name}.jwk`}
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(okmsKey?.keys),
          )}`}
          onClick={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['download_encryption_key'],
            });
          }}
          icon={ODS_ICON_NAME.download}
          iconAlignment={ODS_LINK_ICON_ALIGNMENT.right}
        />
      )}
      {actionList
        .filter((action) => !action.href)
        .map((action) => (
          <ManagerButton
            {...action}
            key={`action-list-${action.id}`}
            id={`action-list-${action.id}`}
            color={action.color}
            variant={ODS_BUTTON_VARIANT.ghost}
            size={ODS_BUTTON_SIZE.sm}
            iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.right}
            icon={getActionIcon(action.id)}
          />
        ))}
    </div>
  );
};

export default ServiceKeyStateActions;
