import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useMe } from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsLink,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DATA_PLATFORM_GUIDE, LOG_TRACKING_HITS } from '../constants';
import { useLogs, useAllStreamIds } from '@/api/hooks/useDbaasLogs';

export function LogHowTo() {
  const { t } = useTranslation('logs');
  const ovhSubsidiary = useMe()?.me?.ovhSubsidiary;
  const { navigation } = useContext(ShellContext).shell;
  const { tracking } = useContext(ShellContext).shell;
  const navigate = useNavigate();
  const { data: dbaasLogs } = useLogs();
  const { data: streams } = useAllStreamIds();
  const guideLink =
    DATA_PLATFORM_GUIDE[ovhSubsidiary] || DATA_PLATFORM_GUIDE.DEFAULT;
  const hasAccount = dbaasLogs?.length > 0;
  const hasStream = streams?.length > 0;

  const onCreate = () => {
    if (!hasAccount) {
      tracking.trackClick({
        name: LOG_TRACKING_HITS.CREATE_ACCOUNT,
      });
      navigation
        .getURL('dedicated', `#/dbaas/logs/order`, {})
        .then((url: string) => {
          window.location.href = url;
        });
    } else if (!hasStream) {
      tracking.trackClick({
        name: LOG_TRACKING_HITS.CREATE_DATA_STREAM,
      });
      navigation.getURL('dedicated', `#/dbaas/logs`, {}).then((url: string) => {
        window.location.href = url;
      });
    } else {
      tracking.trackClick({
        name: LOG_TRACKING_HITS.TRANSFER,
      });
      navigate('./streams');
    }
  };

  return (
    <>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.primary}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        size={ODS_TEXT_SIZE._300}
      >
        {t('log_tile_section_title')}
      </OsdsText>
      <OsdsTile className="mt-4" color={ODS_THEME_COLOR_INTENT.primary}>
        <div className="flex flex-col">
          <OsdsText
            className="block"
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_TEXT_SIZE._400}
          >
            {t('log_tile_title')}
          </OsdsText>
          {t('log_tile_empty_state_description')}
          {!hasAccount && <p>{t('log_tile_desc_create_account')}</p>}
          {hasAccount && !hasStream && (
            <p>{t('log_tile_desc_create_stream')}</p>
          )}
          <OsdsLink
            className="mt-4"
            color={ODS_THEME_COLOR_INTENT.primary}
            href={guideLink}
            target={OdsHTMLAnchorElementTarget._blank}
          >
            {t('log_data_platform_guide_link')}
            <span slot="end">
              <OsdsIcon
                aria-hidden="true"
                className="ml-4"
                name={ODS_ICON_NAME.EXTERNAL_LINK}
                hoverable
                size={ODS_ICON_SIZE.xxs}
                color={ODS_THEME_COLOR_INTENT.primary}
              />
            </span>
          </OsdsLink>
          <OsdsButton
            className="mt-8"
            inline
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.stroked}
            onClick={onCreate}
          >
            {!hasAccount && t('log_button_create_account')}
            {hasAccount && !hasStream && t('log_button_create_stream')}
            {hasAccount && hasStream && t('log_button_transfer_stream')}
          </OsdsButton>
        </div>
      </OsdsTile>
    </>
  );
}
