import clsx from 'clsx';
import { TCountryIsoCode } from './country-iso-code';
import './flag.scss';

type TFlagProps = {
  isoCode: TCountryIsoCode;
  disabled?: boolean;
};

export const Flag = ({ disabled, isoCode }: TFlagProps) => (
  <span
    className={clsx('flag', `flag--${isoCode}`, {
      'flag--disabled': disabled,
    })}
  />
);
