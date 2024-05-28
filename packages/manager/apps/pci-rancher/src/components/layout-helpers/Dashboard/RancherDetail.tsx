import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsClipboard,
  OsdsDivider,
  OsdsMessage,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useHref } from 'react-router-dom';

import { MutationStatus } from '@tanstack/react-query';
import { RancherService, RancherVersion, ResourceStatus } from '@/api/api.type';
import LinkIcon from '@/components/LinkIcon/LinkIcon';
import StatusChip from '@/components/StatusChip/StatusChip';
import { TileBlock } from '@/components/TileBlock/TileBlock';
import UpdateVersionBanner from '@/components/UpdateRancherVersionBanner/UpdateVersionBanner';
import { useTrackingAction } from '@/hooks/useTrackingPage';
import { getLatestVersionAvailable } from '@/utils/rancher';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';
import { useTranslate } from '@/utils/translation';

export interface RancherDetailProps {
  rancher: RancherService;
  editNameResponseType: ODS_MESSAGE_TYPE | null;
  updateSoftwareResponseType: MutationStatus;
  hasErrorAccessDetail: boolean;
  versions: RancherVersion[];
}

const RancherDetail = ({
  rancher,
  editNameResponseType,
  updateSoftwareResponseType,
  hasErrorAccessDetail,
  versions,
}: RancherDetailProps) => {
  const { t } = useTranslate([
    'pci-rancher/dashboard',
    'pci-rancher/updateSoftware',
    'pci-rancher/listing',
  ]);
  const trackAction = useTrackingAction();
  const hrefEdit = useHref('./edit');
  const hrefUpdateSoftware = useHref('./update-software');
  const hrefGenerateAccess = useHref('./generate-access');
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [hasTaskPending, setHasTaskPending] = useState(false);
  const { resourceStatus, currentState, currentTasks } = rancher;

  useEffect(() => {
    if (updateSoftwareResponseType === 'pending') {
      setIsPendingUpdate(true);
    }
  }, [updateSoftwareResponseType]);

  useEffect(() => {
    if (currentTasks.length) {
      setHasTaskPending(true);
    }
  }, [currentTasks]);

  useEffect(() => {
    if (hasTaskPending && currentTasks.length === 0) {
      setIsPendingUpdate(false);
      setHasTaskPending(false);
    }
  }, [currentTasks]);

  const computedStatus = isPendingUpdate
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

  return (
    <div className="max-w-4xl">
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
              <OsdsText
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('general_informations')}
              </OsdsText>
              <OsdsDivider separator />
              <TileBlock label={t('description')}>
                <LinkIcon
                  iconName={ODS_ICON_NAME.PEN}
                  href={hrefEdit}
                  text={name}
                  isDisabled={!isReadyStatus}
                />
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
              <OsdsText
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('security_and_access')}
              </OsdsText>
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
              <OsdsText
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('consumption')}
              </OsdsText>
              <OsdsDivider separator />
              <TileBlock label={t('service_level')}>
                <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                  {t(plan)}
                </OsdsText>
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
      </div>
    </div>
  );
};

export default RancherDetail;
