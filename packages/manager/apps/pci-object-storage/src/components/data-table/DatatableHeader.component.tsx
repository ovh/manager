import { Children, ReactElement, ReactNode } from 'react';
import DataTable from './index';

const DatatableHeader = ({ children }: { children: ReactNode }) => {
  // Helper function to check if a child is a ReactElement
  const isReactElement = (child: ReactNode): child is ReactElement =>
    !!child && typeof child === 'object' && 'type' in child;

  // Categorize children into `actionButton`, `searchbar`, and `filters`
  const actionButton = Children.toArray(children).find(
    (child): child is ReactElement =>
      isReactElement(child) && child.type === DataTable.Action,
  );
  const searchbar = Children.toArray(children).find(
    (child): child is ReactElement =>
      isReactElement(child) && child.type === DataTable.SearchBar,
  );
  const filters = Children.toArray(children).find(
    (child): child is ReactElement =>
      isReactElement(child) && child.type === DataTable.FiltersButton,
  );

  return (
    <div className="w-full flex flex-col sm:flex-row gap-2 pb-4">
      {actionButton}
      <div className="flex ml-auto gap-2">
        {searchbar}
        {filters}
      </div>
    </div>
  );
};

export { DatatableHeader };
