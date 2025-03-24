import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref, useParams } from 'react-router-dom';
import { Notifications } from '@ovh-ux/manager-react-components';
import {
  OsdsBreadcrumb,
  OsdsIcon,
  OsdsLink,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import {
  ShellContext,
  useNavigation,
} from '@ovh-ux/manager-react-shell-client';
import { PciDiscoveryBanner, useProject } from '@ovh-ux/manager-pci-common';
import HidePreloader from '@/core/HidePreloader';
import { IpTypeStep } from '@/pages/order/steps/IpTypeStep';
import { FailoverSteps } from '@/pages/order/steps/FailoverSteps';
import { FloatingSteps } from '@/pages/order/steps/FloatingSteps';
import { useOrderStore } from '@/pages/order/hooks/useStore';
import { useOrderParams } from '@/pages/order/hooks/useParams';
import { initStartupSteps } from '@/pages/order/utils/startupSteps';
import { useData } from '@/api/hooks/useData';
import { PublicIp } from '@/types/publicip.type';

export default function OrderPage(): JSX.Element {
  const { projectId } = useParams();
  const navigation = useNavigation();

  const context = useContext(ShellContext);

  const { t } = useTranslation('common');
  const { t: tOrder } = useTranslation('order');
  const { t: tStepper } = useTranslation('stepper');

  const { form, setSteps, setForm } = useOrderStore();
  const { data: project } = useProject();

  const { state } = useData(projectId, context.environment.getRegion());
  const orderParams = useOrderParams(state);

  const [projectUrl, setProjectUrl] = useState('');
  const backLink = useHref('..');

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setProjectUrl(data as string);
      });
  }, [projectId, navigation]);

  useEffect(() => {
    setSteps(initStartupSteps());
  }, []);

  useEffect(() => {
    const { ipType, failoverCountry, floatingRegion, instance } = orderParams;
    setForm({
      ...form,
      ...(ipType && { ipType }),
      ...(failoverCountry && { failoverCountry }),
      ...(floatingRegion && { floatingRegion }),
      ...(instance && { instance }),
    });
  }, [orderParams]);

  return (
    <>
      <HidePreloader />
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: projectUrl,
              label: project.description,
            },
            {
              href: `${projectUrl}/public-ips`,
              label: t('pci_additional_ips_title'),
            },
            {
              label: t('pci_additional_ips_add_additional_ip'),
            },
          ]}
        />
      )}
      <OsdsLink
        color={ODS_THEME_COLOR_INTENT.primary}
        className="mt-10"
        href={backLink}
      >
        <OsdsIcon
          slot="start"
          name={ODS_ICON_NAME.ARROW_LEFT}
          size={ODS_ICON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.primary}
        ></OsdsIcon>
        <span className="ml-4">
          {tStepper('common_back_button_back_to_previous_page')}
        </span>
      </OsdsLink>
      <div className="mt-[20px]">
        <OsdsText className="mx-3 font-sans font-bold text-[#00185e] text-2xl">
          {tOrder('pci_additional_ip_create')}
        </OsdsText>

        <Notifications />
      </div>
      <p className="mb-3 font-sans text-base text-[#4d5592]">
        {tOrder('pci_additional_ip_create_description')}
      </p>

      <PciDiscoveryBanner project={project} />

      <div className="flex flex-col gap-y-4 mt-4">
        <IpTypeStep projectId={projectId} />
        {form.ipType === PublicIp.FAILOVER ? (
          <FailoverSteps
            projectId={projectId}
            regionName={context.environment.getRegion()}
          />
        ) : (
          <FloatingSteps
            projectId={projectId}
            regionName={context.environment.getRegion()}
          />
        )}
      </div>
    </>
  );
}
