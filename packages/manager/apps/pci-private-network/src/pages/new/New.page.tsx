import { useEffect } from 'react';
import {
  Notifications,
  useNotifications,
  useProjectUrl,
  Title,
} from '@ovh-ux/manager-react-components';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { PciDiscoveryBanner, useProject } from '@ovh-ux/manager-pci-common';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import { schema } from './new.constants';
import LocalisationConfig from './localisation/LocalisationConfig.component';
import PrivateNetworkConfig from './private-network/PrivateNetworkConfig.component';
import SubnetConfig from './subnet/SubnetConfig.component';
import ButtonAction from './button-action/ButtonAction.component';
import BackButton from '@/components/back-button/BackButton.component';

export default function NewPage(): JSX.Element {
  const { t } = useTranslation(['new', 'listing']);
  const { clearNotifications } = useNotifications();

  const { data: project } = useProject();

  const projectUrl = useProjectUrl('public-cloud');
  const backHref = useHref('..');

  const form = useForm<NewPrivateNetworkForm>({
    defaultValues: {
      subnet: {
        enableDhcp: true,
        enableGatewayIp: true,
        ipVersion: 4,
      },
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    clearNotifications();
  }, [project]);

  return (
    <>
      <OsdsBreadcrumb
        items={[
          {
            href: projectUrl,
            label: project.description,
          },
          {
            href: backHref,
            label: t('listing:pci_projects_project_network_private'),
          },
          {
            label: t('listing:pci_projects_project_network_private_create'),
          },
        ]}
      />
      <div className="mb-8">
        <BackButton />
      </div>

      <div className="header mb-10 mt-8">
        <Title>{t('pci_projects_project_network_private_create')}</Title>
        <Notifications />
      </div>

      <div className="mb-5">
        <PciDiscoveryBanner project={project} />
      </div>

      <FormProvider {...form}>
        <LocalisationConfig />
        <PrivateNetworkConfig />
        <SubnetConfig />
        <ButtonAction />
      </FormProvider>
    </>
  );
}
