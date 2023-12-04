/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useEnvironment } from '@ovh-ux/manager-react-core-application';
import { OsdsTile } from '@ovhcloud/ods-components/tile/react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { OsdsDivider } from '@ovhcloud/ods-components/divider/react';
import { OsdsLink } from '@ovhcloud/ods-components/link/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ApiError, ErrorPage } from '@/components/Error';
import { useVrackService } from './utils';
import { formatDateString } from '@/utils/date';
import { ProductStatusCell } from '@/pages/index/components/VrackServicesDataGridCells';

type TileBlockProps = {
  label: string;
};

const TileBlock: React.FC<React.PropsWithChildren<TileBlockProps>> = ({
  label,
  children,
}) => (
  <div className="flex flex-col mb-3">
    <OsdsText
      className="mb-2"
      size={ODS_TEXT_SIZE._200}
      level={ODS_TEXT_LEVEL.heading}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      {label}
    </OsdsText>
    <OsdsText
      className="mb-2"
      size={ODS_TEXT_SIZE._400}
      level={ODS_TEXT_LEVEL.body}
      color={ODS_THEME_COLOR_INTENT.default}
    >
      {children}
    </OsdsText>
    <OsdsDivider separator />
  </div>
);

export const OverviewTab: React.FC = () => {
  const { t, i18n } = useTranslation('vrack-services/dashboard');
  const environment = useEnvironment();
  const urls = environment.getApplicationURLs();
  const { data: vrackServices, error, isLoading } = useVrackService();

  if (error) {
    return <ErrorPage error={error as ApiError} />;
  }

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-6">
      <div className="p-3">
        <OsdsTile
          className="w-full h-full flex-col"
          loading={isLoading || undefined}
          inline
          rounded
        >
          <div className="flex flex-col w-full">
            <OsdsText
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('tileTitle')}
            </OsdsText>
            <OsdsDivider separator />
            <TileBlock label={t('displayName')}>
              {vrackServices?.displayName || vrackServices?.id}
            </TileBlock>
            <TileBlock label={t('productStatus')}>
              <ProductStatusCell
                cellData={vrackServices?.currentState.productStatus}
                rowData={vrackServices}
                t={t}
              />
            </TileBlock>
            <TileBlock label={t('zone')}>
              {t(vrackServices?.currentState.zone)}
            </TileBlock>
            <TileBlock label={t('vrackId')}>
              {vrackServices?.currentState.vrackId ? (
                <OsdsLink
                  href={`${urls.dedicated}vrack/${vrackServices.currentState.vrackId}`}
                >
                  {vrackServices?.currentState.vrackId}
                </OsdsLink>
              ) : (
                '-'
              )}
            </TileBlock>
            <TileBlock label={t('createdAt')}>
              {formatDateString(vrackServices?.createdAt, i18n.language)}
            </TileBlock>
          </div>
        </OsdsTile>
      </div>
    </div>
  );
};
