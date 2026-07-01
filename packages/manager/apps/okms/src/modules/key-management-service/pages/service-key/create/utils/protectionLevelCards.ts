import {
  OKMS_SERVICE_KEY_PROTECTION_LEVELS,
  OkmsServiceKeyProtectionLevel,
} from '@key-management-service/types/okmsServiceKey.type';
import { OkmsServiceKeyReference } from '@key-management-service/types/okmsServiceKeyReference.type';

import { PricingProductCode } from '@/common/components/price-tile/pricingTile.type';
import { OKMS_ADDON_PLAN_CODES } from '@/common/components/price-tile/useOkmsPricing';
import { KMS_FEATURES } from '@/common/utils/feature-availability/feature-availability.constants';

export type ProtectionLevelCardConfig = {
  value: OkmsServiceKeyProtectionLevel;
  titleKey: string;
  subtitleKey: string;
  productCode: PricingProductCode;
  // Feature-availability flag gating this card's visibility. Undefined = always visible.
  featureFlag?: string;
};

export type ProtectionLevelCard = {
  config: ProtectionLevelCardConfig;
  disabled: boolean;
};

// Catalog addon → card mapping. Add a row when the BE exposes a new addon (e.g. a future
// managed-hsm plan) and keep parity with the values in OKMS_SERVICE_KEY_PROTECTION_LEVELS.
const SERVICE_KEY_ADDON_TO_CARD: Record<string, ProtectionLevelCardConfig> = {
  [OKMS_ADDON_PLAN_CODES.servicekey]: {
    value: 'SOFTWARE',
    titleKey: 'key_management_service_service-keys_create_software_protection_title',
    subtitleKey: 'key_management_service_service-keys_create_software_protection_subtitle',
    productCode: 'servicekey',
  },
  [OKMS_ADDON_PLAN_CODES['servicekey-hsm']]: {
    value: 'HSM',
    titleKey: 'key_management_service_service-keys_create_hardware_protection_title',
    subtitleKey: 'key_management_service_service-keys_create_hardware_protection_subtitle',
    productCode: 'servicekey-hsm',
    featureFlag: KMS_FEATURES.HSM,
  },
};

// Flags referenced by protection-level cards (for useFeatureAvailability); each flagged card adds its own.
export const PROTECTION_LEVEL_FEATURE_FLAGS = [
  ...new Set(
    Object.values(SERVICE_KEY_ADDON_TO_CARD)
      .map((card) => card.featureFlag)
      .filter((flag): flag is string => Boolean(flag)),
  ),
];

export const isProtectionLevel = (value: unknown): value is OkmsServiceKeyProtectionLevel =>
  typeof value === 'string' &&
  (OKMS_SERVICE_KEY_PROTECTION_LEVELS as readonly string[]).includes(value);

// All protection levels declared across the references (catalog says what's sold, the
// reference says what's actually enabled — a level missing here renders as a disabled card).
export const collectAvailableProtectionLevels = (
  references: OkmsServiceKeyReference[],
): Set<OkmsServiceKeyProtectionLevel> =>
  new Set(references.flatMap((ref) => ref.protectionLevel.map(({ value }) => value)));

export const buildProtectionLevelCards = (
  addons: Array<{ planCode: string }> | undefined,
  availableLevels: Set<OkmsServiceKeyProtectionLevel>,
): ProtectionLevelCard[] =>
  (addons ?? [])
    .map((addon) => SERVICE_KEY_ADDON_TO_CARD[addon.planCode])
    .filter((card): card is ProtectionLevelCardConfig => Boolean(card))
    .map((config) => ({ config, disabled: !availableLevels.has(config.value) }));

export const getDefaultProtectionLevel = (
  references: OkmsServiceKeyReference[],
): OkmsServiceKeyProtectionLevel | undefined =>
  references.flatMap((ref) => ref.protectionLevel).find((pl) => pl.default)?.value;
