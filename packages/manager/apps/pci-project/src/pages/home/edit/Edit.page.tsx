import { isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import { Notifications } from '@ovh-ux/manager-react-components';
import { Outlet } from 'react-router-dom';

import { OdsSpinner } from '@ovhcloud/ods-components/react';
import GeneralInformationSection from './general-information-section/GeneralInformationSection';
import HdsSection from './hds-section/HdsSection';
import RemoveSection from './remove-section/RemoveSection';
import {
  useIsHdsFeatureAvailabilityEnabled,
  useIsAValidHdsSupportLevel,
} from './hds-section/useHds';

export default function EditPage() {
  const { data: project } = useProject();

  const isDiscovery = isDiscoveryProject(project);
  const isHdsFeatureAvailabilityEnabled = useIsHdsFeatureAvailabilityEnabled();
  const isAValidHdsSupportLevel = useIsAValidHdsSupportLevel();

  const shouldDisplayHdsSection =
    !isDiscovery && isHdsFeatureAvailabilityEnabled && isAValidHdsSupportLevel;

  if (!project) {
    return <OdsSpinner size="md" />;
  }

  return (
    <div>
      <div className="my-4">
        <Notifications />
      </div>

      <GeneralInformationSection isDiscovery={isDiscovery} project={project} />

      {shouldDisplayHdsSection && <HdsSection project={project} />}

      <RemoveSection isDiscovery={isDiscovery} />

      <Outlet />
    </div>
  );
}
