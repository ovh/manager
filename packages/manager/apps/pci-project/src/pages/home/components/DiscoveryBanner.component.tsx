import { useTranslation } from 'react-i18next';
import { OdsMessage, OdsText, OdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_COLOR,
  ODS_MESSAGE_VARIANT,
  ODS_BUTTON_SIZE,
} from '@ovhcloud/ods-components';

import { useProject, isDiscoveryProject } from '@ovh-ux/manager-pci-common';
import { useActivationUrl } from '@/hooks/useActivationUrl';

function DiscoveryBanner({ className }: { className?: string }) {
  const { t } = useTranslation('project');
  const { data: project } = useProject();
  const { goToActivation } = useActivationUrl();

  if (!project || !isDiscoveryProject(project)) {
    return null;
  }

  return (
    <>
      {/*
      Previous implementation :
      <PciDiscoveryBanner project={project} className={className} />

      TODO: Implement the new design below, in @ovh-ux/manager-pci-common
      */}
      <OdsMessage
        color={ODS_MESSAGE_COLOR.information}
        variant={ODS_MESSAGE_VARIANT.default}
        className={`my-4 ${className}`}
        isDismissible={false}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col flex-1">
            <OdsText preset="heading-4">
              {t('pci_projects_project_banner_discovery_title')}
            </OdsText>
            <OdsText preset="paragraph">
              <span
                dangerouslySetInnerHTML={{
                  __html: t('pci_projects_project_banner_discovery_message'),
                }}
              />
            </OdsText>
          </div>
          <OdsButton
            size={ODS_BUTTON_SIZE.md}
            onClick={goToActivation}
            label={t('pci_projects_project_banner_discovery_cta')}
            className="mr-4"
          />
        </div>
      </OdsMessage>
    </>
  );
}

export default DiscoveryBanner;
