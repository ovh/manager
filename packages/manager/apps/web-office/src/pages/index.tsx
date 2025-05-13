import { useTranslation } from 'react-i18next';

export default function WebOffice() {
  const { t } = useTranslation('web-office');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Start your application</div>
    </div>
  );
}
