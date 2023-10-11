import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_SIZE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/text/react/';
import { OsdsDivider } from '@ovhcloud/ods-components/divider/react/';
import { MscTile } from '@ovhcloud/msc-react-tile';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { useCatalog } from '@/hooks/useCatalog';
import SearchBar from '@/components/SearchBar/SearchBar';
import { Product } from '@/utils/utils';
import Loading from '../components/Loading/Loading';
import Errors from '@/components/Error/Errors';

export default function CatalogRevamp() {
  const { t } = useTranslation('catalog');
  const [searchText, setSearchText] = React.useState('');
  const [categories, setCategories] = React.useState<string[]>([]);
  const [universes, setUniverses] = React.useState<string[]>([]);

  const { results, products, isLoading, error } = useCatalog({
    categories,
    universes,
    searchText,
  });

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
        size={ODS_THEME_SIZE._600}
        color={ODS_THEME_COLOR_INTENT.text}
        className="mb-3"
      >
        {`${t('title')} ${getResultsNumber()}`}
      </OsdsText>
      <SearchBar
        products={products}
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
              <MscTile
                key={item.id}
                tileTitle={item.name}
                category={item.category}
                tileDescription={item.description}
                href={item.order}
                data-tracking={`manager_product_cards::more_info::${item.productName}`}
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
