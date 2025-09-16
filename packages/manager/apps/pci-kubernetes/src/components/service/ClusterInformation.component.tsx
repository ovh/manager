import { useContext, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';

import {
  OsdsDivider,
  OsdsText,
  OsdsPopover,
  OsdsTile,
  OsdsIcon,
  OsdsPopoverContent,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { RegionChipByType, useParam } from '@ovh-ux/manager-pci-common';
import {
  Clipboard,
  Links,
  LinkType,
  TileBlock as TileLine,
  useNotifications,
} from '@ovh-ux/manager-react-components';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { useRegionInformations } from '@/api/hooks/useRegionInformations';
import { PLAN_DOC_LINKS } from '@/constants';
import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import { DeploymentMode, TKube } from '@/types';

import AdmissionPlugins from './AdmissionPlugins.component';
import ClusterEtcd from './ClusterETCD.component';
import { isProcessing } from './ClusterManagement.component';
import ClusterStatus from './ClusterStatus.component';
import ClusterTile from './ClusterTile.component';
import TileLineLegacy from './TileLine.component';

export type ClusterInformationProps = {
  kubeDetail: TKube;
};

export default function ClusterInformation({
  kubeDetail,
}: Readonly<ClusterInformationProps>) {
  const { t } = useTranslation([
    'service',
    'listing',
    'kube',
    NAMESPACES.ONBOARDING,
  ]);

  const { projectId } = useParam('projectId');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const { clearNotifications } = useNotifications();
  const has3AZ = use3AZPlanAvailable();

  const planDocumentationLink =
    PLAN_DOC_LINKS[ovhSubsidiary as keyof typeof PLAN_DOC_LINKS] ??
    PLAN_DOC_LINKS.DEFAULT;

  const { data: regionInformations } = useRegionInformations(
    projectId,
    kubeDetail.region,
  );
  useEffect(() => clearNotifications, [clearNotifications]);

  return (
    <OsdsTile
      className="flex-col w-full shadow-lg"
      inline
      rounded
      variant={ODS_TILE_VARIANT.ghost}
    >
      <div className="flex flex-col w-full">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('service:kube_service_cluster_information')}
        </OsdsText>
        <OsdsDivider separator />

        <TileLine label={t('kube_service_name')}>
          <OsdsText
            className="mb-4 break-words"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {kubeDetail.name}
          </OsdsText>
        </TileLine>

        <TileLine label={t('listing:kube_list_id')}>
          <Clipboard aria-label="clipboard" value={kubeDetail.id} />
        </TileLine>

        <div className="flex">
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
            hue={ODS_TEXT_COLOR_HUE._900}
          >
            {t('kube:kube_service_cluster_plan')}
          </OsdsText>
          <OsdsPopover>
            <span slot="popover-trigger">
              <OsdsIcon
                name={ODS_ICON_NAME.HELP}
                size={ODS_ICON_SIZE.xs}
                className="ml-4 cursor-help"
                color={ODS_THEME_COLOR_INTENT.primary}
              />
            </span>
            <OsdsPopoverContent>
              <OsdsText
                className="mb-4"
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
              >
                {t('kube:kube_service_cluster_plan_description')}
              </OsdsText>
              <Links
                label={t(`${NAMESPACES.ONBOARDING}:find_out_more`)}
                type={LinkType.external}
                target={OdsHTMLAnchorElementTarget._blank}
                href={planDocumentationLink}
              />
            </OsdsPopoverContent>
          </OsdsPopover>
        </div>

        <OsdsText
          className="mb-4"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t(`kube:kube_service_cluster_plan_${kubeDetail.plan}`)}
        </OsdsText>

        <OsdsDivider separator />

        <TileLine label={t('service:kube_service_cluster_version')}>
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {kubeDetail.version}
          </OsdsText>
        </TileLine>

        <TileLine label={t('service:kube_service_cluster_status')}>
          <ClusterStatus status={kubeDetail.status} />
        </TileLine>

        <TileLine label={t('service:kube_service_cluster_region')}>
          <div className="flex items-baseline">
            <OsdsText
              className="mb-4"
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {kubeDetail.region}
            </OsdsText>

            {has3AZ && (
              <div className="ml-2 mb-4">
                <RegionChipByType
                  data-testId={regionInformations?.type}
                  showTooltip={false}
                  type={regionInformations?.type as DeploymentMode}
                />
              </div>
            )}
          </div>
        </TileLine>

        <TileLineLegacy title={<ClusterTile />} value={<ClusterEtcd />} />

        <TileLine label={t('service:kube_service_cluster_admission_plugins')}>
          <AdmissionPlugins
            plugins={kubeDetail.plugins}
            isProcessing={isProcessing(kubeDetail.status)}
          />
        </TileLine>
      </div>
    </OsdsTile>
  );
}
