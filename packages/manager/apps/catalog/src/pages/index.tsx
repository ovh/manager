import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Card } from '@ovh-ux/manager-react-components';
import { OdsText, OdsDivider } from '@ovhcloud/ods-components/react';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { Product } from '@/api';
import { getSearchUrlFromFilterParams } from '@/utils/utils';
import { useCatalog } from '@/hooks/useCatalog';
import SearchBar from '@/components/SearchBar/SearchBar';
import Loading from '../components/Loading/Loading';
import Errors from '@/components/Error/Errors';

export default function Catalog() {
  const { t } = useTranslation('catalog');
  const [, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = React.useState('');
  const [categories, setCategories] = React.useState<string[]>([]);
  const [universes, setUniverses] = React.useState<string[]>([]);
  const [isRouterInitialized, setIsRouterInitialized] = React.useState<boolean>(
    false,
  );
  const { results, products, isLoading, error } = useCatalog({
    categories,
    universes,
    searchText,
  });

  useEffect(() => {
    if (products.length > 0) {
      const customSearchParams = getSearchUrlFromFilterParams(
        searchText,
        categories,
        universes,
      );
      if (isRouterInitialized) {
        setSearchParams(customSearchParams);
      }
    }
  }, [searchText, categories, universes, products, isRouterInitialized]);

  if (!isLoading && error) return <Errors error={error} />;

  return (
    <div className="m-10">
      <Breadcrumb />
      <br />
      <OdsText className="mb-3">
        {t('title')}
        {isLoading ? '' : ` (${results.length})`}
      </OdsText>
      <SearchBar
        products={products}
        universes={universes}
        categories={categories}
        setSelectedCategories={setCategories}
        setSelectedUniverses={setUniverses}
        setSearchValue={setSearchText}
        setIsRouterInitialized={setIsRouterInitialized}
      />
      <OdsDivider />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5 pt-3">
        {isLoading && <Loading />}
        {!isLoading && results.length > 0 && (
          <>
            {/* Just for testing */}
            <Card
              texts={{
                title: 'Nas-HA',
                category: 'Storage and Backup',
                description: '',
              }}
              href="/#/catalog/nasha"
              hoverable
            />
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
        <OdsText className="text-center grid w-full">{t('no_result')}</OdsText>
      )}
    </div>
  );
}
