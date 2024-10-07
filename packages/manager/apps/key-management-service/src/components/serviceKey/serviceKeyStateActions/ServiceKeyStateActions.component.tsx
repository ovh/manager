import React from 'react';
import { OsdsIcon, OsdsButton } from '@ovhcloud/ods-components/react';
import { ManagerButton } from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TEXT_ALIGN,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OkmsAllServiceKeys } from '@/types/okmsServiceKey.type';
import useServiceKeyActionsList from '@/hooks/serviceKey/useServiceKeyActionsList';
import { OKMS } from '@/types/okms.type';

type ServiceKeyStateActionsProps = {
  okms: OKMS;
  okmsKey: OkmsAllServiceKeys;
};

const ActionsIcons = [
  { id: 1, icon: ODS_ICON_NAME.DOWNLOAD },
  { id: 2, icon: ODS_ICON_NAME.CLOSE },
  { id: 3, icon: ODS_ICON_NAME.REFRESH },
  { id: 4, icon: ODS_ICON_NAME.TRASH },
];

const ServiceKeyStateActions = ({
  okms,
  okmsKey,
}: ServiceKeyStateActionsProps) => {
  const actionList = useServiceKeyActionsList(okms, okmsKey);

  const getActionIcon = (id: number) => {
    return ActionsIcons.find((actionIcon) => actionIcon.id === id)?.icon;
  };
  return (
    <>
      {actionList.map((action) => {
        return action.iamActions ? (
          <ManagerButton
            key={action.id}
            color={action.color}
            variant={ODS_BUTTON_VARIANT.ghost}
            size={ODS_BUTTON_SIZE.sm}
            textAlign={ODS_BUTTON_TEXT_ALIGN.start}
            onClick={action.onClick}
            disabled={action.disabled || undefined}
            href={action.href}
            download={action.download}
            urn={action.urn}
            iamActions={action.iamActions}
          >
            <span slot="start">{action.label}</span>
            <span slot="end">
              <OsdsIcon
                name={getActionIcon(action.id)}
                size={ODS_ICON_SIZE.xxs}
                color={action.color}
              />
            </span>
          </ManagerButton>
        ) : (
          <OsdsButton
            key={action.id}
            variant={ODS_BUTTON_VARIANT.ghost}
            size={ODS_BUTTON_SIZE.sm}
            color={action.color}
            href={action.href}
            download={action.download}
            disabled={action.disabled || undefined}
            onClick={action.onClick}
          >
            <span slot="start">{action.label}</span>
            <span slot="end">
              <OsdsIcon
                name={getActionIcon(action.id)}
                size={ODS_ICON_SIZE.xxs}
                color={action.color}
              />
            </span>
          </OsdsButton>
        );
      })}
    </>
  );
};

export default ServiceKeyStateActions;
