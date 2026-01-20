import { FC } from 'react';

import { clsx } from 'clsx';

import { Badge, Text } from '@ovhcloud/ods-react';

import { TCountryCode } from '@/domain/entities/regions';

import { Flag } from './Flag.component';

type TLocalizationProps = {
  name: string;
  countryCode?: TCountryCode | null;
  labels?: Array<string>;
};

export const Location: FC<TLocalizationProps> = ({ name, countryCode, labels }) => (
  <div
    className={clsx('flex w-full flex-wrap items-center gap-4', {
      'gap-x-6': !!countryCode,
    })}
  >
    <Text className="flex grow items-center gap-x-4">
      {countryCode && <Flag isoCode={countryCode} />}
      {name}
    </Text>

    {labels && labels.length > 0 && (
      <div className="flex gap-4">
        {labels.map((label, index) => (
          <Badge key={index} color="information">
            {label}
          </Badge>
        ))}
      </div>
    )}
  </div>
);
