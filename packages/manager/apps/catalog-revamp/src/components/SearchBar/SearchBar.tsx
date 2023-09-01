import React, { useState, useRef, useEffect } from 'react';
import {
  OsdsInput,
  OsdsButton,
  OsdsIcon,
} from '@ovhcloud/ods-stencil/components/react/';
import {
  OdsIconName,
  OdsIconSize,
  OdsButtonVariant,
  OdsButtonType,
  OdsButtonSize,
  OdsInputType,
} from '@ovhcloud/ods-core';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';
import { useTranslation } from 'react-i18next';

// import './SearchBar.scss'; TODO
// eslint-disable-next-line
interface SearchBarProps {} // TODO

const SearchBar: React.FC<SearchBarProps> = (props) => {
  // const { filtersContent } = props;
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const filtersRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation('catalog-revamp/search');

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

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <>
      <OsdsInput
        onChange={handleSearchChange}
        value={searchValue}
        type={OdsInputType.search}
        placeholder={t('manager_catalog_search_placeholder')}
      ></OsdsInput>
      <OsdsButton
        type={OdsButtonType.button}
        variant={OdsButtonVariant.flat}
        size={OdsButtonSize.sm}
        color={OdsThemeColorIntent.primary}
        onClick={handleTooltipToggle}
      >
        <OsdsIcon
          name={OdsIconName.SEARCH}
          size={OdsIconSize.xxs}
          contrasted={true}
        />
      </OsdsButton>
    </>
  );
};

export default SearchBar;
