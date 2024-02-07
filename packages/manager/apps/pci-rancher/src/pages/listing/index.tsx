import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHref, useNavigate } from 'react-router-dom';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import { RancherService } from '@/api/api.type';
import Title from '@/components/Title/Title';

import Datagrid from '../../components/layout-helpers/Listing/dataGrid';
import RancherTaskMessage from './RancherTaskMessage';

export interface ListingProps {
  data: RancherService[];
}

const Listing: React.FC<ListingProps> = ({ data }) => {
  const { t } = useTranslation('pci-rancher/listing');
  const hrefDashboard = useHref('');
  const navigate = useNavigate();
  if (data.length === 0) {
    navigate(
      `/pci/projects/5a6980507c0a40dca362eb9b22d79044/rancher/onboarding`,
    );
  }

  const tasks = data.map((rancher) => rancher.currentTasks).flat();

  return (
    <>
      <Title>{t('rancherTitle')}</Title>
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
      {tasks.length ? <RancherTaskMessage tasks={tasks} /> : <></>}
      <Datagrid data={data} />
    </>
  );
};

export default Listing;
