import { Trans, useTranslation } from 'react-i18next';
import { ComponentProps, useCallback, useMemo } from 'react';
import {
  TilesInput,
  TilesInputProps,
} from '@/components/tiles-input/TilesInput';
import { TDeployment } from '@/dto';
import { ConfigCardElementProps } from '../config-card/ConfigCard';
import { BadgeProps } from '@/components/badge/Badge';
import { GuideLink } from '@/components/guide-link/GuideLink';
import '@/translations/deployment-mode';

export type DeploymentTilesInputProps<T extends TDeployment = TDeployment> = {
  deployments: T[];
  value: T | null;
  onChange?: (value: T) => void;
  inputProps?: (element: T) => ComponentProps<'input'>;
} & Pick<TilesInputProps, 'name' | 'locked' | 'horizontal'>;

const getRegionBadge = (deployment: TDeployment) => {
  switch (deployment.name) {
    case 'localzone':
      return {
        label: 'pci-region-selector:pci_project_flavors_zone_localzone',
        backgroundColor: 'var(--ods-color-primary-100)',
        textColor: 'var(--ods-color-primary-700)',
      };
    case 'region':
      return {
        label: 'pci-region-selector:pci_project_flavors_zone_1AZ',
        backgroundColor: 'var(--ods-color-primary-400)',
        textColor: 'var(--ods-color-primary-000)',
      };
    case 'region-3-az':
      return {
        label: 'pci-region-selector:pci_project_flavors_zone_3AZ',
        backgroundColor: 'var(--ods-color-primary-700)',
        textColor: 'var(--ods-color-primary-000)',
      };
    default:
      return null;
  }
};

export const DeploymentTilesInput = <T extends TDeployment>({
  deployments,
  value: valueProp,
  onChange,
  inputProps,
  ...tilesInputProps
}: DeploymentTilesInputProps<T>) => {
  const { t } = useTranslation(['deployment-mode', 'pci-region-selector']);

  const getConfigCardProps = useCallback(
    (deployment: T): T & ConfigCardElementProps => {
      const badges: BadgeProps[] = [];

      const regionBadge = getRegionBadge(deployment);
      if (regionBadge)
        badges.push({
          ...regionBadge,
          label: t(regionBadge.label),
        });

      if (deployment.comingSoon)
        badges.push({
          label: t('deployment_mode_card_coming_soon'),
          color: 'neutral',
        });

      if (deployment.beta)
        badges.push({
          label: t('deployment_mode_card_beta'),
          color: 'success',
        });

      return {
        ...deployment,
        label: t(`deployment_mode_card_title_${deployment.name}`),
        description: t(`deployment_mode_card_description_${deployment.name}`),
        badges,
      };
    },
    [t],
  );

  const mappedDeployments = useMemo(() => deployments.map(getConfigCardProps), [
    deployments,
    getConfigCardProps,
  ]);

  const value = useMemo(
    () => (valueProp ? getConfigCardProps(valueProp) : null),
    [valueProp, getConfigCardProps],
  );

  return (
    <TilesInput
      {...tilesInputProps}
      value={value}
      elements={mappedDeployments}
      inputProps={(e) => ({
        disabled: e.comingSoon,
        ...inputProps?.(deployments.find((d) => d.name === e.name)!),
      })}
      onChange={(e) => onChange?.(deployments.find((d) => d.name === e.name)!)}
      label={t('deployment_mode_title')}
      subtitle={
        <Trans
          t={t}
          i18nKey="deployment_mode_description"
          components={{
            Link: <GuideLink guideName="deployments-modes" />,
          }}
        />
      }
    />
  );
};
