import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_SIZE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { OsdsText } from '@ovhcloud/ods-components/text/react';

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
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        size={ODS_THEME_SIZE._600}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('rancherTitle')}
      </OsdsText>

      <div className="my-3 mt-5">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          inline
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
