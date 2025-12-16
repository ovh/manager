import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseLayout, Datagrid } from '@ovh-ux/muk';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, BUTTON_COLOR } from '@ovhcloud/ods-react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNashaList } from '@/hooks/nasha/useNasha';
import { useDatagridColumns } from './datagrid.columns';

export default function ListingPage() {
  const { t } = useTranslation('listing');
  const { shell } = useContext(ShellContext);
  const { data: nashaList, isLoading } = useNashaList();
  const columns = useDatagridColumns();

  const handleOrderClick = () => {
    shell.tracking.trackClick({
      name: 'nasha::directory::add',
      type: 'action',
    });
    // Assuming the order page is at this hash URL as per angular routing
    window.location.href = '#/nasha/order';
  };

  return (
    <BaseLayout
      header={{
        title: 'NAS-HA',
      }}
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">NAS-HA</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      }
    >
      <div className="mb-5">
        <Button
          onClick={handleOrderClick}
          color={BUTTON_COLOR.primary}
        >
          {t('nasha_directory_order_label')}
        </Button>
      </div>

      <Datagrid
        columns={columns}
        data={nashaList || []}
        totalCount={nashaList?.length || 0}
        isLoading={isLoading}
      />
    </BaseLayout>
  );
}
