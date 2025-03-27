import { Trans, useTranslation } from 'react-i18next';
import { OdsBadge, OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import { useContext, useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { DEPLOYMENT_MODES_URL } from './website-link';
import { DeploymentModeCard } from '@/components/deployment-mode-card';
import {
  TilesInput,
  TilesInputProps,
  TilesInputRenderProps,
} from '@/components/tiles-input/TilesInput';
import { TDeployment } from '@/dto';

export type DeploymentTilesInputProps = {
  deployments: TDeployment[];
} & Omit<
  TilesInputProps<TDeployment>,
  'elements' | 'elementKey' | 'render' | 'inputProps' | 'label' | 'subtitle'
>;

const DeploymentTileRenderer = ({
  labelId,
  ariaDetailsId,
  element,
}: TilesInputRenderProps<TDeployment>) => {
  const { t } = useTranslation('deployment-mode');

  const price = useMemo(() => {
    if (element.comingSoon)
      return <OdsBadge label={t('deployment_mode_card_coming_soon')} />;

    if (element.beta)
      return (
        <div className="flex items-baseline gap-3">
          <OdsBadge color="beta" label={t('deployment_mode_card_beta')} />
          <OdsText className="uppercase font-bold">
            {t('deployment_mode_card_beta_price')}
          </OdsText>
        </div>
      );

    return element.price;
  }, [element]);

  return (
    <DeploymentModeCard
      {...element}
      labelId={labelId}
      ariaDetailsId={ariaDetailsId}
      price={price}
      className="h-full"
    />
  );
};

const DescriptionLink = ({ children }: Readonly<{ children?: string }>) => {
  const shell = useContext(ShellContext);
  const ovhSubsidiary = useMemo(
    () => shell?.environment.getUser().ovhSubsidiary,
    [shell],
  );

  return (
    <OdsLink
      href={DEPLOYMENT_MODES_URL[ovhSubsidiary] ?? DEPLOYMENT_MODES_URL.DEFAULT}
      target="_blank"
      icon="external-link"
      label={children}
    />
  );
};

export const DeploymentTilesInput = ({
  deployments,
  ...tilesInputProps
}: DeploymentTilesInputProps) => {
  const { t } = useTranslation('deployment-mode');

  return (
    <TilesInput
      {...tilesInputProps}
      elements={deployments}
      elementKey={(e) => e.name}
      render={DeploymentTileRenderer}
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
