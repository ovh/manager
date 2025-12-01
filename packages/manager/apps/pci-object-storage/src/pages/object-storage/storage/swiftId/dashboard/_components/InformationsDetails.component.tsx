import { useTranslation } from 'react-i18next';
import { Region } from '@datatr-ux/ovhcloud-types/cloud/index';
import { Clipboard, useToast } from '@datatr-ux/uxlib';
import storages from '@/types/Storages';
import { useLocaleBytesConverter } from '@/hooks/useLocaleByteConverter.hook';

interface InformationsDetailsProps {
  swift: storages.ContainerDetail;
  region: Region;
  swiftId: string;
}

const InformationsDetails = ({
  swiftId,
  swift,
  region,
}: InformationsDetailsProps) => {
  const localeBytesConverter = useLocaleBytesConverter();
  const { t } = useTranslation('pci-object-storage/storages/swift');
  const toast = useToast();
  const onCopy = () => toast.toast({ title: t('copyLabel') });

  return (
    <div data-testid="swift-container" className="space-y-2">
      <div className="space-y-2">
        <h5>{t('endpointRegionTableHeader')}</h5>
        <Clipboard
          value={`${
            region.services.find((s) => s.name === 'storage').endpoint
          }/${swiftId}`}
          onCopy={onCopy}
        />
      </div>
      <div className="space-y-2">
        <h5>{t('cnameTableHeader')}</h5>
        <Clipboard value={swift.staticUrl} onCopy={onCopy} />
      </div>
      <div className="space-y-2">
        <h5>{t('spaceUsedTableHeader')}</h5>
        <p>{localeBytesConverter(swift.storedBytes, true, 2)}</p>
      </div>
    </div>
  );
};

export default InformationsDetails;
