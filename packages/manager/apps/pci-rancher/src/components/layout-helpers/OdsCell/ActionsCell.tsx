import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OsdsButton,
  OsdsIcon,
  OsdsMenu,
  OsdsMenuItem,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { DataGridCellProps } from './ProductStatusCell';
import { RancherService, RessourceStatus } from '../../../api/api.type';

const ActionsCell: React.FC<DataGridCellProps<undefined, RancherService> & {
  isLoading?: boolean;
  openModal: () => void;
  setSelectedRancher: (rancher: RancherService) => void;
}> = ({ isLoading, rowData, openModal, setSelectedRancher }) => {
  const editable = true;
  const { t } = useTranslation('pci-rancher/listing');

  const onDelete = () => {
    setSelectedRancher(rowData);
    openModal();
  };
  const onManage = () => {
    openModal();
  };

  return (
    <div>
      <OsdsMenu
        style={{ position: 'absolute', marginLeft: -10, marginTop: -15 }}
      >
        <OsdsButton
          slot="menu-title"
          inline
          circle
          color={ODS_THEME_COLOR_INTENT.info}
          variant={ODS_BUTTON_VARIANT.stroked}
          type={ODS_BUTTON_TYPE.button}
          size={ODS_BUTTON_SIZE.sm}
          disabled={isLoading || !editable || undefined}
        >
          <OsdsIcon
            color={ODS_THEME_COLOR_INTENT.primary}
            name={ODS_ICON_NAME.ELLIPSIS}
            size={ODS_ICON_SIZE.xs}
          />
        </OsdsButton>
        {rowData.resourceStatus !== RessourceStatus.ERROR && (
          <OsdsMenuItem>
            <OsdsButton
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              text-align="start"
              onClick={onManage}
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
};

export default ActionsCell;
