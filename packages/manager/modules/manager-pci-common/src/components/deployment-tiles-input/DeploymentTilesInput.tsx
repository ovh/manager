import { Trans, useTranslation } from 'react-i18next';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { useContext, useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { GLOBAL_INFRASTRUCTURE_URL } from './website-link';
import { RadioAdapterFactoryProps } from '@/components/input-adapter';
import { DeploymentModeCard } from '@/components/deployment-mode-card';
import {
  TilesInput,
  TilesInputProps,
} from '@/components/tiles-input/TilesInput';
import { TDeployment } from '@/dto';

export type DeploymentTilesInputProps = {
  deployments: TDeployment[];
} & Omit<
  TilesInputProps<TDeployment>,
  'elements' | 'elementKey' | 'render' | 'inputProps' | 'label' | 'subtitle'
>;

// render is considered as a React component so we need to ignore this rule
// eslint-disable-next-line react/display-name
const deploymentTileAdapterFactory = (element: TDeployment) => ({
  labelId,
  ariaDetailsId,
}: RadioAdapterFactoryProps) => (
  <DeploymentModeCard
    {...element}
    labelId={labelId}
    ariaDetailsId={ariaDetailsId}
  />
);

export const DeploymentTilesInput = ({
  deployments,
  ...tilesInputProps
}: DeploymentTilesInputProps) => {
  const { t } = useTranslation('deployment-mode');
  const shell = useContext(ShellContext);
  const ovhSubsidiary = useMemo(
    () => shell?.environment.getUser().ovhSubsidiary,
    [shell],
  );

  return (
    <TilesInput
      {...tilesInputProps}
      elements={deployments}
      elementKey={(e) => e.name}
      render={deploymentTileAdapterFactory}
      inputProps={(e) => ({
        disabled: e.comingSoon,
      })}
      label={t('deployment_mode_title')}
      subtitle={
        <Trans
          t={t}
          i18nKey="deployment_mode_description"
          components={{
            Link: (
              <OsdsLink
                href={
                  GLOBAL_INFRASTRUCTURE_URL[ovhSubsidiary] ??
                  GLOBAL_INFRASTRUCTURE_URL.DEFAULT
                }
                color={ODS_THEME_COLOR_INTENT.primary}
                target={OdsHTMLAnchorElementTarget._blank}
              />
            ),
          }}
        />
      }
    />
  );
};
