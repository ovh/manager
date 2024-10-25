import { OsdsIcon, OsdsButton } from '@ovhcloud/ods-components/react';
import React from 'react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TEXT_ALIGN,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OkmsAllServiceKeys } from '@/types/okmsServiceKey.type';
import useServiceKeyActionsList from '@/hooks/serviceKey/useServiceKeyActionsList';

type ServiceKeyStateActionsProps = {
  okmsId: string;
  okmsKey: OkmsAllServiceKeys;
};

const ActionsIcons = [
  { id: 1, icon: ODS_ICON_NAME.DOWNLOAD },
  { id: 2, icon: ODS_ICON_NAME.CLOSE },
  { id: 3, icon: ODS_ICON_NAME.REFRESH },
  { id: 4, icon: ODS_ICON_NAME.TRASH },
];

const ServiceKeyStateActions = ({
  okmsId,
  okmsKey,
}: ServiceKeyStateActionsProps) => {
  const actionList = useServiceKeyActionsList(okmsId, okmsKey);

  const getActionIcon = (id: number) => {
    return ActionsIcons.find((actionIcon) => actionIcon.id === id)?.icon;
  };
  return (
    <>
      {actionList.map((action) => (
        <OsdsButton
          key={action.id}
          color={action.color}
          variant={ODS_BUTTON_VARIANT.ghost}
          size={ODS_BUTTON_SIZE.sm}
          textAlign={ODS_BUTTON_TEXT_ALIGN.start}
          onClick={action.onClick}
          disabled={action.disabled || undefined}
          href={action.href}
          download={action.download}
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
      ))}
    </>
  );
};

export default ServiceKeyStateActions;
