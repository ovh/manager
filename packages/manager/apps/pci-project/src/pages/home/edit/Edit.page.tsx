import { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { OdsSpinner } from '@ovhcloud/ods-components/react';

import { isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import { Notifications } from '@ovh-ux/manager-react-components';

import {
  useIsAValidHdsSupportLevel,
  useIsHdsFeatureAvailabilityEnabled,
} from '@/hooks/use-hds/useHds';
import { TProject } from '@/types/pci-common.types';

import GeneralInformationSection from './general-information-section/GeneralInformationSection';
import HdsSection from './hds-section/HdsSection';
import RemoveSection from './remove-section/RemoveSection';

export default function EditPage() {
  const { data: project } = (useProject as unknown as () => { data: TProject | undefined })();

  const isDiscovery = (isDiscoveryProject as (p: TProject | undefined) => boolean)(project);
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

      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
}
