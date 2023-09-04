import React, { useState } from 'react';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { OsdsCheckbox } from '@ovhcloud/ods-components/checkbox/react';
import { OsdsCheckboxButton } from '@ovhcloud/ods-components/checkbox-button/react';
import { OsdsLink } from '@ovhcloud/ods-components/link/react';
import { OsdsSkeleton } from '@ovhcloud/ods-components/skeleton/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_CHECKBOX_BUTTON_SIZE } from '@ovhcloud/ods-components/checkbox-button';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import './Filters.scss';
import { getAvailableCategories, getUniverses, Product } from '@/utils/utils';

interface FiltersProps {
  products: Product[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedUniverses: React.Dispatch<React.SetStateAction<string[]>>;
}

const Filters: React.FC<FiltersProps> = ({
  products,
  setSelectedCategories,
  setSelectedUniverses,
}) => {
  const [selectedCategories, setSelectedCategoriesLocal] = useState<string[]>(
    [],
  );
  const [selectedUniverses, setSelectedUniversesLocal] = useState<string[]>([]);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const setFilters = () => {
    setSelectedCategories(selectedCategories);
    setSelectedUniverses(selectedUniverses);
  };

  // we get the list of available categories and universes from product list
  const universes = getUniverses(products);
  const categories = getAvailableCategories(products, getUniverses(products));

  const resetFilters = () => {
    setSelectedCategoriesLocal([]);
    setSelectedUniversesLocal([]);
    setFilters();
  };

  const { t } = useTranslation('catalog-revamp/filters');

  const handleCheckboxChange = (
    type: 'category' | 'universe',
    label: string,
    event: CustomEvent<{ checked: boolean; value: string }>,
  ) => {
    setHasInteracted(true);
    const { checked } = event.detail;
    if (type === 'category') {
      setSelectedCategoriesLocal((prevSelected) =>
        checked
          ? [...prevSelected, label]
          : prevSelected.filter((item) => item !== label),
      );
    } else {
      setSelectedUniversesLocal((prevSelected) =>
        checked
          ? [...prevSelected, label]
          : prevSelected.filter((item) => item !== label),
      );
    }
  };

  const FilterItem: React.FC<{
    label?: string;
    loading?: boolean;
    type: 'category' | 'universe';
  }> = ({ label, loading, type }) => {
    const isChecked =
      type === 'category'
        ? selectedCategories.includes(label || '')
        : selectedUniverses.includes(label || '');
    return (
      <div className="filter-item">
        <OsdsCheckbox
          checked={isChecked}
          onOdsCheckedChange={(event: CustomEvent) =>
            handleCheckboxChange(type, label, event)
          }
        >
          <OsdsCheckboxButton
            size={ODS_CHECKBOX_BUTTON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            <span slot="end">{loading ? <OsdsSkeleton /> : label}</span>
          </OsdsCheckboxButton>
        </OsdsCheckbox>
      </div>
    );
  };

  return (
    <>
      <>
        <div className="filters-container filters-container grid grid-cols-1 md:flex">
          <div className="filters-universes">
            <OsdsText
              level={ODS_TEXT_LEVEL.heading}
              size={ODS_TEXT_SIZE._400}
              className="title"
            >
              {t('manager_catalog_filters_universes')}
            </OsdsText>
            {universes.map((item: string, id: number) => (
              <FilterItem key={id} label={item} type="universe" />
            ))}
            {!universes.length &&
              [...Array(5)].map((item: string, id: number) => (
                <FilterItem key={id} loading={true} type="universe" />
              ))}
          </div>
          <div className="filters-categories grid">
            <OsdsText
              level={ODS_TEXT_LEVEL.heading}
              size={ODS_TEXT_SIZE._400}
              className="title"
            >
              {t('manager_catalog_filters_categories')}
            </OsdsText>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((item: string, id: number) => (
                <FilterItem key={id} label={item} type="category" />
              ))}
              {!categories.length &&
                [...Array(15)].map((item: string, id: number) => (
                  <FilterItem key={id} loading={true} type="category" />
                ))}
            </div>
          </div>
        </div>
        <div className="filters-footer-container">
          <div className="filters-footer">
            <OsdsLink
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => resetFilters()}
            >
              {t('manager_catalog_filters_reset')}
            </OsdsLink>
            <OsdsButton
              disabled={!hasInteracted ? true : undefined}
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => setFilters()}
            >
              {t('manager_catalog_filters_button_apply')}
            </OsdsButton>
          </div>
        </div>
      </>
    </>
  );
};

export default Filters;
