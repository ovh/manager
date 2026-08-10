import { Fragment } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import {
  BADGE_COLOR,
  BADGE_SIZE,
  Badge,
  ICON_NAME,
  Icon,
  Message,
  MessageBody,
  MessageIcon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { useBytes } from '@ovh-ux/manager-pci-common';

import { TLocalStorageDisk } from '@/helpers/flavor-storage';
import { TNodeLocalStoragePrice } from '@/hooks/useNodeLocalStorage';

export type LocalStorageProps = {
  flavorName: string;
  disks: TLocalStorageDisk[];
  price: TNodeLocalStoragePrice | null;
};

const columnHeaderClass =
  'text-xs font-bold uppercase tracking-wider text-[--ods-color-neutral-600]';
const mutedTextClass = 'text-[--ods-color-neutral-500]';

export default function LocalStorage({ flavorName, disks, price }: Readonly<LocalStorageProps>) {
  const { t } = useTranslation('add-form');
  const { formatBytes } = useBytes();

  if (!disks.length) return null;

  const formatCapacity = (disk: TLocalStorageDisk) => formatBytes(disk.capacityInBytes, 0);

  return (
    <section className="mt-8 max-w-5xl" data-testid="local-storage">
      <Text className="mb-4 block" preset={TEXT_PRESET.heading4}>
        {t('kube_common_node_pool_volumes_title')}
      </Text>

      <Text className="mb-6 block">{t('kube_common_node_pool_volumes_description')}</Text>

      <Message className="mb-6" color="information" dismissible={false}>
        <MessageIcon name={ICON_NAME.circleInfo} />
        <MessageBody>
          <Trans
            ns="add-form"
            i18nKey="kube_common_node_pool_volumes_system_notice"
            values={{ size: formatCapacity(disks[0]) }}
            components={{ strong: <strong /> }}
          />
        </MessageBody>
      </Message>

      <div className="grid grid-cols-[1fr_max-content_max-content] items-center gap-x-10">
        <span className={columnHeaderClass}>
          {t('kube_common_node_pool_volumes_column_storage')}
        </span>
        <span className={columnHeaderClass}>{t('kube_common_node_pool_volumes_column_size')}</span>
        <span />

        <hr className="col-span-3 my-4 h-px border-0 bg-[--ods-color-neutral-200]" />

        {disks.map((disk) => (
          <Fragment key={disk.id}>
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[--ods-color-primary-050] text-[--ods-color-primary-600]">
                <Icon aria-hidden="true" name={ICON_NAME.disk} />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Text className="font-bold">{t('kube_common_node_pool_volumes_local_name')}</Text>
                  <Badge color={BADGE_COLOR.information} size={BADGE_SIZE.sm}>
                    {t('kube_common_node_pool_volumes_system_badge')}
                  </Badge>
                </div>
                <Text className="block">{flavorName}</Text>
                <Text className={`block ${mutedTextClass}`}>
                  {t('kube_common_node_pool_volumes_local_spec', {
                    technology: disk.technology,
                  })}
                </Text>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Text className="font-bold">
                {disk.count > 1 ? `${disk.count}x ${formatCapacity(disk)}` : formatCapacity(disk)}
              </Text>
              <Icon
                aria-label={t('kube_common_node_pool_volumes_size_locked')}
                name={ICON_NAME.lockClose}
              />
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
          </Fragment>
        ))}
      </div>
    </section>
  );
}
