import { Suspense } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OsdsBreadcrumb,
  OsdsIcon,
  OsdsLink,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { useProject } from '@ovh-ux/manager-pci-common';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useListener } from '@/api/hook/useListener';

export default function L7Page() {
  const { t: tPciCommon } = useTranslation('pci-common');
  const { t } = useTranslation('octavia-load-balancer-l7');
  const hrefProject = useProjectUrl('public-cloud');
  const { t: tLoadBalancer } = useTranslation('octavia-load-balancer');
  const { t: tListener } = useTranslation('octavia-load-balancer-listeners');
  const { projectId, loadBalancerId, region, listenerId } = useParams();
  const { data: project } = useProject();
  const { data: listener } = useListener({
    projectId,
    region,
    loadBalancerId,
    listenerId,
  });
  return (
    <>
      <OsdsBreadcrumb
        items={[
          {
            href: hrefProject,
            label: project.description,
          },
          {
            href: `${hrefProject}/octavia-load-balancer`,
            label: tLoadBalancer('octavia_load_balancers'),
          },
          {
            href: `${hrefProject}/octavia-load-balancer/${region}/${loadBalancerId}`,
            label: loadBalancerId,
          },
          {
            href: `${hrefProject}/octavia-load-balancer/${region}/${loadBalancerId}/listeners`,
            label: tListener('octavia_load_balancer_listeners_title'),
          },
          {
            label: t('octavia_load_balancer_list_l7_policies_title'),
          },
        ]}
      />
      <OsdsText
        className="block mt-8"
        color={ODS_TEXT_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._600}
        level={ODS_TEXT_LEVEL.heading}
      >
        {listener?.name}
      </OsdsText>
      <OsdsLink
        className="mt-8"
        color={ODS_TEXT_COLOR_INTENT.primary}
        href={`${hrefProject}/octavia-load-balancer/${region}/${loadBalancerId}/listeners/list`}
      >
        <OsdsIcon
          name={ODS_ICON_NAME.ARROW_LEFT}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_TEXT_COLOR_INTENT.primary}
          className="pr-4"
        />
        {tPciCommon('common_back_button_back_to_previous_page')}
      </OsdsLink>
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}
