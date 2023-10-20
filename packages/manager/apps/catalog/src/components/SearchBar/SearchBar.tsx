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
  const { t } = useTranslation('catalog/search');

  const [showFilters, setShowFilters] = useState(false);

  const onSearchSubmit = (
    event: CustomEvent<{ optionValue: string; inputValue: string }>,
  ) => {
    setSearchValue(event.detail.inputValue);
  };

  const onSearchChanged = (event: CustomEvent<{ value: string }>) => {
    setSearchValue(event.detail.value);
  };

  return (
    <form>
      <div className="grid gap-4 md:flex md:justify-end md:pt-4">
        <span className="w-full md:w-[300px]">
          <OsdsSearchBar
            placeholder={t('manager_catalog_search_placeholder')}
            onOdsSearchSubmit={onSearchSubmit}
            onOdsValueChange={onSearchChanged}
          />
        </span>
        <span>
          <OsdsButton
            name="filterButton"
            size={ODS_BUTTON_SIZE.sm}
            type={ODS_BUTTON_TYPE.button}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => setShowFilters((filterState) => !filterState)}
          >
            <OsdsIcon
              name={ODS_ICON_NAME.FILTER}
              size={ODS_ICON_SIZE.xs}
              color={ODS_THEME_COLOR_INTENT.primary}
              className="mr-2"
            />
            {t('manager_catalog_search_filter_button')}
          </OsdsButton>
        </span>
      </div>
      <div style={{ display: showFilters ? 'block' : 'none' }}>
        <Filters
          products={products}
          setSelectedCategories={setSelectedCategories}
          setSelectedUniverses={setSelectedUniverses}
          onApply={() => setShowFilters(false)}
        />
      </div>
    </form>
  );
};

export default SearchBar;
