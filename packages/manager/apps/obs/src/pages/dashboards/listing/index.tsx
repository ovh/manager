import React, { useState, startTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  Breadcrumb,
  Datagrid,
  BaseLayout,
  DatagridColumn,
  Links,
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

  const [columns, setColumns] = useState<DatagridColumn<any>[]>([
    {
      id: 'productType',
      type: FilterTypeCategories.String,
      label: 'Product type',
      cell: (props) => (
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
      cell: (item) => item.description,
    },
    {
      id: 'action',
      cell: ObsActionMenu,
      isSortable: false,
      label: '',
    },
  ]);

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
