import { memo } from 'react';
import { Input } from '@ovhcloud/ods-react';
import { SearchProps } from '../../Datagrid.props';

const ColumnsSearchComponent = ({ search }: { search: SearchProps }) => {
  return (
    <form
      className="mr-[5px]"
      onSubmit={(e) => {
        search?.onSearch(search?.searchInput);
        e.preventDefault();
      }}
    >
      <Input
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
