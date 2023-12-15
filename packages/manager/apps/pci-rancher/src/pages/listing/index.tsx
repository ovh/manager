import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import React from 'react';
import { Navigate } from 'react-router-dom';
import Datagrid from '@/components/layout-helpers/Listing/dataGrid';
import { RancherService } from '@/api/api.type';

const Listing: React.FC<{ data: RancherService[] }> = ({ data }) => {
  const { t } = useTranslation('pci-rancher/listing');
  if (data.length === 0) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <>
      <h2>{t('rancherTitle')}</h2>
      <div className="grid gap-4">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="md:w-1/5 my-3"
        >
          <span slot="start" className="flex justify-center items-center">
            <OsdsIcon
              name={ODS_ICON_NAME.ADD}
              size={ODS_ICON_SIZE.xxs}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
            <span>{t('createRancher')}</span>
          </span>
        </OsdsButton>
      </div>
      <Datagrid data={data} />
    </>
  );
};

export default Listing;
