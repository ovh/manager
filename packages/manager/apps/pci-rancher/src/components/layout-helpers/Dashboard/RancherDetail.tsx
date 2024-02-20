import { format } from 'date-fns';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
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
  OsdsText,
  OsdsTile,
  OsdsMessage,
} from '@ovhcloud/ods-components/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditNameModal from '../../Modal/EditNameModal';

import { RancherService } from '@/api/api.type';
import { TileBlock } from '../../TileBlock/TileBlock';
import GenerateAccessModal from '../../Modal/GenerateAccesModal';
import { AccessDetail } from '../../../hooks/useGenerateAccessDetail';
import { useTrackingAction } from '@/hooks/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';

interface RancherDetailProps {
  rancher: RancherService;
  editNameResponseType: ODS_MESSAGE_TYPE | null;
  editRancherName: (rancher: RancherService) => void;
  generateAccesDetail: () => void;
  accessDetail: AccessDetail;
  hasErrorAccessDetail: boolean;
}
const RancherDetail = ({
  rancher,
  editNameResponseType,
  editRancherName,
  generateAccesDetail,
  accessDetail,
  hasErrorAccessDetail,
}: RancherDetailProps) => {
  const { t } = useTranslation('pci-rancher/dashboard');
  const { t: tListing } = useTranslation('pci-rancher/listing');
  const trackAction = useTrackingAction();
  const [showEditModal, toggleEditModal] = useState(false);
  const [showGenerateAccesModal, toggleGenerateAccessModal] = useState(false);

  const { name, version, plan, url } = rancher.currentState;
  const dateUsage = rancher.currentState.usage
    ? new Date(rancher.currentState.usage?.datetime)
    : null;
  const vCpus = rancher.currentState.usage?.orchestratedVcpus;

  useEffect(() => {
    if (hasErrorAccessDetail) {
      toggleGenerateAccessModal(false);
    }
  }, [hasErrorAccessDetail]);

  const onAccessRancherUrl = () =>
    trackAction(TrackingPageView.DetailRancher, TrackingEvent.accessUi);

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
        {showEditModal && (
          <EditNameModal
            rancher={rancher}
            toggleModal={toggleEditModal}
            onEditRancher={(r: RancherService) => editRancherName(r)}
          />
        )}
        {showGenerateAccesModal && (
          <GenerateAccessModal
            rancher={rancher}
            toggleModal={toggleGenerateAccessModal}
            onGenerateAccess={() => generateAccesDetail()}
            accessDetail={accessDetail}
          />
        )}

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
                <div className="flex">
                  <OsdsText
                    level={ODS_TEXT_LEVEL.heading}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_TEXT_SIZE._200}
                  >
                    {name}
                  </OsdsText>
                  <OsdsIcon
                    aria-label="edit"
                    className="ml-4 cursor-pointer"
                    onClick={() => toggleEditModal(true)}
                    name={ODS_ICON_NAME.PEN}
                    size={ODS_ICON_SIZE.xxs}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                </div>
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
                <OsdsLink
                  color={ODS_THEME_COLOR_INTENT.primary}
                  className="mt-3 flex items-center"
                  onClick={() => {
                    trackAction(
                      TrackingPageView.DetailRancher,
                      TrackingEvent.generateAccess,
                    );
                    toggleGenerateAccessModal(true);
                  }}
                >
                  <span>{t('generate_access')}</span>
                  <OsdsIcon
                    className="ml-4 cursor-pointer"
                    name={ODS_ICON_NAME.ARROW_RIGHT}
                    size={ODS_ICON_SIZE.xxs}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                </OsdsLink>
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
                  {tListing(plan)}
                </OsdsText>
              </TileBlock>
              {!!vCpus && (
                <TileBlock label={t('count_cpu_orchestrated')}>
                  <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                    {rancher.currentState.usage?.orchestratedVcpus}
                  </OsdsText>
                  {dateUsage && (
                    <div className="mt-3">
                      <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                        {t('last_update_date', {
                          date: format(dateUsage, 'yyyy_MM_dd'),
                          hour: format(dateUsage, 'HH:mm'),
                        })}
                      </OsdsText>
                    </div>
                  )}
                </TileBlock>
              )}
            </div>
          </OsdsTile>
        </div>
      </div>
    </div>
  );
};

export default RancherDetail;
