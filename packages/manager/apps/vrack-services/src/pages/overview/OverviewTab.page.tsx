import React from 'react';
import { OdsSpinner, OdsCard, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_SPINNER_SIZE,
  ODS_CARD_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { Outlet } from 'react-router-dom';
import {
  DashboardTile,
  Region,
  ErrorBanner,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import { useVrackService } from '@ovh-ux/manager-network-common';
import { VrackId } from '@/components/vrack-id/VrackId.component';
import { DisplayName } from '@/components/display-name/DisplayName.component';
import { ProductStatusChip } from '@/components/ProductStatusChip.component';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export default function OverviewTab() {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.dashboard);
  const { data: vrackServices, error, isLoading } = useVrackService();
  const formatDate = useFormatDate();

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
                    <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                      <div>
                        <Region
                          mode="region"
                          name={vrackServices?.currentState?.region?.toLowerCase()}
                        />
                      </div>
                      <div>{vrackServices?.currentState?.region}</div>
                    </OdsText>
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
                  value: (
                    <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                      {formatDate({
                        date: vrackServices?.createdAt,
                      })}
                    </OdsText>
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
