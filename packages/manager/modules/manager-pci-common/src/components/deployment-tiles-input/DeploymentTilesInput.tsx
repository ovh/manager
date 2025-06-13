import { Trans, useTranslation } from 'react-i18next';
import { OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import { PropsWithChildren, useContext, useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { DEPLOYMENT_MODES_URL } from './website-link';
import {
  TilesInput,
  TilesInputProps,
} from '@/components/tiles-input/TilesInput';
import { TDeployment } from '@/dto';
import { ConfigCardElementProps } from '../config-card/ConfigCard';
import { BadgeProps } from '@/components/internal/badge/Badge';
import '@/translations/deployment-mode';

type MappedDeployment = TDeployment & ConfigCardElementProps;

export type DeploymentTilesInputProps = {
  deployments: TDeployment[];
} & Omit<
  TilesInputProps<MappedDeployment>,
  'elements' | 'elementKey' | 'render' | 'inputProps' | 'label' | 'subtitle'
>;

const DescriptionLink = ({ children }: PropsWithChildren) => {
  const shell = useContext(ShellContext);
  const ovhSubsidiary = useMemo(
    () => shell?.environment.getUser().ovhSubsidiary,
    [shell],
  );

  return (
    <OsdsLink
      href={DEPLOYMENT_MODES_URL[ovhSubsidiary] ?? DEPLOYMENT_MODES_URL.DEFAULT}
      color={ODS_THEME_COLOR_INTENT.primary}
      target={OdsHTMLAnchorElementTarget._blank}
    >
      {children}
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
  );
};

const getRegionBadge = (deployment: TDeployment) => {
  let regionBadge: BadgeProps | null = null;
  switch (deployment.name) {
    case 'localzone':
      regionBadge = {
        label: 'pci-region-selector:pci_project_flavors_zone_localzone',
        backgroundColor: 'var(--ods-color-primary-100)',
        textColor: 'var(--ods-color-primary-700)',
      };
      break;
    case 'region':
      regionBadge = {
        label: 'pci-region-selector:pci_project_flavors_zone_1AZ',
        backgroundColor: 'var(--ods-color-primary-400)',
        textColor: 'var(--ods-color-primary-000)',
      };
      break;
    case 'region-3-az':
      regionBadge = {
        label: 'pci-region-selector:pci_project_flavors_zone_3AZ',
        backgroundColor: 'var(--ods-color-primary-700)',
        textColor: 'var(--ods-color-primary-000)',
      };
      break;
    default:
  }

  return regionBadge;
};

export const DeploymentTilesInput = ({
  deployments,
  ...tilesInputProps
}: DeploymentTilesInputProps) => {
  const { t } = useTranslation(['deployment-mode', 'pci-region-selector']);

  const mappedDeployments = useMemo(
    () =>
      deployments.map<MappedDeployment>((d) => {
        const badges: BadgeProps[] = [];

        const regionBadge = getRegionBadge(d);
        if (regionBadge)
          badges.push({
            ...regionBadge,
            label: t(regionBadge.label),
          });

        if (d.comingSoon)
          badges.push({
            label: t('deployment_mode_card_coming_soon'),
            color: 'neutral',
          });

        if (d.beta)
          badges.push({
            label: t('deployment_mode_card_beta'),
            color: 'success',
          });

        return {
          ...d,
          label: t(`deployment_mode_card_title_${d.name}`),
          description: t(`deployment_mode_card_description_${d.name}`),
          badges,
        };
      }),
    [deployments],
  );

  return (
    <TilesInput
      {...tilesInputProps}
      elements={mappedDeployments}
      inputProps={(e) => ({
        disabled: e.comingSoon,
      })}
      label={t('deployment_mode_title')}
      subtitle={
        <Trans
          t={t}
          i18nKey="deployment_mode_description"
          components={{
            Link: <DescriptionLink />,
          }}
        />
      }
    />
  );
};
