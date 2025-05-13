import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsLink,
  OdsText,
  OdsCard,
} from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useAllStreamIds, useDbaasLogs } from '../../api/hook/useLogs';
import { LogContext } from './LogProvider.component';

import '../../translations/logs';

export interface LogHowToProps {
  onGotoStreams: () => void;
}

export function LogHowTo({ onGotoStreams }: Readonly<LogHowToProps>) {
  const { t } = useTranslation('pci-logs');
  const { navigation, tracking } = useContext(ShellContext).shell;
  const { logsGuideURL, logsTracking } = useContext(LogContext);
  const { data: dbaasLogs } = useDbaasLogs();
  const { data: streams } = useAllStreamIds();
  const hasAccount = dbaasLogs?.length > 0;
  const hasStream = streams?.length > 0;

  const onCreate = () => {
    if (!hasAccount) {
      if (logsTracking?.createAccount) {
        tracking.trackClick({
          name: logsTracking?.createAccount,
        });
      }
      navigation
        .getURL('dedicated', `#/dbaas/logs/order`, {})
        .then((url: string) => {
          window.location.href = url;
        });
    } else if (!hasStream) {
      if (logsTracking?.createDataStream) {
        tracking.trackClick({
          name: logsTracking?.createDataStream,
        });
      }
      navigation.getURL('dedicated', `#/dbaas/logs`, {}).then((url: string) => {
        window.location.href = url;
      });
    } else {
      if (logsTracking?.transfer) {
        tracking.trackClick({
          name: logsTracking?.transfer,
        });
      }
      onGotoStreams();
    }
  };

  const getLogButtonLabel = () => {
    if (!hasAccount) {
      return t('log_button_create_account');
    }
    if (hasAccount && !hasStream) {
      return t('log_button_create_stream');
    }
    return t('log_button_transfer_stream');
  };

  return (
    <>
      <OdsText preset="heading-1">{t('log_tile_section_title')}</OdsText>
      <OdsCard className="mt-4">
        <div className="flex flex-col">
          <OdsText preset="heading-2">{t('log_tile_title')}</OdsText>
          {t('log_tile_empty_state_description')}
          {!hasAccount && <p>{t('log_tile_desc_create_account')}</p>}
          {hasAccount && !hasStream && (
            <p>{t('log_tile_desc_create_stream')}</p>
          )}
          {logsGuideURL && (
            <OdsLink
              label={t('log_data_platform_guide_link')}
              icon={ODS_ICON_NAME.externalLink}
              className="mt-4"
              href={logsGuideURL}
              target="_blank"
            />
          )}
          <OdsButton
            className="mt-8"
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.outline}
            onClick={onCreate}
            label={getLogButtonLabel()}
          />
        </div>
      </OdsCard>
    </>
  );
}
