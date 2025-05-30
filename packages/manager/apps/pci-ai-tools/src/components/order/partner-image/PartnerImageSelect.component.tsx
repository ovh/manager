import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  Checkbox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioTile,
  Separator,
} from '@datatr-ux/uxlib';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpRightFromSquare,
  Check,
  ChevronsUpDown,
  ExternalLink,
} from 'lucide-react';
import A from '@/components/links/A.component';
import { ImagePartnerApp } from '@/types/orderFunnel';
import ParnterOrderPrice from '../price/OrderPricePartner.component';
import { useLocale } from '@/hooks/useLocale';
import ai from '@/types/AI';
import { cn } from '@/lib/utils';

interface PartnerImageSelectProps {
  images: ImagePartnerApp[];
  value: string;
  onChange: (
    newImage: string,
    newVersion?: string,
    contractChecked?: boolean,
  ) => void;
  version?: string;
}

const PartnerImageSelect = React.forwardRef<
  HTMLInputElement,
  PartnerImageSelectProps
>(({ images, value, onChange, version }, ref) => {
  const { t } = useTranslation('ai-tools/components/partner-image');
  const [contract, setContract] = useState<ai.partner.Contract>();
  const [isChecked, setIsChecked] = useState(false);
  const [openVersionCb, setOpenVersionCb] = useState(false);

  const locale = useLocale();
  useEffect(() => {
    setIsChecked(!!images.find((im) => im.id === value)?.contract?.signedAt);
    setContract(images.find((im) => im.id === value)?.contract);
  }, [value, images]);

  return (
    <Card data-testid="partner-image-select">
      <CardHeader>
        <h5>{t('partnerImageTitle')}</h5>
      </CardHeader>
      <CardContent ref={ref} className="space-y-2">
        <CardDescription>{t('partnerImageDesc')}</CardDescription>
        <RadioGroup
          data-testid="images-select-container"
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-2"
          value={value}
          onValueChange={(val) => {
            onChange(
              val,
              images.find((img) => img.id === val).versions[0],
              !!images.find((im) => im.id === val)?.contract?.signedAt,
            );
          }}
        >
          {images.map((image) => (
            <RadioTile
              data-testid={`image-radio-tile-${image.id}`}
              key={image.id}
              value={image.id}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="capitalize">{image.name}</h5>
                    <p className="capitalize">{image.partnerName}</p>
                  </div>
                  {image.logoUrl && (
                    <img
                      className="block w-[40px] h-[40px]"
                      src={image.logoUrl}
                      alt={image.name}
                    />
                  )}
                </div>
                <Separator className="my-2" />
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
              <Separator className="my-2" />
              <div className="text-sm">
                {image.pricingCpu && (
                  <ParnterOrderPrice
                    isCpu={true}
                    licencingType={image.licensing}
                    minuteConverter={60}
                    price={image.pricingCpu}
                    quantity={1}
                  />
                )}
              </div>
              <div className="text-sm">
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
        </RadioGroup>
      </CardContent>
      {images.find((img) => img.id === value)?.versions?.length > 0 && (
        <div>
          <CardContent id="partner-version">
            <CardDescription className="mb-2">
              {t('partnerImageVersionDesc')}
            </CardDescription>
            <Popover open={openVersionCb} onOpenChange={setOpenVersionCb}>
              <div data-testid="fmk-tile-version-container" className="hidden">
                {images
                  .find((img) => img.id === value)
                  .versions.map((fmkVersion) => (
                    <input
                      type="radio"
                      name="version-select"
                      value={fmkVersion}
                      key={fmkVersion}
                      readOnly
                      checked={fmkVersion === version}
                    />
                  ))}
              </div>
              <PopoverTrigger asChild>
                <Button
                  data-testid="popover-trigger-button"
                  size="sm"
                  mode="outline"
                  className="text-text"
                >
                  {version ||
                    images.find((img) => img.id === value).versions[0]}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" side="bottom">
                <Command>
                  <CommandInput placeholder={t('versionPlaceholder')} />
                  <CommandList>
                    <CommandEmpty>{t('noVersionFound')}</CommandEmpty>
                    <CommandGroup>
                      {images
                        .find((img) => img.id === value)
                        .versions.map((fmkVersion) => (
                          <CommandItem
                            key={fmkVersion}
                            value={fmkVersion}
                            onSelect={(vers) => {
                              onChange(value, vers, isChecked);
                              setOpenVersionCb(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                fmkVersion === version
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            <span className="w-full cursor-pointer overflow-hidden">
                              {fmkVersion}
                            </span>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </CardContent>
          <CardContent>
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
          </CardContent>
        </div>
      )}
    </Card>
  );
});

export default PartnerImageSelect;
