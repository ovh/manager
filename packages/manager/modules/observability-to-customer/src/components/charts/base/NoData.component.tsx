import { useTranslation } from 'react-i18next';

export const NoDataComponent = (): JSX.Element => {
  const { t } = useTranslation('observability-chart');

  return (
    <div className="w-full h-full flex justify-center items-center">
      <span className="heading-1 font-extrabold">{t('chart_no_data')}</span>
    </div>
  );
};

export default NoDataComponent;
