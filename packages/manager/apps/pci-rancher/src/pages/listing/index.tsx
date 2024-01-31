import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_SIZE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { Navigate } from 'react-router-dom';
import Datagrid from '../../components/layout-helpers/Listing/dataGrid';
import { RancherService } from '../../api/api.type';
import RancherTaskMessage from './RancherTaskMessage';

export interface ListingProps {
  data: RancherService[];
}

const Listing: React.FC<ListingProps> = ({ data }) => {
  const { t } = useTranslation('pci-rancher/listing');

  if (data.length === 0) {
    return <Navigate to="/onboarding" />;
  }

  const tasks = data.map((rancher) => rancher.currentTasks).flat();

  return (
    <>
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        size={ODS_THEME_SIZE._600 as any}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('rancherTitle')}
      </OsdsText>
      <RancherTaskMessage tasks={tasks} />
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
              className="mr-4"
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
