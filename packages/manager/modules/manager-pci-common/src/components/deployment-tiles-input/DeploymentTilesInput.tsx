import { Trans, useTranslation } from 'react-i18next';
import {
  OsdsChip,
  OsdsIcon,
  OsdsLink,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { PropsWithChildren, useContext, useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
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
