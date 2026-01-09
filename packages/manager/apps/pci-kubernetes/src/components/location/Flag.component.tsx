import { clsx } from 'clsx';

import { TCountryCode } from '@/types/region';

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
