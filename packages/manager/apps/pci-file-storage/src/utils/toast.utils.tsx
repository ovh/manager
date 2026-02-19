import { Trans, useTranslation } from 'react-i18next';

import { toast } from '@ovhcloud/ods-react';

export enum ToastDuration {
  Short = 5000,
  Infinite = Infinity,
}

export type ShowToastOptions = {
  ns: string;
  i18nKey: string;
  values?: Record<string, unknown>;
  duration: ToastDuration;
};

const TranslatedToast = ({ ns, ...rest }: Omit<ShowToastOptions, 'duration'>) => {
  const { t } = useTranslation(ns);

  return <Trans ns={ns} t={t} {...rest} />;
};

export const successToast = ({ duration, ...rest }: ShowToastOptions): void => {
  toast.success(<TranslatedToast {...rest} />, {
    duration,
  });
};

export const warningToast = ({ duration, ...rest }: ShowToastOptions): void => {
  toast.warning(<TranslatedToast {...rest} />, {
    duration,
  });
};
