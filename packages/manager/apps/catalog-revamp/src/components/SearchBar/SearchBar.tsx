import React, { useState, useRef, useEffect } from 'react';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-stencil/components/react/';
import {
  OdsIconName,
  OdsIconSize,
  OdsButtonVariant,
  OdsButtonType,
} from '@ovhcloud/ods-core';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';

// import './SearchBar.scss'; TODO
// eslint-disable-next-line
interface SearchBarProps {} // TODO

const SearchBar: React.FC<SearchBarProps> = (props) => {
  // const { filtersContent } = props;
  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

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
        Afficher/Masquer les filtres
      </OsdsButton>
      {showFilters && (
        <div ref={filtersRef} className="filters">
          <div className="filters-text">
            Univers / Catégories
            {/*
            filtersContent.map((item: filtersItem) => (
              <div key={item.label}>{item.label}</div>
            ))
            */}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
