import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';

type Props = {
  options?: Intl.DateTimeFormatOptions;
};

const useDateFormat = ({ options }: Props): Intl.DateTimeFormat => {
  const context = useContext(ShellContext);
  const { environment } = context;
  const userLanguage = environment
    ? environment.getUserLocale().replace('_', '-')
    : 'fr-FR';

  return new Intl.DateTimeFormat(userLanguage, options);
};

export default useDateFormat;
