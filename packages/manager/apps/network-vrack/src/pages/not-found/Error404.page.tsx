import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation('common');
  return <h1 className="flex justify-center">404 - {t('common_error_notfound')}</h1>;
}
