import { Alert, AlertDescription } from '@datatr-ux/uxlib';
import { Trans } from 'react-i18next';
import A from '@/components/links/A.component';
import { getGuideUrl, GUIDES } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import { isMinimalDurationClass } from '@/lib/s3StorageClassHelper';
import storages from '@/types/Storages';

interface StorageClassWarningMessageProps {
  storageClass: storages.StorageClassEnum;
}

export const StorageClassWarningMessage = ({
  storageClass,
}: StorageClassWarningMessageProps) => {
  const locale = useLocale();
  return (
    isMinimalDurationClass(storageClass) && (
      <Alert variant="warning" className="my-2">
        <AlertDescription>
          <Trans
            i18nKey="changeStorageClassWarningInfrequentAccess"
            ns="pci-object-storage/storages/s3/objects"
            components={[
              <A
                href={getGuideUrl(GUIDES.OBJ_STO_CLASSES, locale)}
                target="_blank"
              />,
            ]}
          />
        </AlertDescription>
      </Alert>
    )
  );
};
