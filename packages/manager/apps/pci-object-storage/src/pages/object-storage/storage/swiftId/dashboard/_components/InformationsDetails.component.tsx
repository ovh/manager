import { useTranslation } from 'react-i18next';
import { Region } from '@datatr-ux/ovhcloud-types/cloud/index';
import { Files } from 'lucide-react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  useToast,
} from '@datatr-ux/uxlib';
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

  return (
    <div data-testid="informations-details-container">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-semibold">
              {t('spaceUsedTableHeader')}
            </TableCell>
            <TableCell>
              <span>{octetConverter(swift.storedBytes, true, 2)}</span>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-semibold">
              {t('endpointRegionTableHeader')}
            </TableCell>
            <TableCell>
              <p
                className="truncate max-w-[650px] xl:max-w-none"
                title={`${
                  region.services.find((ser) => ser.name === 'storage').endpoint
                }/${swiftId}`}
              >
                {`${
                  region.services.find((ser) => ser.name === 'storage').endpoint
                }/${swiftId}`}
              </p>
            </TableCell>
            <TableCell>
              <Button
                type="button"
                className="text-text p-0 bg-transparent hover:bg-primary-100 hover:text-primary-700 hover:font-semibold h-4 w-4 my-auto"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${
                      region.services.find((ser) => ser.name === 'storage')
                        .endpoint
                    }/${swiftId}`,
                  );
                  toast.toast({
                    title: t('successCopy'),
                  });
                }}
              >
                <Files className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">
              {t('cnameTableHeader')}
            </TableCell>
            <TableCell>
              <p
                className="truncate max-w-[650px] xl:max-w-none"
                title={swift.staticUrl}
              >
                {swift.staticUrl}
              </p>
            </TableCell>
            <TableCell>
              <Button
                type="button"
                className="text-text p-0 bg-transparent hover:bg-primary-100 hover:text-primary-700 hover:font-semibold h-4 w-4 my-auto"
                onClick={() => {
                  navigator.clipboard.writeText(swift.staticUrl);
                  toast.toast({
                    title: t('successCopy'),
                  });
                }}
              >
                <Files className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default InformationsDetails;
