import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Banner from '@/components/banner/Banner.component';

type TInstanceCreationBannerProps = {
  operationsCount: number;
  hasError: boolean;
};

export const InstanceCreationBanner: FC<TInstanceCreationBannerProps> = ({
  operationsCount,
  hasError,
}) => {
  const { t } = useTranslation('creation');
  const [showBanner, setShowBanner] = useState({
    info: true,
    error: true,
  });

  const removeBanner = (type: 'info' | 'error') => () => {
    setShowBanner((prev) => ({ ...prev, [type]: false }));
  };

  const hasOperations = operationsCount > 0;

  return (
    <>
      {hasOperations && showBanner.info && (
        <div className="mb-4">
          <Banner
            color="information"
            dismissible
            onRemove={removeBanner('info')}
          >
            {operationsCount > 1
              ? t('pci_instances_creations_in_progress')
              : t('pci_instance_creation_in_progress')}
          </Banner>
        </div>
      )}
      {hasError && showBanner.error && (
        <div className="mb-4">
          <Banner color="critical" dismissible onRemove={removeBanner('error')}>
            {t('pci_instance_creation_error')}
          </Banner>
        </div>
      )}
    </>
  );
};
