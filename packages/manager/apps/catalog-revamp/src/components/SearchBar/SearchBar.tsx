import React, { useState } from 'react';
import { OsdsSearchBar } from '@ovhcloud/ods-components/search-bar/react';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
} from '@ovhcloud/ods-components/button';
import Filters from '@/components/Filters/Filters';
import './SearchBar.scss';
import { Product } from '@/utils/utils';

interface SearchbarProps {
  products: Product[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedUniverses: React.Dispatch<React.SetStateAction<string[]>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<SearchbarProps> = ({
  products,
  setSelectedCategories,
  setSelectedUniverses,
  setSearchValue,
}) => {
  const { t } = useTranslation('catalog-revamp/search');

  const [showFilters, setShowFilters] = useState(true);

  const handleFiltersToggle = () =>
    setShowFilters((filterState) => !filterState);

  const onSearchSubmit = (
    event: CustomEvent<{ optionValue: string; inputValue: string }>,
  ) => {
    setSearchValue(event.detail.inputValue);
  };

  return (
    <div className="catalog-searchbar-container grid">
      <span className="justify-self-end">
        <OsdsSearchBar
          placeholder={t('manager_catalog_search_placeholder')}
          onOdsSearchSubmit={(event: CustomEvent) => onSearchSubmit(event)}
          className="cinline-flex justify-end w-80"
        />
        <OsdsButton
          className="filter-button float-right"
          size={ODS_BUTTON_SIZE.sm}
          type={ODS_BUTTON_TYPE.button}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => handleFiltersToggle()}
        >
          <OsdsIcon
            name={ODS_ICON_NAME.FILTER}
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          {t('manager_catalog_search_button')}
        </OsdsButton>
      </span>
      {showFilters && (
        <Filters
          products={products}
          setSelectedCategories={setSelectedCategories}
          setSelectedUniverses={setSelectedUniverses}
        />
      )}
    </div>
  );
};

export default SearchBar;
