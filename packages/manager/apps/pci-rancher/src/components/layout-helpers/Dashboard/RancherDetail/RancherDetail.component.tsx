import { Notifications } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { MutationStatus } from '@tanstack/react-query';
import { RancherService, RancherVersion } from '@/types/api.type';
import UpdateVersionBanner from '@/components/UpdateRancherVersionBanner/UpdateVersionBanner.component';
import { useRancherDetail } from './useRancherDetail';
import ConsumptionTile from './components/Consumption.component';
import SecurityAndAccessTile from './components/SecurityAccess.component';
import GeneralInformationTile from './components/GeneralInformation.component';
import UpgradePlanTile from './components/UpgradePlan.component';

export interface RancherDetailProps {
  rancher: RancherService;
  editNameResponseType: ODS_MESSAGE_TYPE | null;
  updateSoftwareResponseType: MutationStatus | null;
  updateOfferResponseType: MutationStatus | null;
  hasErrorAccessDetail: boolean;
  updateOfferErrorMessage?: string;
  versions: RancherVersion[];
}

const RancherDetail = ({
  rancher,
  editNameResponseType,
  updateSoftwareResponseType,
  updateOfferResponseType,
  hasErrorAccessDetail,
  updateOfferErrorMessage,
  versions,
}: RancherDetailProps) => {
  const {
    name,
    version,
    url,
    computedStatus,
    isReadyStatus,
    shouldDisplayUpdateSoftware,
    isEligibleForUpgrade,
    iamEnabled,
    hrefEdit,
    hrefUpdateSoftware,
    hrefGenerateAccess,
    hrefUpdateOffer,
    isPendingUpdate,
    displayDate,
    onAccessRancherUrl,
    t,
  } = useRancherDetail({
    rancher,
    editNameResponseType,
    updateSoftwareResponseType,
    updateOfferResponseType,
    updateOfferErrorMessage,
    versions,
  });

  return (
    <div className="max-w-4xl">
      <Notifications />

      {editNameResponseType && (
        <OsdsMessage type={editNameResponseType} className="my-4 p-3">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            className="inline-block"
          >
            {editNameResponseType === ODS_MESSAGE_TYPE.success &&
              t('editNameRancherSuccess')}
          </OsdsText>
        </OsdsMessage>
      )}

      <UpdateVersionBanner
        rancher={rancher}
        isPendingUpdateOperation={isPendingUpdate}
        versions={versions}
      />

      {hasErrorAccessDetail && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error} className="my-4 p-3">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            className="inline-block"
          >
            {t('editNameRancherError')}
          </OsdsText>
        </OsdsMessage>
      )}

      <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-6">
        <GeneralInformationTile
          t={t}
          name={name}
          rancherId={rancher.id}
          version={version}
          computedStatus={computedStatus}
          isReadyStatus={isReadyStatus}
          shouldDisplayUpdateSoftware={shouldDisplayUpdateSoftware}
          hrefEdit={hrefEdit}
          hrefUpdateSoftware={hrefUpdateSoftware}
        />

        <SecurityAndAccessTile
          t={t}
          url={url}
          isReadyStatus={isReadyStatus}
          iamEnabled={iamEnabled}
          egressCidrBlocks={
            rancher.currentState.networking?.egressCidrBlocks || []
          }
          hrefGenerateAccess={hrefGenerateAccess}
          onAccessRancherUrl={onAccessRancherUrl}
        />

        <ConsumptionTile
          t={t}
          plan={rancher.currentState.plan}
          orchestratedVcpus={rancher.currentState.usage?.orchestratedVcpus}
          usageDateTime={rancher.currentState.usage?.datetime}
          isReadyStatus={isReadyStatus}
          hrefUpdateOffer={hrefUpdateOffer}
          displayDate={displayDate}
        />

        {isEligibleForUpgrade && (
          <UpgradePlanTile
            t={t}
            isReadyStatus={isReadyStatus}
            hrefUpdateOffer={hrefUpdateOffer}
          />
        )}
      </div>
    </div>
  );
};

export default RancherDetail;
