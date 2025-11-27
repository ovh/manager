import { FC } from 'react';
import { Text } from '@ovhcloud/ods-react';
import { DeploymentModeBadge } from '../deploymentModeBadge/DeploymentModeBadge.component';
import { Flag } from '../flag/Flag';
import { TCountryIsoCode } from '../flag/country-iso-code';
import { TDeploymentMode } from '@/types/instance/common.type';
import clsx from 'clsx';

type TLocalizationProps = {
  name: string;
  countryCode?: TCountryIsoCode | null;
  deploymentMode?: TDeploymentMode;
};

const Localization: FC<TLocalizationProps> = ({
  name,
  countryCode,
  deploymentMode,
}) => (
  <div
    className={clsx('flex justify-between items-center w-full', {
      'gap-x-6': !!countryCode,
    })}
  >
    <Text className="flex items-center gap-x-4">
      {countryCode && <Flag isoCode={countryCode} />}
      {name}
    </Text>
    {deploymentMode && <DeploymentModeBadge mode={deploymentMode} />}
  </div>
);

export default Localization;
