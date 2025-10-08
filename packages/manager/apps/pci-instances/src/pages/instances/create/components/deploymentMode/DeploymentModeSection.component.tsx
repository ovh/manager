import { useTranslation } from 'react-i18next';
import { Link, Text } from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { useGuideLink } from '@/hooks/url/useGuideLink';
import { DeploymentModeSelection } from '@/pages/instances/create/components/deploymentMode/DeploymentModeSelection.component';

export const DeploymentModeSection = () => {
  const { t } = useTranslation([NAMESPACES.ONBOARDING, 'creation', 'common']);
  const guide = useGuideLink('LOCATION');

  return (
    <section className="my-8">
      <div className="flex gap-4 mt-8 items-center">
        <Text preset="heading-3">
          {t('creation:pci_instance_creation_select_deployment_mode_title')}
        </Text>
        <HelpDrawer>
          <Text preset="paragraph" className="mb-4">
            {t('creation:pci_instance_creation_select_deployment_mode_help_p1')}
          </Text>
          <Text preset="paragraph" className="mb-4">
            {t('creation:pci_instance_creation_select_deployment_mode_help_p2')}
          </Text>
          <Text preset="paragraph" className="mb-4">
            {t('creation:pci_instance_creation_select_deployment_mode_help_p3')}
          </Text>
          <Text preset="paragraph" className="mb-4">
            {t('creation:pci_instance_creation_select_deployment_mode_help_p4')}
          </Text>
          <Link
            className="visited:text-[var(--ods-color-primary-500)]"
            href={guide}
            target="_blank"
          >
            {t('find_out_more')}
          </Link>
        </HelpDrawer>
      </div>
      <DeploymentModeSelection />
    </section>
  );
};
