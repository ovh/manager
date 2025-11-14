import { useTranslation } from 'react-i18next';
import {
  RadioGroup,
  RadioGroupItem,
  Label,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@datatr-ux/uxlib';
import { ExternalLink, HelpCircle } from 'lucide-react';
import storages from '@/types/Storages';
import A from '../links/A.component';
import { GUIDES, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';

interface StorageClassSelectorProps {
  storageClass: storages.StorageClassEnum;
  onStorageClassChange: (storageClass: storages.StorageClassEnum) => void;
  availableStorageClasses: storages.StorageClassEnum[];
  disabled?: boolean;
}

const StorageClassSelector = ({
  storageClass,
  onStorageClassChange,
  availableStorageClasses,
  disabled = false,
}: StorageClassSelectorProps) => {
  const { t } = useTranslation('components/file-uploader');
  const locale = useLocale();
  const { t: tObj } = useTranslation(
    'pci-object-storage/storages/s3/object-class',
  );

  return (
    <div className="my-4 space-y-2">
      <div className="flex flex-row items-center gap-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {t('storageClassLabel')}
        </label>
        <Popover>
          <PopoverTrigger>
            <HelpCircle className="size-4" />
          </PopoverTrigger>
          <PopoverContent>
            <div className="text-sm">
              <p>{t('popOverDesc1')}</p>
              <div className="flex flex-col px-2">
                <A
                  href={getGuideUrl(GUIDES.OBJ_STO_CLASSES, locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="inline-flex items-center gap-2">
                    <span className="text-primary-500">
                      {t('popOverDesc2')}
                    </span>
                    <ExternalLink className="size-3" />
                  </div>
                </A>
                <A
                  href={getGuideUrl(GUIDES.OBJ_STO_PRICES, locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="inline-flex items-center gap-2">
                    <span className="text-primary-500">
                      {t('popOverDesc3')}
                    </span>
                    <ExternalLink className="size-3" />
                  </div>
                </A>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <RadioGroup
        className="px-2"
        aria-labelledby="storage-class-radio"
        value={storageClass}
        onValueChange={onStorageClassChange}
        disabled={disabled}
      >
        {availableStorageClasses.map(
          (storeClass: storages.StorageClassEnum) => (
            <div key={storeClass} className="flex items-center gap-3">
              <RadioGroupItem value={storeClass} id={storeClass} />
              <Label htmlFor={storeClass}>
                {tObj(`objectClass_${storeClass}`)}
              </Label>
            </div>
          ),
        )}
      </RadioGroup>
    </div>
  );
};

export default StorageClassSelector;
