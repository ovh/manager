import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Region } from '@datatr-ux/ovhcloud-types/cloud';
import { Button, Clipboard, useToast } from '@datatr-ux/uxlib';
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
  const navigate = useNavigate();
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
      <Button
        data-testid="swift-container-delete-button"
        variant="critical"
        mode="outline"
        className="mt-4"
        onClick={() => navigate('./delete')}
      >
        {t('deleteSwiftButton')}
      </Button>
    </div>
  );
};

export default InformationsDetails;
