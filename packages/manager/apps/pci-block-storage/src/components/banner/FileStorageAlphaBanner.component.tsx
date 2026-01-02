import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGeneralBannerContext } from '@/contexts/GeneralBanner.context';
import { Banner } from '@/components/banner/Banner.component';
import { ButtonLink } from '@/components/button-link/ButtonLink';
import { useIsFileStorageAlphaBannerAvailable } from '@/api/feature';

export const FileStorageAlphaBanner = () => {
  const { t } = useTranslation(['general-banners']);

  const { addBanner, getBanner } = useGeneralBannerContext();
  const isFileStorageAlphaBannerAvailable = useIsFileStorageAlphaBannerAvailable();

  useEffect(() => {
    if (!isFileStorageAlphaBannerAvailable) return;

    addBanner('alpha_file_storage', ({ onRemove }) => (
      <Banner
        iconName="circle-info"
        dismissible
        onRemove={onRemove}
        className="max-w-[800px]"
      >
        <div className="w-full flex flex-col gap-4 items-start">
          <h4 className="m-0">
            {t('pci_project_file_storage_alpha_banner_message_title')}
          </h4>
          <div>{t('pci_project_file_storage_alpha_banner_message')}</div>
          <ButtonLink
            isExternal
            href="https://labs.ovhcloud.com/en/file-storage/"
            target="_blank"
            rel="noopener noreferrer"
            size="xs"
          >
            {t('pci_project_file_storage_alpha_banner_button')}
          </ButtonLink>
        </div>
      </Banner>
    ));
  }, [isFileStorageAlphaBannerAvailable]);

  return getBanner('alpha_file_storage');
};
