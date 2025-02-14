import React, { useEffect, useState, KeyboardEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { OdsInput, OdsButton, OdsIcon } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME, ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
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

  const onSearchChanged = (event: any) => {
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
          <OdsInput
            name="searchbar"
            value={localSearchValue}
            placeholder={t('manager_catalog_search_placeholder')}
            onChange={onSearchChanged}
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
          <OdsButton
            size={ODS_BUTTON_SIZE.sm}
            label="Apply"
            onKeyDown={(event: KeyboardEvent) =>
              event.key === 'Enter' &&
              setShowFilters((filterState) => !filterState)
            }
            onClick={() => setShowFilters((filterState) => !filterState)}
            data-tracking={`filter::${
              showFilters ? 'show-filter' : 'hide-filter'
            }`}
          >
            <OdsIcon name={ODS_ICON_NAME.filter} className="mr-2" />
            {t('manager_catalog_search_filter_button')}
          </OdsButton>
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
