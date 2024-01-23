import { format } from 'date-fns';

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
  OsdsText,
  OsdsTile,
  OsdsMessage,
} from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditNameModal from '../../Modal/EditNameModal';

import { RancherService } from '../../../api/api.type';
import { TileBlock } from '../../TileBlock/TileBlock';

interface RancherDetailProps {
  rancher: RancherService;
  editNameResponse: ODS_MESSAGE_TYPE | null;
  editRancherName: (rancher: RancherService) => void;
}
const RancherDetail = ({
  rancher,
  editNameResponse,
  editRancherName,
}: RancherDetailProps) => {
  const { t } = useTranslation('pci-rancher/dashboard');
  const [showEditModal, toggleEditModal] = useState(false);

  const dateUsage = rancher.currentState.usage
    ? new Date(rancher.currentState.usage?.datetime)
    : null;
  const vCpus = rancher.currentState.usage?.orchestratedVcpus;

  return (
    <div>
      {editNameResponse && (
        <OsdsMessage type={editNameResponse} className="my-4 p-3">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            className="inline-block"
          >
            {editNameResponse === ODS_MESSAGE_TYPE.info
              ? t('editNameRancherSuccess')
              : t('editNameRancherError')}
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
                <OsdsText
                  level={ODS_TEXT_LEVEL.heading}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  size={ODS_TEXT_SIZE._200}
                >
                  {rancher.currentState.name}
                </OsdsText>
                <OsdsIcon
                  aria-label="edit"
                  className="ml-4 cursor-pointer"
                  onClick={() => toggleEditModal(true)}
                  name={ODS_ICON_NAME.PEN}
                  size={ODS_ICON_SIZE.xxs}
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
              </TileBlock>
              <TileBlock label={t('rancher_version')}>
                <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                  {rancher.currentState.version}
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
                <OsdsClipboard
                  aria-label="clipboard"
                  value={rancher.currentState.url}
                />
                <OsdsButton
                  color={ODS_THEME_COLOR_INTENT.primary}
                  size={ODS_BUTTON_SIZE.sm}
                  variant={ODS_BUTTON_VARIANT.stroked}
                  className="my-5"
                  inline
                  href={rancher.currentState.url}
                >
                  {t('rancher_button_acces')}
                </OsdsButton>
                <div className="mt-3 flex items-center">
                  <OsdsLink color={ODS_THEME_COLOR_INTENT.primary}>
                    {t('generate_access')}
                  </OsdsLink>
                  <OsdsIcon
                    className="ml-4 cursor-pointer"
                    name={ODS_ICON_NAME.ARROW_RIGHT}
                    size={ODS_ICON_SIZE.xxs}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
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
                {t('consumption')}
              </OsdsText>
              <OsdsDivider separator />
              <TileBlock label={t('service_level')}>
                <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                  {rancher.currentState.plan}
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