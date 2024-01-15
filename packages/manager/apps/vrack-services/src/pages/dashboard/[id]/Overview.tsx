/* eslint-disable import/prefer-default-export */
import React from 'react';
import {
  useEnvironment,
  useShell,
} from '@ovh-ux/manager-react-core-application';
import {
  OsdsSpinner,
  OsdsMessage,
  OsdsDivider,
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
import { ErrorPage } from '@/components/Error';
import { useUpdateVrackServices, useVrackService } from '@/utils/vs-utils';
import { formatDateString } from '@/utils/date';
import {
  ProductStatusCell,
  VrackIdCell,
  DisplayNameCell,
} from '@/components/VrackServicesDataGridCells';
import { TileBlock } from '@/components/TileBlock';
import { VrackAssociationModal } from '@/components/VrackAssociationModal';

export const OverviewTab: React.FC = () => {
  const { t, i18n } = useTranslation('vrack-services/dashboard');
  const [associateModalVisible, setAssociateModalVisible] = React.useState<
    string | undefined
  >(undefined);
  const environment = useEnvironment();
  const urls = environment.getApplicationURLs();
  const { data: vrackServices, error, isLoading } = useVrackService();
  const {
    updateVS,
    isErrorVisible,
    hideError,
    isPending,
  } = useUpdateVrackServices({ key: 'overview' });
  const shell = useShell();

  if (error) {
    return <ErrorPage error={error} />;
  }

  React.useEffect(() => {
    shell.tracking.trackPage({
      name: 'vrack-services::dashboard',
      level2: '',
    });
  }, []);

  return (
    <>
      {isErrorVisible && (
        <OsdsMessage
          type={ODS_MESSAGE_TYPE.error}
          removable
          onOdsRemoveClick={hideError}
        >
          {t('updateError')}
        </OsdsMessage>
      )}
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-6">
        <div className="p-3">
          {isLoading ? (
            <OsdsTile className="w-full h-full justify-center" inline rounded>
              <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
            </OsdsTile>
          ) : (
            <OsdsTile className="w-full h-full flex-col" inline rounded>
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
                  <DisplayNameCell
                    updateVS={updateVS}
                    cellData={vrackServices?.displayName}
                    rowData={vrackServices}
                  />
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
                  <VrackIdCell
                    label={t('associateVrackModal')}
                    openAssociationModal={() =>
                      setAssociateModalVisible(vrackServices?.id)
                    }
                    cellData={vrackServices?.currentState.vrackId}
                    isLoading={isPending}
                    rowData={vrackServices}
                    href={`${urls.dedicated}vrack/${vrackServices?.currentState.vrackId}`}
                  />
                </TileBlock>
                <TileBlock label={t('createdAt')}>
                  {formatDateString(vrackServices?.createdAt, i18n.language)}
                </TileBlock>
              </div>
            </OsdsTile>
          )}
        </div>
      </div>
      <VrackAssociationModal
        vrackServicesId={associateModalVisible}
        closeModal={() => setAssociateModalVisible(undefined)}
      />
    </>
  );
};
