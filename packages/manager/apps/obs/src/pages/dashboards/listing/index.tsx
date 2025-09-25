import React, { startTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  Breadcrumb,
  Datagrid,
  BaseLayout,
  Links,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';

import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import appConfig from '@/obs.config';

import { data } from '@/mocks/dashboards.json';
import ObsActionMenu from '@/components/menu/ObsActionMenu.component';

export default function Listing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('dashboards');

  const navigateToDashboard = (dashboardId: string) => {
    startTransition(() => navigate(`${location.pathname}/${dashboardId}`));
  };

  type TDashboard = {
    productType: string;
    description: string;
  };

  const columns: DatagridColumn<TDashboard>[] = [
    {
      id: 'productType',
      type: FilterTypeCategories.String,
      label: 'Product type',
      cell: (props: TDashboard) => (
        <Links
          onClickReturn={() => {
            navigateToDashboard(`${props?.productType}`);
          }}
          label={props?.productType}
        />
      ),
    },
    {
      id: 'description',
      type: FilterTypeCategories.String,
      label: 'Description',
      cell: (props) => <OdsText>{props.description}</OdsText>,
    },
    {
      id: 'action',
      cell: ObsActionMenu,
      isSortable: false,
      label: '',
    },
  ];

  const header = {
    title: t('title'),
  };

  const TopbarCTA = () => (
    <div>
      <OdsButton
        icon={ODS_ICON_NAME.plus}
        size={ODS_BUTTON_SIZE.sm}
        label="Add dashboard"
      />
    </div>
  );

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb rootLabel={appConfig.rootLabel} appName="obs" />}
      header={header}
    >
      <React.Suspense>
        {columns && (
          <Datagrid
            columns={columns}
            items={data}
            totalItems={data.length}
            topbar={<TopbarCTA />}
          />
        )}
      </React.Suspense>
    </BaseLayout>
  );
}
