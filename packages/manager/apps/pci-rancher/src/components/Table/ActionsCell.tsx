import React from 'react';
import {
  OsdsButton,
  OsdsMenu,
  OsdsMenuItem,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components/';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ResourceStatus } from '@/api/api.type';
import { RancherActionsCell } from './Table.type';
import './Table.scss';

export default function ActionsCell({
  row,
  openModal,
  setSelectedRancher,
  onClickManage,
}: Readonly<RancherActionsCell>) {
  const editable = true;
  const { t } = useTranslation('pci-rancher/listing');

  const onDelete = () => {
    setSelectedRancher(row.original);
    openModal();
  };

  const NOT_EDITABLE_STATUS: ResourceStatus[] = [
    ResourceStatus.CREATING,
    ResourceStatus.DELETING,
    ResourceStatus.UPDATING,
  ];

  return NOT_EDITABLE_STATUS.includes(row.original.resourceStatus) ? null : (
    <div>
      <OsdsMenu className="absolute  mt-[-15px]">
        <OsdsButton
          slot="menu-title"
          inline
          circle
          color={ODS_THEME_COLOR_INTENT.info}
          variant={ODS_BUTTON_VARIANT.stroked}
          type={ODS_BUTTON_TYPE.button}
          size={ODS_BUTTON_SIZE.sm}
          disabled={!editable || undefined}
        >
          <OsdsIcon
            color={ODS_THEME_COLOR_INTENT.primary}
            name={ODS_ICON_NAME.ELLIPSIS}
            size={ODS_ICON_SIZE.xs}
          />
        </OsdsButton>
        {row?.original?.resourceStatus !== ResourceStatus.ERROR && (
          <OsdsMenuItem>
            <OsdsButton
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              text-align="start"
              onClick={() => onClickManage(row?.original?.id)}
            >
              <span slot="start">
                <span>{t('manage')}</span>
              </span>
            </OsdsButton>
          </OsdsMenuItem>
        )}
        <OsdsMenuItem>
          <OsdsButton
            type={ODS_BUTTON_TYPE.button}
            size={ODS_BUTTON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.error}
            variant={ODS_BUTTON_VARIANT.ghost}
            text-align="start"
            class="hydrated"
            onClick={onDelete}
          >
            <span slot="start">
              <span>{t('delete')}</span>
            </span>
          </OsdsButton>
        </OsdsMenuItem>
      </OsdsMenu>
    </div>
  );
}
