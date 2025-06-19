import {
  Links,
  LinkType,
  OnboardingLayout,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { VMWareStatus } from './LogsOnboarding.component';
import { useEnableLogForwarder } from '@/data/hooks/useVmwareVsphereLogForwarder';

type LogsActivationProps = {
  currentStatus: VMWareStatus;
  serviceName: string;
};

const LogsActivation = ({
  currentStatus,
  serviceName,
}: LogsActivationProps) => {
  const { t } = useTranslation('onboarding');
  const { addInfo } = useNotifications();
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const [isTrusted, setIsTrusted] = useState(false);
  const { enableLogsForwarder } = useEnableLogForwarder(serviceName);
  const getSNC = async () => {
    const env = await environment.getEnvironment();
    const { trusted } = env.getUser();
    setIsTrusted(trusted);
  };

  useEffect(() => {
    getSNC();
  }, [environment]);

  useEffect(() => {
    if (currentStatus === VMWareStatus.MIGRATING) {
      addInfo(
        <div className="flex flex-col">
          <OdsText preset={ODS_TEXT_PRESET.heading4}>
            {t('logs_onboarding_migration_banner_title')}
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('logs_onboarding_migration_banner_dscription')}
          </OdsText>
        </div>,
        false,
      );
    }
  }, [currentStatus]);
  return (
    <OnboardingLayout
      title={t('logs_onboarding_default_title')}
      description={
        <>
          <OdsText preset="paragraph" className="text-center">
            {t('logs_onboarding_default_description')}{' '}
          </OdsText>
          <div className="flex flex-row gap-4 align-center">
            <OdsButton
              label={
                isTrusted
                  ? t('logs_onboarding_primary_cta_activate_snc')
                  : t('logs_onboarding_primary_cta_activate')
              }
              onClick={() => enableLogsForwarder()}
              isDisabled={currentStatus === VMWareStatus.MIGRATING}
            ></OdsButton>
            <Links
              type={LinkType.external}
              label={t('logs_onboarding_secondary_cta')}
              target="_blank"
              href="https://www.ovhcloud.com/fr/identity-security-operations/logs-data-platform/"
            />
          </div>
        </>
      }
    />
  );
};

export default LogsActivation;
