import React, { useEffect, useState, KeyboardEvent } from 'react';
import { useLocation } from 'react-router-dom';
import {
  OsdsSearchBar,
  OsdsButton,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  OsdsSearchBarCustomEvent,
  OdsInputValueChangeEventDetail,
} from '@ovhcloud/ods-components';
import Filters from '@/components/Filters/Filters';
import { Product } from '@/api';
import FilterChip from '../Filters/FilterChip';

interface SearchbarProps {
  products: Product[];
  universes: string[];
  categories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedUniverses: React.Dispatch<React.SetStateAction<string[]>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setIsRouterInitialized: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar: React.FC<SearchbarProps> = ({
  products,
  universes,
  categories,
  setSelectedCategories,
  setSelectedUniverses,
  setSearchValue,
  setIsRouterInitialized,
}) => {
  const { t } = useTranslation('catalog/search');

  const [showFilters, setShowFilters] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState('');

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchURL = params.get('q');
    if (searchURL) {
      setSearchValue(searchURL);
      setLocalSearchValue(searchURL);
    }
  }, [location.search]);

  const onSearchSubmit = (
    event: CustomEvent<{ optionValue: string; inputValue: string }>,
  ) => {
    setSearchValue(event.detail.inputValue.trim());
  };

  const onSearchChanged = (
    event: OsdsSearchBarCustomEvent<OdsInputValueChangeEventDetail>,
  ) => {
    setLocalSearchValue(event.detail.value);
    setSearchValue(event.detail.value);
  };

  const onDeleteCategory = (category: string) =>
    setSelectedCategories(categories.filter((c) => c !== category));

  const onDeleteUniverse = (universe: string) =>
    setSelectedUniverses(universes.filter((u) => u !== universe));

  return (
    <form>
      <div className="grid gap-4 md:flex md:justify-end md:pt-4">
        <span className="w-full md:w-[300px]">
          <OsdsSearchBar
            value={localSearchValue}
            placeholder={t('manager_catalog_search_placeholder')}
            onOdsSearchSubmit={onSearchSubmit}
            onOdsValueChange={onSearchChanged}
            data-tracking={`searchbar::${localSearchValue}`}
            onKeyDown={(event: KeyboardEvent) =>
              event.key === 'Enter' &&
              onSearchSubmit({
                detail: { inputValue: localSearchValue.trim() },
              } as CustomEvent)
            }
          />
        </span>
        <span>
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            type={ODS_BUTTON_TYPE.button}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            onKeyDown={(event: KeyboardEvent) =>
              event.key === 'Enter' &&
              setShowFilters((filterState) => !filterState)
            }
            onClick={() => setShowFilters((filterState) => !filterState)}
            data-tracking={`filter::${
              showFilters ? 'show-filter' : 'hide-filter'
            }`}
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
      {!showFilters && (
        <FilterChip
          universes={universes}
          categories={categories}
          onDeleteUniverse={onDeleteUniverse}
          onDeleteCategory={onDeleteCategory}
        />
      )}

      <div style={{ display: showFilters ? 'block' : 'none' }}>
        <Filters
          products={products}
          setSearchValue={setSearchValue}
          setLocalSearchValue={setLocalSearchValue}
          setSelectedCategories={setSelectedCategories}
          setSelectedUniverses={setSelectedUniverses}
          setIsRouterInitialized={setIsRouterInitialized}
          onApply={() => setShowFilters(false)}
        />
      </div>
    </form>
  );
};

export default SearchBar;
