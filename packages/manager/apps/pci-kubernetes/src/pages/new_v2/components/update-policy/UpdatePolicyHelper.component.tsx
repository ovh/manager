import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { HelpDrawer } from '@/components/help-drawer/HelpDrawer.component';
import { UpdatePolicy } from '@/types';

export const UpdatePolicyHelper = () => {
  const { t } = useTranslation(['add', 'service']);

  return (
    <HelpDrawer>
      <Text preset="heading-3" className="font-bold">
        {t('add:kubernetes_add_update_policy_title')}
      </Text>

      <Text preset="paragraph" className="pt-4">
        {t('add:kube_update_policy_picker_documentation_text')}
      </Text>

      <div className="mt-6 space-y-6">
        <div>
          <Text preset="paragraph" className="font-bold">
            {t(`service:kube_service_upgrade_policy_${UpdatePolicy.AlwaysUpdate}`)}
          </Text>
          <Text preset="paragraph" className="mt-2">
            {t(`service:kube_service_upgrade_policy_description_${UpdatePolicy.AlwaysUpdate}`)}
          </Text>
        </div>

        <div>
          <Text preset="paragraph" className="font-bold">
            {t(`service:kube_service_upgrade_policy_${UpdatePolicy.MinimalDowntime}`)}
          </Text>
          <Text preset="paragraph" className="mt-2">
            {t(`service:kube_service_upgrade_policy_description_${UpdatePolicy.MinimalDowntime}`)}
          </Text>
        </div>

        <div>
          <Text preset="paragraph" className="font-bold">
            {t(`service:kube_service_upgrade_policy_${UpdatePolicy.NeverUpdate}`)}
          </Text>
          <Text preset="paragraph" className="mt-2">
            {t(`service:kube_service_upgrade_policy_description_${UpdatePolicy.NeverUpdate}`)}
          </Text>
        </div>
      </div>
    </HelpDrawer>
  );
};
