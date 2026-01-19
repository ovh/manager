import React from 'react';

import clsx from 'clsx';

import { Text } from '@ovhcloud/ods-react';

import { TCountryIsoCode } from '@/components/new-lib/flag/country-iso-code';
import { TDeploymentMode } from '@/domain/entities/catalog.entity';

import { DeploymentModeBadge } from '../deploymentModeBadge/DeploymentModeBadge.component';
import { Flag } from '../flag/Flag';

type TLocalizationProps = {
  name: string;
  countryCode?: TCountryIsoCode | null;
  deploymentMode?: TDeploymentMode;
};

const Localization = React.memo(({ name, countryCode, deploymentMode }: TLocalizationProps) => (
  <div
    className={clsx('flex w-full items-center justify-between', {
      'gap-x-6': !!countryCode,
    })}
  >
    <Text className="flex items-center gap-x-4">
      {countryCode && <Flag isoCode={countryCode} />}
      {name}
    </Text>
    {deploymentMode && <DeploymentModeBadge mode={deploymentMode} />}
  </div>
));

export default Localization;
