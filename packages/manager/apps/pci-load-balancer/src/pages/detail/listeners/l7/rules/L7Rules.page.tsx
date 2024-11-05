import { Suspense } from 'react';
import { Outlet, useHref, useParams } from 'react-router-dom';
import {
  OsdsBreadcrumb,
  OsdsIcon,
  OsdsLink,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useProject } from '@ovh-ux/manager-pci-common';
import { Headers, useProjectUrl } from '@ovh-ux/manager-react-components';
import { useListener } from '@/api/hook/useListener';
import { ROUTE_PATHS } from '@/routes';

export default function L7RulesPage() {
  const { t: tPciCommon } = useTranslation('pci-common');
  const { t: tL7Policies } = useTranslation('l7');
  const { t } = useTranslation('l7/rules');
  const hrefProject = useProjectUrl('public-cloud');
  const { t: tLoadBalancer } = useTranslation('load-balancer');
  const { t: tListener } = useTranslation('listeners');
  const { projectId, loadBalancerId, region, listenerId } = useParams();
  const { data: project } = useProject();
  const { data: listener } = useListener({
    projectId,
    region,
    loadBalancerId,
    listenerId,
  });
  const hrefLoadBalancers = useHref('..');
  const hrefLoadBalancerDetail = useHref(
    `../${region}/${loadBalancerId}/${ROUTE_PATHS.GENERAL_INFORMATION}`,
  );
  const hrefListeners = useHref(
    `../${region}/${loadBalancerId}/${ROUTE_PATHS.LISTENERS}`,
  );
  const hrefL7Policies = useHref(
    `../${region}/${loadBalancerId}/${ROUTE_PATHS.LISTENERS}/${listenerId}/l7`,
  );
  return (
    <>
      <OsdsBreadcrumb
        items={[
          {
            href: hrefProject,
            label: project.description,
          },
          {
            href: hrefLoadBalancers,
            label: tLoadBalancer('octavia_load_balancers'),
          },
          {
            href: hrefLoadBalancerDetail,
            label: loadBalancerId,
          },
          {
            href: hrefListeners,
            label: tListener('octavia_load_balancer_listeners_title'),
          },
          {
            href: `${hrefL7Policies}`,
            label: tL7Policies('octavia_load_balancer_list_l7_policies_title'),
          },
          {
            label: t('octavia_load_balancer_list_l7_rules_title'),
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
        href={useHref(`../${region}/${loadBalancerId}/listeners/list`)}
      >
        <OsdsIcon
          name={ODS_ICON_NAME.ARROW_LEFT}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_TEXT_COLOR_INTENT.primary}
          className="pr-4"
        />
        {tPciCommon('common_back_button_back_to_previous_page')}
      </OsdsLink>
      <div className="header mt-8">
        <Headers
          description={t('octavia_load_balancer_list_l7_rules_description')}
          title={t('octavia_load_balancer_list_l7_rules_title')}
        />
      </div>
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}
