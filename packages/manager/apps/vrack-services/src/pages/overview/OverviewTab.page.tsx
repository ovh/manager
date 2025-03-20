import React from 'react';
import { OdsSpinner, OdsCard } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_SPINNER_SIZE, ODS_CARD_COLOR } from '@ovhcloud/ods-components';
import { Outlet } from 'react-router-dom';
import { ovhLocaleToI18next } from '@ovh-ux/manager-react-shell-client';
import {
  DashboardTile,
  Region,
  ErrorBanner,
} from '@ovh-ux/manager-react-components';
import { useVrackService } from '@ovh-ux/manager-network-common';
import { formatDateString } from '@/utils/date';
import { VrackId } from '@/components/vrack-id/VrackId.component';
import { DisplayName } from '@/components/display-name/DisplayName.component';
import { ProductStatusChip } from '@/components/ProductStatusChip.component';

export default function OverviewTab() {
  const { t, i18n } = useTranslation('vrack-services/dashboard');
  const { data: vrackServices, error, isLoading } = useVrackService();

  return error ? (
    <ErrorBanner error={error} />
  ) : (
    <>
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-6">
        <div className="p-3">
          {isLoading ? (
            <OdsCard
              className="w-full h-full justify-center"
              color={ODS_CARD_COLOR.neutral}
            >
              <OdsSpinner size={ODS_SPINNER_SIZE.md} />
            </OdsCard>
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
