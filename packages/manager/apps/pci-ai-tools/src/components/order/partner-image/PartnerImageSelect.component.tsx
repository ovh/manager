import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
} from '@datatr-ux/uxlib';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { ArrowUpRightFromSquare, ExternalLink } from 'lucide-react';
import A from '@/components/links/A.component';
import { cn } from '@/lib/utils';
import RadioTile from '@/components/radio-tile/RadioTile.component';
import { ImagePartnerApp } from '@/types/orderFunnel';
import ParnterOrderPrice from '../price/OrderPricePartner.component';
import ImageVersionSelector from './PartnerImageVersion.component';
import { useLocale } from '@/hooks/useLocale';
import ai from '@/types/AI';

interface PartnerImageSelectProps {
  images: ImagePartnerApp[];
  value: string;
  onChange: (
    newImage: string,
    newVersion?: string,
    contractChecked?: boolean,
  ) => void;
  version?: string;
  className?: string;
}

const PartnerImageSelect = React.forwardRef<
  HTMLInputElement,
  PartnerImageSelectProps
>(({ images, value, onChange, version, className }, ref) => {
  const { t } = useTranslation('ai-tools/components/partner-image');
  const [contract, setContract] = useState<ai.partner.Contract>();
  const [isChecked, setIsChecked] = useState(false);

  const locale = useLocale();
  useEffect(() => {
    if (!value) return;
    setIsChecked(!!images.find((im) => im.id === value)?.contract?.signedAt);
    setContract(images.find((im) => im.id === value)?.contract);
  }, [value, images]);

  return (
    <Card data-testid="partner-image-select">
      <CardHeader>
        <CardTitle>{t('partnerImageTitle')}</CardTitle>
        <p className="pt-4">{t('partnerImageDesc')}</p>
      </CardHeader>
      <CardContent ref={ref} className="space-y-2">
        <div
          data-testid="images-select-container"
          className={cn('grid grid-cols-1 md:grid-cols-2 gap-2', className)}
        >
          {images.map((image) => (
            <RadioTile
              data-testid={`image-radio-tile-${image.id}`}
              name="image-select"
              key={image.id}
              onChange={() => {
                onChange(
                  image.id,
                  image.versions[0],
                  !!image?.contract?.signedAt,
                );
              }}
              value={image.id}
              checked={image.id === value}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span
                      className={`text-lg capitalize ${
                        image.id === value ? 'font-bold' : 'font-normal'
                      }`}
                    >
                      {image.name}
                    </span>
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
                  onChange={(versionName) =>
                    onChange(image.id, versionName, isChecked)
                  }
                />
                <RadioTile.Separator />
                <div className="text-sm">
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
      <CardContent>
        {value && (
          <div>
            <div className="flex flex-row items-center gap-2">
              <Checkbox
                data-testid="contract-checkbox"
                checked={isChecked}
                disabled={isChecked && !!contract.signedAt}
                onCheckedChange={() => {
                  setIsChecked(!isChecked);
                  onChange(value, version, !isChecked);
                }}
              />
              <p
                className={`${
                  contract?.signedAt ? 'font-bold' : 'font-normal'
                }`}
              >
                {!contract?.signedAt
                  ? t('partnerContractSignedOff')
                  : t('partnerContractSignedOn', {
                      signedDate: format(contract.signedAt, 'dd MMM yyyy'),
                    })}
              </p>
            </div>
            <A
              href={contract?.termsOfService[locale].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="inline-flex items-center gap-2">
                <span>{t('partnerConditionLink')}</span>
                <ExternalLink className="size-4" />
              </div>
            </A>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default PartnerImageSelect;
