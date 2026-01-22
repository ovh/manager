import { clsx } from 'clsx';

import { TCountryCode } from '@/domain/entities/regions';

import './flag.scss';

type TFlagProps = {
  isoCode: TCountryCode;
  disabled?: boolean;
};

export const Flag = ({ disabled, isoCode }: TFlagProps) => (
  <span
    className={clsx('flag', `flag--${isoCode}`, {
      'flag--disabled': disabled,
    })}
  />
);
