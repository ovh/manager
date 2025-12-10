import { useTranslation } from 'react-i18next';

export default function Listing() {
  const { t } = useTranslation('common');
  return <h1 className="flex justify-center">Listing todo - {t('common_error_notfound')}</h1>;
}
