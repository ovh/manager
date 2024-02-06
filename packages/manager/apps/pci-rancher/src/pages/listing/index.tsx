import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useHref } from 'react-router-dom';
import { RancherService } from '@/api/api.type';
import Datagrid from '../../components/layout-helpers/Listing/dataGrid';
import RancherTaskMessage from './RancherTaskMessage';
import Title from '@/components/Title/Title';

export interface ListingProps {
  data: RancherService[];
}

const Listing: React.FC<ListingProps> = ({ data }) => {
  const { t } = useTranslation('pci-rancher/listing');
  const hrefDashboard = useHref('');

  if (data.length === 0) {
    return <Navigate to="/onboarding" />;
  }

  const tasks = data.map((rancher) => rancher.currentTasks).flat();

  return (
    <>
      <Title>{t('rancherTitle')}</Title>
      {tasks.length ? <RancherTaskMessage tasks={tasks} /> : <></>}
      <div className="my-3 mt-5">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          inline
          href={`${hrefDashboard}/new`}
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
