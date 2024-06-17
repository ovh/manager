import { format } from 'date-fns';

import { CommonTitle } from '@ovhcloud/manager-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsClipboard,
  OsdsDivider,
  OsdsIcon,
  OsdsLink,
  OsdsMessage,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useHref } from 'react-router-dom';
import { RancherService } from '@/api/api.type';
import { TileBlock } from '@/components/TileBlock/TileBlock';
import { useTrackingAction } from '@/hooks/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';

interface RancherDetailProps {
  rancher: RancherService;
  editNameResponseType: ODS_MESSAGE_TYPE | null;
  hasErrorAccessDetail: boolean;
}
const RancherDetail = ({
  rancher,
  editNameResponseType,
  hasErrorAccessDetail,
}: RancherDetailProps) => {
  const { t } = useTranslation('pci-rancher/dashboard');
  const { t: tListing } = useTranslation('pci-rancher/listing');
  const trackAction = useTrackingAction();
  const { name, version, plan, url } = rancher.currentState;
  const dateUsage = rancher.currentState.usage
    ? new Date(rancher.currentState.usage?.datetime)
    : null;

  const onAccessRancherUrl = () =>
    trackAction(TrackingPageView.DetailRancher, TrackingEvent.accessUi);

  const hrefEdit = useHref('./edit');
  const hrefGenerateAccess = useHref('./generate-access');

  return (
    <div>
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
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-6 max-w-3xl">
        <div className="p-3">
          <OsdsTile className="w-full h-full flex-col" inline rounded>
            <div className="flex flex-col w-full">
              <CommonTitle>{t('general_informations')}</CommonTitle>
              <OsdsDivider separator />
              <TileBlock label={t('description')}>
                <OsdsLink
                  className="flex flex-row"
                  href={hrefEdit}
                  aria-label="edit-link"
                >
                  <OsdsText
                    className="overflow-hidden text-ellipsis max-w-[300px]"
                    level={ODS_TEXT_LEVEL.heading}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_TEXT_SIZE._200}
                  >
                    {name}
                  </OsdsText>
                  <span slot="end">
                    <OsdsIcon
                      aria-label="edit"
                      className="ml-4 cursor-pointer"
                      name={ODS_ICON_NAME.PEN}
                      size={ODS_ICON_SIZE.xxs}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    />
                  </span>
                </OsdsLink>
              </TileBlock>

              <TileBlock label={t('rancher_version')}>
                <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                  {version}
                </OsdsText>
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
                <OsdsLink
                  color={ODS_THEME_COLOR_INTENT.primary}
                  className="mt-3 flex flex-row items-center"
                  href={hrefGenerateAccess}
                  onClick={() => {
                    trackAction(
                      TrackingPageView.DetailRancher,
                      TrackingEvent.generateAccess,
                    );
                  }}
                >
                  <OsdsText
                    level={ODS_TEXT_LEVEL.heading}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_TEXT_SIZE._200}
                  >
                    {t('generate_access')}
                  </OsdsText>
                  <span slot="end">
                    <OsdsIcon
                      className="ml-4 cursor-pointer"
                      name={ODS_ICON_NAME.ARROW_RIGHT}
                      size={ODS_ICON_SIZE.xxs}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    />
                  </span>
                </OsdsLink>
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
                  {tListing(plan)}
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
