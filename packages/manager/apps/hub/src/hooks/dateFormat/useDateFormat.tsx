import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import React, { useContext } from 'react';

type Props = {
  options?: Intl.DateTimeFormatOptions;
};

const useDateFormat = ({ options }: Props): Intl.DateTimeFormat => {
  const context = useContext(ShellContext);
  const { environment } = context;
  const userLanguage = environment.getUserLocale().replace('_', '-');

  return new Intl.DateTimeFormat(userLanguage, options);
};

export default useDateFormat;
