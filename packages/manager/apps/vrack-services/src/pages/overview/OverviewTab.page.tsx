import React from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { CARD_COLOR, Card, SPINNER_SIZE, Spinner, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES as COMMON_TRANSLATION_NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useVrackService } from '@ovh-ux/manager-network-common';
import { Error, Tile, useFormatDate } from '@ovh-ux/muk';

import { DisplayName } from '@/components/display-name/DisplayName.component';
import { ProductStatusChip } from '@/components/product-status-chip/ProductStatusChip.component';
import { VrackId } from '@/components/vrack-id/VrackId.component';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export default function OverviewTab() {
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.dashboard,
    COMMON_TRANSLATION_NAMESPACES.REGION,
  ]);
  const { data: vrackServices, error, isLoading } = useVrackService();
  const formatDate = useFormatDate();

  return error ? (
    <Error error={error} />
  ) : (
    <>
      <div className="grid py-6 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <div className="p-3">
          {isLoading ? (
            <Card className="size-full justify-center" color={CARD_COLOR.neutral}>
              <Spinner size={SPINNER_SIZE.md} />
            </Card>
          ) : (
            <Tile.Root title={t('tileTitle')}>
              <Tile.Item.Root>
                <Tile.Item.Term label={t('displayName')} />
                <Tile.Item.Description>
                  {vrackServices && <DisplayName {...vrackServices} />}
                </Tile.Item.Description>
              </Tile.Item.Root>
              <Tile.Item.Root>
                <Tile.Item.Term label={t('productStatus')} />
                <Tile.Item.Description>
                  {vrackServices?.currentState?.productStatus && (
                    <ProductStatusChip productStatus={vrackServices.currentState.productStatus} />
                  )}
                </Tile.Item.Description>
              </Tile.Item.Root>
              <Tile.Item.Root>
                <Tile.Item.Term label={t('region')} />
                <Tile.Item.Description>
                  <Text preset={TEXT_PRESET.paragraph}>
                    <Text>
                      {t(`region_${vrackServices?.currentState?.region?.toLowerCase() || ''}`)}
                    </Text>
                    <div>{vrackServices?.currentState?.region || ''}</div>
                  </Text>
                </Tile.Item.Description>
              </Tile.Item.Root>
              <Tile.Item.Root>
                <Tile.Item.Term label={t('vrackId')} />
                <Tile.Item.Description>
                  {vrackServices && <VrackId {...vrackServices} />}
                </Tile.Item.Description>
              </Tile.Item.Root>
              <Tile.Item.Root>
                <Tile.Item.Term label={t('createdAt')} />
                <Tile.Item.Description divider={false}>
                  <Text preset={TEXT_PRESET.paragraph}>
                    {formatDate({
                      date: vrackServices?.createdAt,
                    })}
                  </Text>
                </Tile.Item.Description>
              </Tile.Item.Root>
            </Tile.Root>
          )}
        </div>
      </div>
      <React.Suspense>
        <Outlet />
      </React.Suspense>
    </>
  );
}
