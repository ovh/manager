import React from 'react';
import { OsdsSpinner, OsdsTile } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { Outlet } from 'react-router-dom';
import { ovhLocaleToI18next } from '@ovh-ux/manager-react-shell-client';
import { DashboardTile, Region } from '@ovh-ux/manager-react-components';
import { ErrorPage } from '@/components/ErrorPage.component';
import { useVrackService } from '@/data';
import { formatDateString } from '@/utils/date';
import { VrackId } from '@/components/vrack-id/VrackId.component';
import { DisplayName } from '@/components/display-name/DisplayName.component';
import { ProductStatusChip } from '@/components/ProductStatusChip.component';

export default function OverviewTab() {
  const { t, i18n } = useTranslation('vrack-services/dashboard');
  const { data: vrackServices, error, isLoading } = useVrackService();

  return error ? (
    <ErrorPage error={error} />
  ) : (
    <>
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-6">
        <div className="p-3">
          {isLoading ? (
            <OsdsTile className="w-full h-full justify-center" inline rounded>
              <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
            </OsdsTile>
          ) : (
            <DashboardTile
              title={t('tileTitle')}
              items={[
                {
                  id: 'displayName',
                  label: t('displayName'),
                  value: <DisplayName {...vrackServices} />,
                },
                {
                  id: 'productStatus',
                  label: t('productStatus'),
                  value: (
                    <ProductStatusChip
                      productStatus={vrackServices?.currentState.productStatus}
                    />
                  ),
                },
                {
                  id: 'region',
                  label: t('region'),
                  value: (
                    <>
                      <div>
                        <Region
                          mode="region"
                          name={vrackServices?.currentState?.region?.toLowerCase()}
                        ></Region>
                      </div>
                      <div>{vrackServices?.currentState?.region}</div>
                    </>
                  ),
                },
                {
                  id: 'vrackId',
                  label: t('vrackId'),
                  value: <VrackId {...vrackServices} />,
                },
                {
                  id: 'createdAt',
                  label: t('createdAt'),
                  value: formatDateString(
                    vrackServices?.createdAt,
                    ovhLocaleToI18next(i18n.language),
                  ),
                },
              ]}
            />
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
}
