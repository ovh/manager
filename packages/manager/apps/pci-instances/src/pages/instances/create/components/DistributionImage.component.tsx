import { FC } from 'react';
import { Divider, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { ImageHelper } from './distributionImage/ImageHelper.component';

const DistributionImage: FC = () => {
  const { t } = useTranslation('creation');

  return (
    <section>
      <Divider spacing="64" />
      <div className="flex items-center space-x-4">
        <Text preset="heading-3">
          {t('pci_instance_creation_select_image_title')}
        </Text>
        <ImageHelper />
      </div>
    </section>
  );
};

export default DistributionImage;
