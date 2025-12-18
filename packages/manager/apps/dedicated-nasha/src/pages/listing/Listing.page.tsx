import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseLayout, Datagrid } from '@ovh-ux/muk';
import { Button, BUTTON_COLOR, BUTTON_VARIANT } from '@ovhcloud/ods-react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNashaList } from '@/hooks/nasha/useNasha';
import { useDatagridColumns } from './datagrid.columns';
import { NASHA_TITLE } from '@/constants/nasha.constants';
import { urls } from '@/routes/Routes.constants';

export default function ListingPage() {
  const { t } = useTranslation('listing');
  const { shell } = useContext(ShellContext);
  const navigate = useNavigate();
  const { data: nashaList, isLoading } = useNashaList();
  const columns = useDatagridColumns();

  const handleOrderClick = () => {
    shell.tracking?.trackClick({
      name: 'nasha::directory::add',
      type: 'action',
    });
    navigate(urls.order);
  };

  return (
    <BaseLayout
      header={{
        title: NASHA_TITLE,
      }}
    >
      <div className="mb-5">
        <Button
          onClick={handleOrderClick}
          color={BUTTON_COLOR.primary}
          variant={BUTTON_VARIANT.default}
        >
          {t('nasha_directory_order_label')}
        </Button>
      </div>

      <Datagrid
        // MUK Datagrid expects a generic record type.
        columns={columns as unknown as Parameters<typeof Datagrid>[0]['columns']}
        data={(nashaList || []) as unknown as Parameters<typeof Datagrid>[0]['data']}
        totalCount={nashaList?.length || 0}
        isLoading={isLoading}
      />
    </BaseLayout>
  );
}
