import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@datatr-ux/uxlib';
import DockerCustomImageInput from '../docker-custom-image/DockerCutomImage';
import { ImagePartnerApp } from '@/types/orderFunnel';
import PartnerImageSelect from '../partner-image/PartnerImageSelect.component';

interface AppImageSelectProps {
  appImages: ImagePartnerApp[];
  activeTab: 'customerImage' | 'partnerImage';
  onTabChange: (value: 'customerImage' | 'partnerImage') => void;
  value: string;
  version?: string;
  onChange: (
    newImage: string,
    newVersion?: string,
    contractChecked?: boolean,
  ) => void;
}

const AppImagesSelect = React.forwardRef<HTMLInputElement, AppImageSelectProps>(
  ({ appImages, activeTab, onTabChange, value, version, onChange }, ref) => {
    const { t } = useTranslation('ai-tools/components/app-image');
    return (
      <Tabs
        defaultValue="customerImage"
        onValueChange={onTabChange}
        value={activeTab}
      >
        {appImages.length > 0 && (
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="customerImage"
              data-testid="custom-image-trigger"
            >
              {t('customImageTabsLabel')}
            </TabsTrigger>
            <TabsTrigger
              value="partnerImage"
              data-testid="partner-image-trigger"
            >
              {t('partnerAppTabsLabel')}
            </TabsTrigger>
          </TabsList>
        )}
        <TabsContent value="customerImage" className="mt-0">
          <DockerCustomImageInput
            value={value}
            onChange={onChange}
            ref={ref}
            appImages={appImages}
          />
        </TabsContent>
        {appImages.length > 0 && (
          <TabsContent value="partnerImage" className="mt-0">
            <PartnerImageSelect
              value={value}
              version={version}
              images={appImages}
              onChange={onChange}
              ref={ref}
            />
          </TabsContent>
        )}
      </Tabs>
    );
  },
);
AppImagesSelect.displayName = 'AppImagesSelect';
export default AppImagesSelect;
