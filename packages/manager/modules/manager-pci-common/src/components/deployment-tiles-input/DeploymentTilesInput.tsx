import { Trans, useTranslation } from 'react-i18next';
import { OsdsChip, OsdsText } from '@ovhcloud/ods-components/react';
import { useMemo } from 'react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { DeploymentModeCard } from '@/components/deployment-mode-card';
import {
  TilesInput,
  TilesInputProps,
  TilesInputRenderProps,
} from '@/components/tiles-input/TilesInput';
import { TDeployment } from '@/dto';
import { GuideLink } from '@/components/guide-link/GuideLink';

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
      return (
        <OsdsChip size={ODS_CHIP_SIZE.sm} inline>
          {t('deployment_mode_card_coming_soon')}
        </OsdsChip>
      );

    if (element.beta)
      return (
        <div className="flex items-baseline gap-3">
          <OsdsChip
            color={ODS_THEME_COLOR_INTENT.success}
            size={ODS_CHIP_SIZE.sm}
            inline
          >
            {t('deployment_mode_card_beta')}
          </OsdsChip>
          <OsdsText
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            className="uppercase font-bold"
          >
            {t('deployment_mode_card_beta_price')}
          </OsdsText>
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
            Link: <GuideLink guideName="deployments-modes" />,
          }}
        />
      }
    />
  );
};
