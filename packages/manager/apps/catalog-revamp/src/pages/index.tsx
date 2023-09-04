import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/text/react/';
import { OsdsDivider } from '@ovhcloud/ods-components/divider/react/';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import SearchBar from '@/components/SearchBar/SearchBar';
import { useCatalog } from '@/hooks/useCatalog';
import { Product } from '@/utils/utils';
import { MscTile } from '../../../../../super-components/components/msc-tile/react';

export default function CatalogRevamp() {
  const { t } = useTranslation('catalog-revamp');
  const [searchText, setSearchValue] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    [],
  );
  const [selectedUniverses, setSelectedUniverses] = React.useState<string[]>(
    [],
  );

  const { results, products } = useCatalog({
    categories: selectedCategories,
    universes: selectedUniverses,
    searchText,
  });

  return (
    <div>
      <OsdsText size={ODS_TEXT_SIZE._700} level={ODS_TEXT_LEVEL.heading}>
        {t('title')}
      </OsdsText>
      <SearchBar
        products={products}
        setSelectedCategories={setSelectedCategories}
        setSelectedUniverses={setSelectedUniverses}
        setSearchValue={setSearchValue}
      />
      <OsdsDivider separator />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {results.map((item: Product, id: number) => (
          <div key={id} className="bg-indigo-500 break-words m-5 p-4">
            {
              <MscTile
                className="border-2 border-solid border-cyan-200 rounded-xl"
                key={item.id}
                tileTitle={item.name}
                tileType={item.category}
                tileDescription={item.description}
                seeMoreLabel={t('seeMoreLabel')}
                href={item.order}
              />
            }
          </div>
        ))}
      </div>
    </div>
  );
}
