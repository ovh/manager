import { format } from 'date-fns';

import {
  CommonTitle,
  Notifications,
  TileBlock,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_MESSAGE_TYPE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsClipboard,
  OsdsDivider,
  OsdsMessage,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import React, { useEffect, useState } from 'react';
import { useHref } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { MutationStatus } from '@tanstack/react-query';
import {
  RancherPlanName,
  RancherService,
  RancherVersion,
  ResourceStatus,
} from '@/types/api.type';
import LinkIcon from '@/components/LinkIcon/LinkIcon.component';
import StatusChip from '@/components/StatusChip/StatusChip.component';
import UpdateVersionBanner from '@/components/UpdateRancherVersionBanner/UpdateVersionBanner.component';
import { useTrackingAction } from '@/hooks/useTrackingPage/useTrackingPage';
import { getLatestVersionAvailable } from '@/utils/rancher';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';

export interface RancherDetailProps {
  rancher: RancherService;
  editNameResponseType: ODS_MESSAGE_TYPE | null;
  updateSoftwareResponseType: MutationStatus;
  updateOfferResponseType: MutationStatus;
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
  const { t } = useTranslation(['dashboard', 'updateSoftware', 'listing']);
  const trackAction = useTrackingAction();
  const hrefEdit = useHref('./edit');
  const hrefUpdateSoftware = useHref('./update-software');
  const hrefGenerateAccess = useHref('./generate-access');
  const hrefUpdateOffer = useHref('./update-offer');
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isPendingOffer, setIsPendingOffer] = useState(false);
  const [hasTaskPending, setHasTaskPending] = useState(false);
  const { resourceStatus, currentState, currentTasks } = rancher;
  const { addError, addInfo, clearNotifications } = useNotifications();

  useEffect(() => {
    if (updateOfferErrorMessage) {
      addError(
        t('updateOfferError', { errorMessage: updateOfferErrorMessage }),
      );
    }
  }, [updateOfferErrorMessage]);

  useEffect(() => {
    if (updateSoftwareResponseType === 'pending') {
      setIsPendingUpdate(true);
    }
    if (updateOfferResponseType === 'pending') {
      setIsPendingOffer(true);
    }
  }, [updateSoftwareResponseType, updateOfferResponseType]);

  useEffect(() => {
    if (currentTasks.length) {
      addInfo(t('updateOfferPending'));
      setHasTaskPending(true);
    }
  }, [currentTasks]);

  useEffect(() => {
    if (hasTaskPending && currentTasks.length === 0) {
      setIsPendingUpdate(false);
      setHasTaskPending(false);
      setIsPendingOffer(false);
    }
    if (currentTasks.length === 0) {
      clearNotifications();
    }
  }, [currentTasks]);

  const computedStatus =
    isPendingUpdate || isPendingOffer
      ? ResourceStatus.UPDATING
      : resourceStatus;

  const isReadyStatus = computedStatus === ResourceStatus.READY;

  const { name, version, plan, url } = currentState;
  const dateUsage = currentState.usage
    ? new Date(currentState.usage?.datetime)
    : null;

  const onAccessRancherUrl = () =>
    trackAction(TrackingPageView.DetailRancher, TrackingEvent.accessUi);

  const shouldDisplayUpdateSoftware =
    getLatestVersionAvailable(rancher, versions) &&
    isReadyStatus &&
    !updateSoftwareResponseType;

  const isEligibleForUpgrade = plan === RancherPlanName.OVHCLOUD_EDITION;

  return (
    <div className="max-w-4xl">
      <Notifications></Notifications>
      {editNameResponseType && (
        <OsdsMessage type={editNameResponseType} className="my-4 p-3">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            className="inline-block"
          >
            {editNameResponseType === ODS_MESSAGE_TYPE.success
              ? t('editNameRancherSuccess')
              : t('editNameRancherError')}
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
        <div className="p-3">
          <OsdsTile className="w-full h-full flex-col" inline rounded>
            <div className="flex flex-col w-full">
              <CommonTitle>{t('general_informations')}</CommonTitle>
              <OsdsDivider separator />
              <TileBlock label={t('description')}>
                <LinkIcon
                  iconName={ODS_ICON_NAME.PEN}
                  href={hrefEdit}
                  text={name}
                  isDisabled={!isReadyStatus}
                />
              </TileBlock>
              <TileBlock label={'ID'}>
                <OsdsClipboard aria-label="clipboard-id" value={rancher.id}>
                  <span slot="success-message">{t('copy')}</span>
                  <span slot="error-message">{t('error')}</span>
                </OsdsClipboard>
              </TileBlock>
              <TileBlock label={t('rancher_version')}>
                <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                  {version}
                </OsdsText>
                {shouldDisplayUpdateSoftware && (
                  <LinkIcon
                    iconName={ODS_ICON_NAME.ARROW_RIGHT}
                    href={hrefUpdateSoftware}
                    text={t('updateSoftwareAvailableUpdate')}
                  />
                )}
              </TileBlock>
              <TileBlock label={t('status')}>
                <div>
                  <StatusChip label={computedStatus} />
                </div>
              </TileBlock>
            </div>
          </OsdsTile>
        </div>
        <div className="p-3">
          <OsdsTile className="w-full h-full flex-col" inline rounded>
            <div className="flex flex-col w-full">
              <CommonTitle>{t('security_and_access')}</CommonTitle>
              <OsdsDivider separator />
              <TileBlock label={t('rancher_ui_access')}>
                <OsdsClipboard aria-label="clipboard" value={url}>
                  <span slot="success-message">{t('copy')}</span>
                  <span slot="error-message">{t('error')}</span>
                </OsdsClipboard>
                <OsdsButton
                  color={ODS_THEME_COLOR_INTENT.primary}
                  size={ODS_BUTTON_SIZE.sm}
                  variant={ODS_BUTTON_VARIANT.stroked}
                  target={OdsHTMLAnchorElementTarget._blank}
                  className="my-5"
                  inline
                  onClick={onAccessRancherUrl}
                  href={url}
                >
                  {t('rancher_button_acces')}
                </OsdsButton>
                <LinkIcon
                  iconName={ODS_ICON_NAME.ARROW_RIGHT}
                  href={hrefGenerateAccess}
                  text={t('generate_access')}
                  isDisabled={!isReadyStatus}
                />
              </TileBlock>
            </div>
          </OsdsTile>
        </div>
        <div className="p-3">
          <OsdsTile className="w-full h-full flex-col" inline rounded>
            <div className="flex flex-col w-full">
              <CommonTitle>{t('consumption')}</CommonTitle>
              <OsdsDivider separator />
              <TileBlock label={t('service_level')}>
                <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                  {t(plan)}
                </OsdsText>
                <LinkIcon
                  iconName={ODS_ICON_NAME.ARROW_RIGHT}
                  href={hrefUpdateOffer}
                  text={t('updateOfferModaleTitle')}
                  isDisabled={!isReadyStatus}
                />
              </TileBlock>
              <TileBlock label={t('count_cpu_orchestrated')}>
                <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                  {rancher.currentState.usage?.orchestratedVcpus || '-'}
                </OsdsText>
                {dateUsage && (
                  <div className="mt-3">
                    <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                      {t('last_update_date', {
                        date: format(dateUsage, 'yyyy_MM_dd'),
                        hour: format(dateUsage, 'HH:mm:ss'),
                      })}
                    </OsdsText>
                  </div>
                )}
              </TileBlock>
            </div>
          </OsdsTile>
        </div>
        {isEligibleForUpgrade && (
          <div className="p-3">
            <OsdsTile
              className="w-full flex-col bg-[--ods-color-blue-100] border-none"
              inline
              rounded
            >
              <div className="flex flex-col w-full">
                <CommonTitle>{t('upgradePlanTitle')}</CommonTitle>
                <OsdsText color={ODS_THEME_COLOR_INTENT.text} className="my-5">
                  {t('upgradePlanDescription')}
                </OsdsText>
                <LinkIcon
                  iconName={ODS_ICON_NAME.ARROW_RIGHT}
                  href={hrefUpdateOffer}
                  text={t('upgradePlanButton')}
                  isDisabled={!isReadyStatus}
                />
              </div>
            </OsdsTile>
          </div>
        )}
      </div>
    </div>
  );
};

export default RancherDetail;
