import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { HelpDrawer } from '@/components/help-drawer/HelpDrawer.component';

import { ClusterUpdatePolicySection } from './ClusterUpdatePolicySection.component';
import { ClusterVersion } from './ClusterVersion.component';

const VersionAndPolicyHelper = () => {
  const { t } = useTranslation(['add']);

  return (
    <HelpDrawer>
      <Text preset="heading-3" className="font-bold">
        {t('add:kubernetes_add_version_and_upgrade_policy_title')}
      </Text>
    </HelpDrawer>
  );
};

export const ClusterVersionAndUpdatePolicySection = () => {
  const { t } = useTranslation(['add']);

  return (
    <article>
      <div className="flex items-center space-x-4">
        <Text preset="heading-3">{t('add:kubernetes_add_version_and_upgrade_policy_title')}</Text>
        <VersionAndPolicyHelper />
      </div>
      <ClusterVersion />
      <ClusterUpdatePolicySection />
    </article>
  );
};
