import React, { useState, useRef, useEffect } from 'react';
import {
  OsdsButton,
  OsdsText,
  OsdsIcon,
} from '@ovhcloud/ods-stencil/components/react/';
import {
  OdsIconName,
  OdsIconSize,
  OdsButtonVariant,
  OdsButtonType,
  OdsTextLevel,
  OdsButtonSize,
} from '@ovhcloud/ods-core';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';
import { useTranslation } from 'react-i18next';

// import './Filters.scss'; TODO
// eslint-disable-next-line
interface FiltersProps {} // TODO

const Filters: React.FC<FiltersProps> = (props) => {
  // const { filtersContent } = props;
  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation('catalog-revamp/filters');

  const universes: string[] = [];
  const categories: string[] = [];

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleTooltipToggle = (
    event: React.MouseEvent<HTMLOsdsButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    setShowFilters(!showFilters);
  };

  return (
    <>
      <OsdsButton
        size={OdsButtonSize.sm}
        type={OdsButtonType.button}
        variant={OdsButtonVariant.stroked}
        color={OdsThemeColorIntent.primary}
        onClick={handleTooltipToggle}
      >
        <OsdsIcon
          name={OdsIconName.FILTER}
          size={OdsIconSize.xxs}
          color={OdsThemeColorIntent.primary}
        />
        {t('manager_catalog_filters_button')}
      </OsdsButton>
      {showFilters && (
        <div ref={filtersRef} className="filters">
          <div className="filters-text">
            <OsdsText level={OdsTextLevel.heading}>
              {t('manager_catalog_filters_universes')}
            </OsdsText>
            {universes.map((item, id) => (
              <div key={`universe${id}`}>{item}</div>
            ))}
            <OsdsText level={OdsTextLevel.heading}>
              {t('manager_catalog_filters_categories')}
            </OsdsText>
            {categories.map((item, id) => (
              <div key={`category${id}`}>{item}</div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Filters;
