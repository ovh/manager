import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorBanner, BaseLayout } from '@ovh-ux/manager-react-components';
import { useRules } from '@/data/hooks/useRules';

export default function Preferences() {
  const { t } = useTranslation('preferences');
  const [country, setCountry] = useState(null);
  const [language, setLanguage] = useState(null);
  const [currency, setCurrency] = useState(null);
  const { data: rules, error } = useRules(country, language);

  if (error) {
    const { response }: any = error;
    const errorObj = {
      data: error,
      headers: response.headers,
      status: response.status,
    };
    return <ErrorBanner error={errorObj} />;
  }

  const header = {
    title: t('title'),
  };

  return <BaseLayout header={header}></BaseLayout>;
}
