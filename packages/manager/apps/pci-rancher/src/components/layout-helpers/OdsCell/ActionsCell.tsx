import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { OsdsMenu, OsdsMenuItem } from '@ovhcloud/ods-components/menu/react';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { DataGridCellProps } from './ProductStatusCell';
import { RancherService, RessourceStatus } from '@/api/api.type';

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
  return (
    <div>
      <OsdsMenu>
        <OsdsButton
          slot="menu-title"
          inline
          circle
          color={ODS_THEME_COLOR_INTENT.info}
          variant={ODS_BUTTON_VARIANT.flat}
          type={ODS_BUTTON_TYPE.button}
          size={ODS_BUTTON_SIZE.sm}
          disabled={isLoading || !editable || undefined}
        >
          <OsdsIcon
            contrasted
            color={ODS_THEME_COLOR_INTENT.default}
            name={ODS_ICON_NAME.ELLIPSIS}
            size={ODS_ICON_SIZE.xs}
          />
        </OsdsButton>
        {rowData.resourceStatus !== RessourceStatus.ERROR && (
          <OsdsMenuItem>
            <OsdsButton
              color="primary"
              size="sm"
              variant="ghost"
              text-align="start"
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
            variant="ghost"
            text-align="start"
            flex=""
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
