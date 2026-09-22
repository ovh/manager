import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, BADGE_SIZE, Badge, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { useBytes } from '@ovh-ux/manager-pci-common';

import { TLocalStorageDisk } from '@/helpers/flavor-storage';
import { TNodeLocalStoragePrice } from '@/hooks/useNodeLocalStorage';

export type LocalStorageProps = {
  disks: TLocalStorageDisk[];
  price: TNodeLocalStoragePrice | null;
};

const mutedTextClass = 'text-[--ods-color-neutral-500]';

export default function LocalStorage({ disks, price }: Readonly<LocalStorageProps>) {
  const { t } = useTranslation('add-form');
  const { formatBytes } = useBytes();

  if (!disks.length) return null;

  const capacityLabel = (disk: TLocalStorageDisk) => {
    const capacity = formatBytes(disk.capacityInBytes, 0);
    const size = disk.count > 1 ? `${disk.count}x ${capacity}` : capacity;

    return disk.technology
      ? t('kube_common_node_pool_volumes_local_capacity', {
          size,
          technology: disk.technology,
        })
      : size;
  };

  return (
    <section className="mt-8 max-w-5xl" data-testid="local-storage">
      <Text className="mb-4 block" preset={TEXT_PRESET.heading4}>
        {t('kube_common_node_pool_volumes_title')}
      </Text>

      <div className="flex w-1/2 flex-col gap-4">
        {disks.map((disk) => (
          <div
            key={disk.id}
            className="flex items-center justify-between gap-6 rounded-md border border-solid border-[--ods-color-neutral-200] px-6 py-5"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Text className="font-bold">{t('kube_common_node_pool_volumes_local_name')}</Text>
                <Badge color={BADGE_COLOR.information} size={BADGE_SIZE.sm}>
                  {t('kube_common_node_pool_volumes_system_badge')}
                </Badge>
              </div>
              <Text className="block">{capacityLabel(disk)}</Text>
            </div>

            <div className="text-right">
              {price && (
                <>
                  <Text className="block">
                    <span className="font-bold">{price.hourText}</span>{' '}
                    {t('kube_common_node_pool_volumes_price_per_hour')}
                  </Text>
                  <Text className={`block ${mutedTextClass}`}>
                    {`~${price.monthText} ${t('kube_common_node_pool_volumes_price_per_month')}`}
                  </Text>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
