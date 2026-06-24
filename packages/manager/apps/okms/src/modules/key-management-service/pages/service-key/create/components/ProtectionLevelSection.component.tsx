import React, { useEffect } from 'react';

import { OkmsServiceKeyProtectionLevel } from '@key-management-service/types/okmsServiceKey.type';
import { OkmsServiceKeyReference } from '@key-management-service/types/okmsServiceKeyReference.type';
import { useTranslation } from 'react-i18next';

import { Message, Skeleton, Text } from '@ovhcloud/ods-react';

import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';

import { PriceTilePrice } from '@/common/components/price-tile/PriceTilePrice';
import { RadioCard } from '@/common/components/radio-card/RadioCard.component';
import { useOrderCatalogOkms } from '@/common/data/hooks/useOrderCatalogOkms';

import {
  PROTECTION_LEVEL_FEATURE_FLAGS,
  buildProtectionLevelCards,
  collectAvailableProtectionLevels,
  getDefaultProtectionLevel,
  isProtectionLevel,
} from '../utils/protectionLevelCards';

export type ProtectionLevelSectionProps = {
  references: OkmsServiceKeyReference[];
  protectionLevel: OkmsServiceKeyProtectionLevel | undefined;
  setProtectionLevel: (protectionLevel: OkmsServiceKeyProtectionLevel) => void;
};

export const ProtectionLevelSection = ({
  references,
  protectionLevel,
  setProtectionLevel,
}: ProtectionLevelSectionProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { t: tCommon } = useTranslation('common');

  const { data: catalog, isPending, isError } = useOrderCatalogOkms();
  const { data: features } = useFeatureAvailability(PROTECTION_LEVEL_FEATURE_FLAGS);

  const availableLevels = collectAvailableProtectionLevels(references);

  // Each card is gated by its own flag (no flag = always visible); the reference still
  // decides whether it is enabled or disabled.
  const cards = buildProtectionLevelCards(catalog?.addons, availableLevels).filter(
    (card) => !card.config.featureFlag || features?.[card.config.featureFlag] === true,
  );

  const defaultLevel = getDefaultProtectionLevel(references);

  useEffect(() => {
    if (!protectionLevel && defaultLevel) {
      setProtectionLevel(defaultLevel);
    }
  }, [protectionLevel, defaultLevel, setProtectionLevel]);

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <Text preset="heading-3">
        {t('key_management_service_service-keys_create_protection_level_title')}
      </Text>
      <Text preset="paragraph">
        {t('key_management_service_service-keys_create_protection_level_subtitle')}
      </Text>
      {isPending ? (
        <Skeleton className="h-32 w-full" />
      ) : isError || cards.length === 0 ? (
        <Message color="critical" dismissible={false}>
          {tCommon('error_fetching_data')}
        </Message>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {cards.map(({ config, disabled }) => (
            <RadioCard
              key={config.value}
              id={config.value}
              name="protectionLevel"
              selected={protectionLevel}
              isDisabled={disabled}
              title={t(config.titleKey)}
              subTitle={t(config.subtitleKey)}
              onChange={(event) => {
                if (isProtectionLevel(event.target.value)) {
                  setProtectionLevel(event.target.value);
                }
              }}
            >
              {disabled ? (
                <Text preset="heading-6" className="text-[--ods-color-primary-500]">
                  {t('key_management_service_service-keys_create_protection_level_coming_soon')}
                </Text>
              ) : (
                <PriceTilePrice productCode={config.productCode} />
              )}
            </RadioCard>
          ))}
        </div>
      )}
    </div>
  );
};
