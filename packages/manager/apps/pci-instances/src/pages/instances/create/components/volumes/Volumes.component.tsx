import { FC, Fragment } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Badge,
  BADGE_COLOR,
  BADGE_SIZE,
  Icon,
  ICON_NAME,
  Message,
  MessageBody,
  MessageIcon,
  Text,
} from '@ovhcloud/ods-react';
import { useBytes } from '@ovh-ux/manager-pci-common';
import { useCatalogPrice } from '@ovh-ux/muk';
import { convertHourlyPriceToMonthly } from '@/utils';
import { TDiskViewModel } from '../../view-models/mappers/diskMapper';
import {
  diskCapacityInBytes,
  selectLocalDisks,
  toDiskCount,
} from '../../view-models/volumesViewModel';

const columnHeaderClass =
  'text-xs font-bold uppercase tracking-wider text-[--ods-color-neutral-600]';
const mutedTextClass = 'text-[--ods-color-neutral-500]';

type TVolumesProps = {
  flavorName: string;
  disks: TDiskViewModel[];
  hourlyPrice: number | null;
};

export const Volumes: FC<TVolumesProps> = ({
  flavorName,
  disks,
  hourlyPrice,
}) => {
  const { t } = useTranslation('creation');
  const { formatBytes } = useBytes();
  const { getTextPrice: getHourlyTextPrice } = useCatalogPrice(4, {
    exclVat: true,
  });
  const { getTextPrice: getMonthlyTextPrice } = useCatalogPrice(2, {
    exclVat: true,
  });

  const localDisks = selectLocalDisks(disks);
  const [systemDisk] = localDisks;

  if (!systemDisk) return null;

  const formatCapacity = (disk: TDiskViewModel) =>
    formatBytes(diskCapacityInBytes(disk), 0, 1000);

  const monthlyPrice =
    hourlyPrice === null ? null : convertHourlyPriceToMonthly(hourlyPrice);

  return (
    <section className="mt-8" data-testid="volumes">
      <Text className="mb-4 block" preset="heading-3">
        {t('pci_instance_creation_volumes_title')}
      </Text>

      <Text className="mb-6 block">
        {t('pci_instance_creation_volumes_description')}
      </Text>

      <Message className="mb-6" color="information" dismissible={false}>
        <MessageIcon name={ICON_NAME.circleInfo} />
        <MessageBody>
          <Trans
            ns="creation"
            i18nKey="pci_instance_creation_volumes_system_notice"
            values={{ size: formatCapacity(systemDisk) }}
            components={{ strong: <strong /> }}
          />
        </MessageBody>
      </Message>

      <div className="grid grid-cols-[1fr_max-content_max-content] items-center gap-x-10">
        <span className={columnHeaderClass}>
          {t('pci_instance_creation_volumes_column_storage')}
        </span>
        <span className={columnHeaderClass}>
          {t('pci_instance_creation_volumes_column_size')}
        </span>
        <span />

        <hr className="col-span-3 my-4 h-px border-0 bg-[--ods-color-neutral-200]" />

        {localDisks.map((disk) => (
          <Fragment key={disk.id}>
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[--ods-color-primary-050] text-[--ods-color-primary-600]">
                <Icon aria-hidden="true" name={ICON_NAME.disk} />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Text className="font-bold">
                    {t('pci_instance_creation_volumes_local_name')}
                  </Text>
                  <Badge color={BADGE_COLOR.information} size={BADGE_SIZE.sm}>
                    {t('pci_instance_creation_volumes_system_badge')}
                  </Badge>
                </div>
                <Text className="block">{flavorName}</Text>
                {disk.interface && (
                  <Text className={`block ${mutedTextClass}`}>
                    {t('pci_instance_creation_volumes_local_spec', {
                      technology: disk.interface,
                    })}
                  </Text>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Text className="font-bold">
                {toDiskCount(disk.number) > 1
                  ? `${toDiskCount(disk.number)}x ${formatCapacity(disk)}`
                  : formatCapacity(disk)}
              </Text>
              <Icon
                aria-label={t('pci_instance_creation_volumes_size_locked')}
                name={ICON_NAME.lockClose}
              />
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
          </Fragment>
        ))}
      </div>
    </section>
  );
};
