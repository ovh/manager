import { memo } from 'react';

import { useTranslation } from 'react-i18next';

import { Input } from '@ovhcloud/ods-react';

import { SearchProps } from '@/components/datagrid/Datagrid.props';

const ColumnsSearchComponent = ({ search }: { search: SearchProps }) => {
  const { t } = useTranslation('datagrid');
  return (
    <form
      className="mr-[5px]"
      onSubmit={(e) => {
        search?.onSearch(search?.searchInput);
        e.preventDefault();
      }}
    >
      <Input
        aria-label={t('common_search_placeholder')}
        onClear={() => {
          search?.onSearch('');
          search?.setSearchInput('');
        }}
        onChange={(e) => {
          search?.setSearchInput(e.target.value);
          e.preventDefault();
        }}
        placeholder={search?.placeholder}
        clearable
        type="search"
        value={search?.searchInput}
      />
    </form>
  );
};

export const ColumnsSearch = memo(ColumnsSearchComponent);
