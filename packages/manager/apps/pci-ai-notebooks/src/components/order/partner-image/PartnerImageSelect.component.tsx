import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRightFromSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import RadioTile from '@/components/radio-tile/RadioTile.component';
import A from '@/components/links/A.component';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImagePartnerApp } from '@/types/orderFunnel';
import ParnterOrderPrice from '../price/OrderPricePartner.component';
import ImageVersionSelector from './PartnerImageVersion.component';

interface PartnerImageSelectProps {
  images: ImagePartnerApp[];
  value: string;
  onChange: (newImage: string, newVersion?: string) => void;
  version?: string;
  className?: string;
}

const PartnerImageSelect = React.forwardRef<
  HTMLInputElement,
  PartnerImageSelectProps
>(({ images, value, onChange, version, className }, ref) => {
  const { t } = useTranslation('components/partner-image');
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('partnerImageTitle')}</CardTitle>
        <p className="pt-4">{t('partnerImageDesc')}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <div
          data-testid="images-select-container"
          ref={ref}
          className={cn('grid grid-cols-1 md:grid-cols-2 gap-2', className)}
        >
          {images.map((image) => (
            <RadioTile
              data-testid={`image-radio-tile-${image.id}`}
              name="image-select"
              key={image.id}
              onChange={() => {
                onChange(image.id, image.versions[0]);
              }}
              value={image.id}
              checked={image.id === value}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h5
                      className={`capitalize ${
                        image.id === value ? 'font-bold' : 'font-normal'
                      }`}
                    >
                      {image.name}
                    </h5>
                    <p
                      className={`capitalize ${
                        image.id === value ? 'font-bold' : 'font-normal'
                      }`}
                    >
                      {image.partnerName}
                    </p>
                  </div>
                  {image.logoUrl && (
                    <img
                      className="block w-[40px] h-[40px]"
                      src={image.logoUrl}
                      alt={image.name}
                    />
                  )}
                </div>
                <RadioTile.Separator />
                <ImageVersionSelector
                  versions={image.versions}
                  selectedVersion={
                    image.id === value
                      ? image.versions.find((v: string) => v === version)
                      : image.versions[0]
                  }
                  isImageSelected={image.id === value}
                  onChange={(versionName) => onChange(image.id, versionName)}
                />
                <RadioTile.Separator />
                <div className="text-xs">
                  <p className="mb-2">{image.description}</p>
                  <A
                    href={image.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('documentationLinkLabel')}
                    <ArrowUpRightFromSquare className="size-4 inline ml-1" />
                  </A>
                </div>
              </div>
              <RadioTile.Separator />
              <div>
                {image.pricingCpu && (
                  <ParnterOrderPrice
                    isCpu={true}
                    licencingType={image.licensing}
                    minuteConverter={60}
                    price={image.pricingCpu}
                    quantity={1}
                  />
                )}
                {image.pricingGpu && (
                  <ParnterOrderPrice
                    isCpu={false}
                    licencingType={image.licensing}
                    minuteConverter={60}
                    price={image.pricingGpu}
                    quantity={1}
                  />
                )}
              </div>
            </RadioTile>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

export default PartnerImageSelect;
