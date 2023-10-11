import React, { useState } from 'react';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { OsdsLink } from '@ovhcloud/ods-components/link/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import FilterItem from './FilterItem';
import LoadingFilterItem from './LoadingFilterItem';
import './Filters.scss';
import {
  getAvailableCategoriesWithCounter,
  getUniverses,
  Product,
} from '@/utils/utils';

interface FiltersProps {
  products: Product[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedUniverses: React.Dispatch<React.SetStateAction<string[]>>;
  onApply: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  products,
  setSelectedCategories: setParentSelectedCategories,
  setSelectedUniverses: setParentSelectedUniverses,
  onApply,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedUniverses, setSelectedUniverses] = useState<string[]>([]);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const setFilters = () => {
    setParentSelectedCategories(selectedCategories);
    setParentSelectedUniverses(selectedUniverses);
    onApply();
  };

  // we get the list of available categories and universes from product list
  const universes = getUniverses(products, true);
  const categories = getAvailableCategoriesWithCounter(
    products,
    getUniverses(products, false),
  );

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedUniverses([]);
    setParentSelectedCategories([]);
    setParentSelectedUniverses([]);
  };

  const { t } = useTranslation('catalog/filters');

  const handleCheckboxChange = (
    type: 'category' | 'universe',
    label: string,
    event: CustomEvent<{ checked: boolean; value: string }>,
  ) => {
    setHasInteracted(true);
    const { checked } = event.detail;
    const updateState = (prevState: string[]) =>
      checked
        ? [...prevState, label]
        : prevState.filter((item) => item !== label);

    if (type === 'category') {
      setSelectedCategories(updateState);
    } else {
      setSelectedUniverses(updateState);
    }
  };

  return (
    <>
      <span className="filters-container filters-container grid grid-cols-1 md:flex text-left">
        <span className="filters-universes flex-[2]">
          <OsdsText
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
            className="title"
          >
            {t('manager_catalog_filters_universes')}
          </OsdsText>
          {universes.length ? (
            universes.map(
              (item: { universe: string; count: number }, id: number) => (
                <FilterItem
                  key={item.universe}
                  label={item.universe}
                  count={item.count}
                  type="universe"
                  isChecked={selectedUniverses.includes(item.universe)}
                  onCheckboxChange={handleCheckboxChange}
                />
              ),
            )
          ) : (
            <LoadingFilterItem lineNumber={5} />
          )}
        </span>
        <span className="filters-categories grid flex-[4]">
          <OsdsText
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
            className="title"
          >
            {t('manager_catalog_filters_categories')}
          </OsdsText>
          <span className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {categories.length ? (
              categories.map(
                (item: { category: string; count: number }, id: number) => (
                  <FilterItem
                    key={item.category}
                    label={item.category}
                    count={item.count}
                    type="category"
                    isChecked={selectedCategories.includes(item.category)}
                    onCheckboxChange={handleCheckboxChange}
                  />
                ),
              )
            ) : (
              <LoadingFilterItem lineNumber={15} />
            )}
          </span>
        </span>
      </span>
      <span className="filters-footer-container">
        <span className="filters-footer flex justify-end gap-x-5">
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => resetFilters()}
            data-tracking="filter::reset"
          >
            {t('manager_catalog_filters_reset')}
          </OsdsLink>
          <OsdsButton
            name="applyFilterButton"
            disabled={!hasInteracted || undefined}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => setFilters()}
            data-tracking="filter::apply"
          >
            {t('manager_catalog_filters_button_apply')}
          </OsdsButton>
        </span>
      </span>
    </>
  );
};

export default Filters;
