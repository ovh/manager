import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@datatr-ux/uxlib';
import DockerCustomImageInput from '../docker-custom-image/DockerCutomImage';
import { ImagePartnerApp } from '@/types/orderFunnel';
import PartnerImageSelect from '../partner-image/PartnerImageSelect.component';

interface AppImageSelectProps {
  appImages: ImagePartnerApp[];
  value: string;
  version?: string;
  onChange: (
    newImage: string,
    newVersion?: string,
    contractChecked?: boolean,
  ) => void;
  className?: string;
}

const AppImagesSelect = React.forwardRef<HTMLInputElement, AppImageSelectProps>(
  ({ appImages, value, version, onChange, className }, ref) => {
    const { t } = useTranslation('ai-tools/components/app-image');
    return (
      <Tabs defaultValue="customerImage">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customerImage" data-testid="custom-image-trigger">
            {t('customImageTabsLabel')}
          </TabsTrigger>
          <TabsTrigger value="partnerImage" data-testid="partner-image-trigger">
            {t('partnerAppTabsLabel')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="customerImage">
          <DockerCustomImageInput value={value} onChange={onChange} ref={ref} />
        </TabsContent>
        <TabsContent value="partnerImage">
          <PartnerImageSelect
            value={value}
            version={version}
            images={appImages}
            className={className}
            onChange={onChange}
            ref={ref}
          />
        </TabsContent>
      </Tabs>
    );
  },
);
AppImagesSelect.displayName = 'AppImagesSelect';
export default AppImagesSelect;
