import {
  OsdsBreadcrumb,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  Headers,
  Notifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useHref, useParams } from 'react-router-dom';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect, useMemo } from 'react';
import { useCreateStore } from './store';

import { SizeStep } from './steps/size/SizeStep';
import { RegionStep } from './steps/region/RegionStep';
import { IpStep } from './steps/ip/IpStep';
import { NetworkStep } from './steps/network/NetworkStep';
import { InstanceStep } from './steps/InstanceStep';
import { NameStep } from './steps/NameStep';
import { useLoadBalancerAddons } from '@/api/hook/useLoadBalancer/useLoadBalancer';

export default function CreatePage(): JSX.Element {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const projectHref = useProjectUrl('public-cloud');

  const backHref = useHref('..');

  const { projectId } = useParams();

  const { t } = useTranslation(['load-balancer/create', 'load-balancer']);

  const store = useCreateStore();

  const { data: project } = useProject();

  const { addons, isFetching: isAddonsFetching } = useLoadBalancerAddons(
    ovhSubsidiary,
    projectId,
  );

  const regions = useMemo(() => addons?.flatMap((addon) => addon.regions), [
    addons,
  ]);

  // reset the store on mount and set the project id
  useEffect(() => {
    store.reset();
    store.set.projectId(projectId);
  }, [projectId, store]);

  if (isAddonsFetching) {
    return (
      <div className="text-center mt-6">
        <OsdsSpinner inline />
      </div>
    );
  }

  return (
    <>
      <OsdsBreadcrumb
        items={[
          {
            href: projectHref,
            label: project?.description,
          },
          {
            href: backHref,
            label: t('load-balancer:octavia_load_balancers'),
          },
          {
            label: t('octavia_load_balancer_create_title'),
          },
        ]}
      />

      <div className="header mt-8">
        <Headers title={t('octavia_load_balancer_create_title')} />
      </div>

      <Notifications />

      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('octavia_load_balancer_create_description')}
      </OsdsText>

      <div className="mt-6">
        <RegionStep
          regions={regions}
          ovhSubsidiary={ovhSubsidiary}
          projectId={projectId}
        />
        <SizeStep ovhSubsidiary={ovhSubsidiary} regionAddons={addons} />
        <IpStep ovhSubsidiary={ovhSubsidiary} projectId={projectId} />
        <NetworkStep />
        <InstanceStep />
        <NameStep />
      </div>
    </>
  );
}
