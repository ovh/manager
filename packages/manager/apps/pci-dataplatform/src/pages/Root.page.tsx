import { useTranslation } from 'react-i18next';

export default function Root() {
  const { t } = useTranslation();
  return <h1>{t('title')}</h1>;
}
