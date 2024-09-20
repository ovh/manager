import {
  Headers,
  Notifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useEffect } from 'react';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { useProject, PciDiscoveryBanner } from '@ovh-ux/manager-pci-common';
import RegionStep from '@/pages/create/steps/RegionStep';
import NameStep from '@/pages/create/steps/NameStep';
import PlanStep from '@/pages/create/steps/PlanStep';
import { useStore } from '@/pages/create/store';

export default function CreatePage(): JSX.Element {
  const { t: tCreate } = useTranslation('create');
  const { t: tCommon } = useTranslation('common');

  const { data: project } = useProject();
  const hrefProject = useProjectUrl('public-cloud');
  const backHref = useHref('..');

  const store = useStore();

  useEffect(() => {
    store.reset();
  }, []);

  return (
    <>
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: hrefProject,
              label: project.description,
            },
            {
              href: backHref,
              label: tCommon('private_registry_title'),
            },
            {
              label: tCreate('private_registry_create'),
            },
          ]}
        />
      )}
      <div className="header mt-8">
        <Headers title={tCreate('private_registry_create')} />
      </div>
      <Notifications />
      <PciDiscoveryBanner project={project} className="mb-6" />
      <RegionStep />
      <NameStep />
      <PlanStep />
    </>
  );
}
