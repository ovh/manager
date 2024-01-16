import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsClipboard,
  OsdsDivider,
  OsdsIcon,
  OsdsText,
  OsdsTile,
  OsdsLink,
} from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { format } from 'date-fns';
import { RancherService } from '@/api/api.type';
import { TileBlock } from '@/components/TileBlock/TileBlock';

interface RancherDetailProps {
  rancher: RancherService;
}
const RancherDetail = ({ rancher }: RancherDetailProps) => {
  const { t } = useTranslation('pci-rancher/dashboard');
  const dateUsage = new Date(rancher.currentState.usage.datetime);
  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-6 max-w-3xl">
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
                size={ODS_TEXT_SIZE._300}
              >
                {rancher.currentState.name}
              </OsdsText>
              <OsdsIcon
                className="ml-4 cursor-pointer"
                name={ODS_ICON_NAME.PEN}
                size={ODS_ICON_SIZE.xxs}
                color={ODS_THEME_COLOR_INTENT.primary}
              />
            </TileBlock>
            <TileBlock label={t('rancher_version')}>
              {rancher.currentState.version}
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
              <OsdsClipboard value={rancher.currentState.url} />
              <OsdsButton
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_BUTTON_SIZE.sm}
                variant={ODS_BUTTON_VARIANT.stroked}
                className="my-5"
                inline
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
              {rancher.currentState.plan}
            </TileBlock>
            <TileBlock label={t('count_cpu_orchestrated')}>
              <div>{rancher.currentState.usage.orchestratedVcpus}</div>
              <div className="mt-3">
                {t('last_update_date', {
                  date: format(dateUsage, 'yyyy_MM_dd'),
                  hour: format(dateUsage, 'HH:mm'),
                })}
              </div>
            </TileBlock>
          </div>
        </OsdsTile>
      </div>
    </div>
  );
};

export default RancherDetail;
