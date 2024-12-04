import { useProject } from '@ovh-ux/manager-pci-common';
import { Headers, useProjectUrl } from '@ovh-ux/manager-react-components';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  OsdsBreadcrumb,
  OsdsIcon,
  OsdsLink,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OBJECT_CONTAINER_MODE_LOCAL_ZONE,
  OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
  OBJECT_CONTAINER_OFFER_SWIFT,
  STORAGE_PRICES_LINK,
} from '@/constants';
import { SolutionStepComponent } from './step/SolutionStep.component';
import { DeploymentModeStep } from './step/DeploymentModeStep.component';
import { useContainerCreationStore } from './useContainerCreationStore';
import { RegionStep } from './step/RegionStep.component';
import { ContainerType } from './step/ContainerTypeStep.component';
import { ContainerNameStep } from './step/ContainerNameStep.component';
import { LinkUserStep } from './step/LinkUserStep.component';
import { VersioningStep } from './step/VersioningStep.component';
import { EncryptionStep } from './step/EncryptionStep.component';

export default function ContainerNewPage() {
  const { t } = useTranslation('containers/add');
  const projectHref = useProjectUrl('public-cloud');
  const { data: project } = useProject();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const pricesLink =
    STORAGE_PRICES_LINK[ovhSubsidiary] || STORAGE_PRICES_LINK.DEFAULT;
  const { form } = useContainerCreationStore();
  return (
    <>
      <OsdsBreadcrumb
        items={[
          {
            href: projectHref,
            label: project?.description,
          },
          {
            label: t('pci_projects_project_storages_containers_add_title'),
          },
        ]}
      />

      <div className="header mt-8">
        <Headers
          title={t('pci_projects_project_storages_containers_add_title')}
        />
      </div>

      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('pci_projects_project_storages_containers_add_description')}
      </OsdsText>
      <br />
      <OsdsLink
        className="mt-4"
        color={ODS_THEME_COLOR_INTENT.primary}
        href={pricesLink}
        target={OdsHTMLAnchorElementTarget._blank}
      >
        {t('pci_projects_project_storages_containers_add_description_link')}
        <span slot="end">
          <OsdsIcon
            aria-hidden="true"
            className="ml-4"
            name={ODS_ICON_NAME.EXTERNAL_LINK}
            hoverable
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </span>
      </OsdsLink>
      {
        // @TODO remove debugging data
        <pre>FORM DATA: {JSON.stringify(form)}</pre>
      }
      <div className="mt-6">
        <SolutionStepComponent />
        {form.offer === OBJECT_CONTAINER_OFFER_STORAGE_STANDARD && (
          <DeploymentModeStep />
        )}
        <RegionStep />
        {form.offer === OBJECT_CONTAINER_OFFER_SWIFT && <ContainerType />}
        {form.offer === OBJECT_CONTAINER_OFFER_STORAGE_STANDARD &&
          form.deploymentMode !== OBJECT_CONTAINER_MODE_LOCAL_ZONE && (
            <>
              <LinkUserStep />
              <VersioningStep />
              <EncryptionStep />
            </>
          )}
        <ContainerNameStep />
      </div>
    </>
  );
}
