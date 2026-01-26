import { useContext, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { CountryCode } from '@ovh-ux/manager-config';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { GUIDE_AGENT_CONGURATION_PARAMS } from '@/module.constants';

export const useAgentConfigurationBanner = () => {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.COMMON, NAMESPACES.ONBOARDING]);
  const { addInfo } = useNotifications();
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();

  const guideAgentConfigurationUrl =
    GUIDE_AGENT_CONGURATION_PARAMS[ovhSubsidiary as CountryCode] ||
    (GUIDE_AGENT_CONGURATION_PARAMS.DEFAULT as string);

  useEffect(() => {
    addInfo(
      <OdsText>
        {t(`${BACKUP_AGENT_NAMESPACES.COMMON}:help_banner`)}{' '}
        <OdsLink href={guideAgentConfigurationUrl} target="_blanc" label={t(`${NAMESPACES.ONBOARDING}:guide`).toLocaleLowerCase()} />
      </OdsText>,
    );
  }, []);
};
