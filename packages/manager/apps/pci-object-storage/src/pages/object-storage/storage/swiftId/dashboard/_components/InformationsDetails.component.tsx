import { useTranslation } from 'react-i18next';
import { Region } from '@datatr-ux/ovhcloud-types/cloud/index';
import { Clipboard, useToast } from '@datatr-ux/uxlib';
import storages from '@/types/Storages';
import { octetConverter } from '@/lib/bytesHelper';

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
  const { t } = useTranslation('pci-object-storage/storages/swift');
  const toast = useToast();
  const onCopy = () => toast.toast({ title: t('copyLabel') });

  return (
    <dl
      data-testid="informations-details-container"
      className="
        grid gap-x-2 gap-y-1 items-center text-sm
        grid-cols-1
        sm:grid-cols-[max-content_1fr]
      "
    >
      <dt className="font-semibold whitespace-nowrap">
        {t('spaceUsedTableHeader')}
      </dt>
      <dd>{octetConverter(swift.storedBytes, true, 2)}</dd>

      <dt className="font-semibold whitespace-nowrap">
        {t('endpointRegionTableHeader')}
      </dt>
      <dd className="min-w-0">
        <Clipboard
          value={`${
            region.services.find((s) => s.name === 'storage').endpoint
          }/${swiftId}`}
          onCopy={onCopy}
        />
      </dd>

      <dt className="font-semibold whitespace-nowrap">
        {t('cnameTableHeader')}
      </dt>
      <dd className="min-w-0">
        <Clipboard value={swift.staticUrl} onCopy={onCopy} />
      </dd>
    </dl>
  );
};

export default InformationsDetails;
