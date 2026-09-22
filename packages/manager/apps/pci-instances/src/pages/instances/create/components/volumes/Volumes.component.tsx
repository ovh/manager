import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, BADGE_COLOR, BADGE_SIZE, Text } from '@ovhcloud/ods-react';
import { useBytes } from '@ovh-ux/manager-pci-common';
import { useCatalogPrice } from '@ovh-ux/muk';
import { convertHourlyPriceToMonthly } from '@/utils';
import { TDiskViewModel } from '../../view-models/mappers/diskMapper';
import {
  diskCapacityInBytes,
  selectLocalDisks,
  toDiskCount,
} from '../../view-models/volumesViewModel';

const mutedTextClass = 'text-[--ods-color-neutral-500]';

type TVolumesProps = {
  disks: TDiskViewModel[];
  hourlyPrice: number | null;
};

export const Volumes: FC<TVolumesProps> = ({ disks, hourlyPrice }) => {
  const { t } = useTranslation('creation');
  const { formatBytes } = useBytes();
  const { getTextPrice: getHourlyTextPrice } = useCatalogPrice(4, {
    exclVat: true,
  });
  const { getTextPrice: getMonthlyTextPrice } = useCatalogPrice(2, {
    exclVat: true,
  });

  const localDisks = selectLocalDisks(disks);

  if (localDisks.length === 0) return null;

  const capacityLabel = (disk: TDiskViewModel) => {
    const diskCount = toDiskCount(disk.number);
    const capacity = formatBytes(diskCapacityInBytes(disk), 0, 1000);
    const size = diskCount > 1 ? `${diskCount}x ${capacity}` : capacity;

    return disk.interface
      ? t('pci_instance_creation_volumes_local_capacity', {
          size,
          technology: disk.interface,
        })
      : size;
  };

  const monthlyPrice =
    hourlyPrice === null ? null : convertHourlyPriceToMonthly(hourlyPrice);

  return (
    <section className="mt-8" data-testid="volumes">
      <Text className="mb-4 block" preset="heading-3">
        {t('pci_instance_creation_volumes_title')}
      </Text>

      <div className="flex flex-col gap-4">
        {localDisks.map((disk) => (
          <div
            key={disk.id}
            className="flex items-center justify-between gap-6 rounded-md border border-solid border-[--ods-color-neutral-200] px-6 py-5"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Text className="font-bold">
                  {t('pci_instance_creation_volumes_local_name')}
                </Text>
                <Badge color={BADGE_COLOR.information} size={BADGE_SIZE.sm}>
                  {t('pci_instance_creation_volumes_system_badge')}
                </Badge>
              </div>
              <Text className="block">{capacityLabel(disk)}</Text>
            </div>

            <div className="text-right">
              {hourlyPrice !== null && monthlyPrice !== null && (
                <>
                  <Text className="block">
                    <span className="font-bold">
                      {getHourlyTextPrice(hourlyPrice)}
                    </span>{' '}
                    {t('pci_instance_creation_volumes_price_per_hour')}
                  </Text>
                  <Text className={`block ${mutedTextClass}`}>
                    {`~${getMonthlyTextPrice(monthlyPrice)} ${t(
                      'pci_instance_creation_volumes_price_per_month',
                    )}`}
                  </Text>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
