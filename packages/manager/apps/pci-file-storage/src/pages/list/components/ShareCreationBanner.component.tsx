import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

import Banner from '@/components/banner/Banner.component';

type TShareCreationBannerProps = {
  shareCreationsCount: number;
  hasError: boolean;
};

export const ShareCreationBanner: React.FC<TShareCreationBannerProps> = ({
  shareCreationsCount,
  hasError,
}) => {
  const { t } = useTranslation('list');
  const [showBanner, setShowBanner] = useState({
    info: true,
    error: true,
  });

  const removeBanner = (type: 'info' | 'error') => () => {
    setShowBanner((prev) => ({ ...prev, [type]: false }));
  };

  return (
    <>
      {shareCreationsCount > 0 && showBanner.info && (
        <div className="mb-4">
          <Banner
            color="information"
            className="w-full"
            dismissible
            onRemove={removeBanner('info')}
          >
            {shareCreationsCount > 1 ? t('creationCreationsInProgress') : t('creationInProgress')}
          </Banner>
        </div>
      )}
      {hasError && showBanner.error && (
        <div className="mb-4">
          <Banner color="critical" className="w-full" dismissible onRemove={removeBanner('error')}>
            {t('creationError')}
          </Banner>
        </div>
      )}
    </>
  );
};
