import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Card } from '@ovhcloud/manager-components';
import { OsdsText, OsdsDivider } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { Product } from '@/api';
import { getSearchUrlFromFilterParams } from '@/utils/utils';
import { useCatalog } from '@/hooks/useCatalog';
import SearchBar from '@/components/SearchBar/SearchBar';
import Loading from '../components/Loading/Loading';
import Errors from '@/components/Error/Errors';

export default function Catalog() {
  const { t } = useTranslation('catalog');
  const navigate = useNavigate();

  const [searchText, setSearchText] = React.useState('');
  const [categories, setCategories] = React.useState<string[]>([]);
  const [universes, setUniverses] = React.useState<string[]>([]);

  const { results, products, isLoading, error } = useCatalog({
    categories,
    universes,
    searchText,
  });

  useEffect(() => {
    if (products.length > 0) {
      const searchParams = getSearchUrlFromFilterParams(
        searchText,
        categories,
        universes,
      );
      navigate({ search: searchParams });
    }
  }, [searchText, categories, universes, products]);

  const getResultsNumber = () => {
    if (isLoading) return '';
    return `(${results.length})`;
  };

  if (!isLoading && error) return <Errors error={error} />;

  return (
    <div className="m-10">
      <Breadcrumb />
      <br />
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        size={ODS_THEME_TYPOGRAPHY_SIZE._600}
        color={ODS_THEME_COLOR_INTENT.text}
        className="mb-3"
      >
        {`${t('title')} ${getResultsNumber()}`}
      </OsdsText>
      <SearchBar
        products={products}
        universes={universes}
        categories={categories}
        setSelectedCategories={setCategories}
        setSelectedUniverses={setUniverses}
        setSearchValue={setSearchText}
      />
      <OsdsDivider separator />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5 pt-3">
        {isLoading && <Loading />}
        {!isLoading && results.length > 0 && (
          <>
            {results.map((item: Product) => (
              <Card
                key={`${item.productName
                  .replace(' ', '')
                  .trim()}-${item.universe.replace(' ', '').trim()}`}
                texts={{
                  title: item.name,
                  category: item.category,
                  description: item.description,
                }}
                href={item.order}
                hoverable
                trackingLabel={`manager_product_cards::more_info::${item.productName}`}
              />
            ))}
          </>
        )}
      </div>
      {!isLoading && results.length === 0 && (
        <OsdsText className="text-center grid w-full">
          {t('no_result')}
        </OsdsText>
      )}
    </div>
  );
}
