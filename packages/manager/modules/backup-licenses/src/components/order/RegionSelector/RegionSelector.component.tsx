import React, { useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';

import RegionCard from '@/components/order/RegionCard/RegionCard.component';
import { useLocations } from '@/data/hooks/useLocations/useLocations';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { Location } from '@/types/Location.type';

/** Nombre de cartes visibles avant le « voir plus » (progressive disclosure). */
const COLLAPSED_COUNT = 3;

const GRID_CLASS = 'grid grid-cols-2 gap-6 sm:grid-cols-3';

interface RegionSelectorProps {
  selected: string | null;
  isDisabled?: boolean;
  onSelect: (locationName: string) => void;
}

/** Sous-bloc 3 de l'étape 3 : localisation du Vault, catalogue en dur (BKP-1223). */
export default function RegionSelector({
  selected,
  isDisabled = false,
  onSelect,
}: RegionSelectorProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);
  const locations = useLocations();
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleLocations = useMemo<Location[]>(() => {
    if (isExpanded) return locations;
    const collapsed = locations.slice(0, COLLAPSED_COUNT);
    // La localisation choisie reste visible même repliée, sinon le choix semble perdu.
    const selectedLocation = locations.find(({ name }) => name === selected);
    return selectedLocation && !collapsed.includes(selectedLocation)
      ? [...collapsed, selectedLocation]
      : collapsed;
  }, [isExpanded, locations, selected]);

  const hiddenCount = locations.length - visibleLocations.length;

  return (
    <div>
      <OdsText preset={ODS_TEXT_PRESET.heading5} className="block">
        {t('region.section_title')}
      </OdsText>
      <OdsText
        preset={ODS_TEXT_PRESET.caption}
        className="mb-6 block [--ods-color-text:var(--ods-color-neutral-600)]"
      >
        {t('region.section_subtitle')}
      </OdsText>

      <div role="radiogroup" aria-label={t('region.section_title')} className={GRID_CLASS}>
        {visibleLocations.map((location) => (
          <RegionCard
            key={location.name}
            location={location}
            selected={selected === location.name}
            disabled={isDisabled}
            onSelect={() => onSelect(location.name)}
          />
        ))}
      </div>
      {(isExpanded || hiddenCount > 0) && (
        <OdsButton
          type="button"
          className="mt-6"
          isDisabled={isDisabled}
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_BUTTON_COLOR.primary}
          icon={isExpanded ? ODS_ICON_NAME.chevronUp : ODS_ICON_NAME.chevronDown}
          label={isExpanded ? t('region.show_less') : t('region.show_more', { total: hiddenCount })}
          onClick={() => setIsExpanded((expanded) => !expanded)}
        />
      )}
    </div>
  );
}
