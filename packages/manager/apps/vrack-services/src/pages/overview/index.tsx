import React from 'react';
import {
  OsdsSpinner,
  OsdsMessage,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_SPINNER_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Outlet, useParams } from 'react-router-dom';
import { ovhLocaleToI18next } from '@ovh-ux/manager-react-shell-client';
import { DashboardTile } from '@ovhcloud/manager-components';
import { ErrorPage } from '@/components/Error';
import { useUpdateVrackServices, useVrackService } from '@/utils/vs-utils';
import { formatDateString } from '@/utils/date';
import { VrackId } from '@/components/vrack-id.component';
import { DisplayName } from '@/components/display-name.component';
import { ProductStatusChip } from '@/components/product-status.components';

export default function OverviewTab() {
  const { t, i18n } = useTranslation('vrack-services/dashboard');
  const { t: tListing } = useTranslation('vrack-services/listing');
  const { id } = useParams();
  const { data: vrackServices, error, isLoading } = useVrackService();
  const { isErrorVisible, hideError, updateError } = useUpdateVrackServices({
    key: id,
  });

  return error ? (
    <ErrorPage error={error} />
  ) : (
    <>
      {isErrorVisible && (
        <OsdsMessage
          type={ODS_MESSAGE_TYPE.error}
          removable
          onOdsRemoveClick={hideError}
        >
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tListing('updateError', {
              error: updateError?.response.data.message,
            })}
          </OsdsText>
        </OsdsMessage>
      )}
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
                  value: t(vrackServices?.currentState?.region),
                },
                {
                  id: 'vrackId',
                  label: t('vrackId'),
                  value: <VrackId hasMenu {...vrackServices} />,
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
