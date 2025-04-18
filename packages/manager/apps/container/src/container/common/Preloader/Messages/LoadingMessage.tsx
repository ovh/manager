import { useTranslation } from 'react-i18next';

const LoadingMessage = (): JSX.Element => {
  const { t } = useTranslation('preloader');
  return <p>{t('loading')}</p>;
};

export default LoadingMessage;
