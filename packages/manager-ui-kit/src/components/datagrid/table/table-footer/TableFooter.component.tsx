import { FooterActions } from './footer-actions/FooterActions.component';
import { FooterInfos } from './footer-infos/FooterInfos.component';

export const TableFooter = ({
  hasNextPage,
  isLoading,
  itemsCount,
  onFetchAllPages,
  onFetchNextPage,
  totalCount,
}: {
  hasNextPage?: boolean;
  isLoading?: boolean;
  itemsCount?: number;
  onFetchAllPages?: () => void;
  onFetchNextPage?: () => void;
  totalCount?: number;
}) => {
  if (!onFetchAllPages && !onFetchNextPage && !totalCount) {
    return null;
  }
  return (
    <div className="flex justify-center items-center pt-3">
      <div className="flex-1" />
      <div className="flex-2 flex justify-center">
        {(onFetchAllPages || onFetchNextPage) && (
          <FooterActions
            hasNextPage={hasNextPage}
            onFetchAllPages={onFetchAllPages}
            onFetchNextPage={onFetchNextPage}
            isLoading={isLoading}
          />
        )}
      </div>
      <div className="flex-1 flex justify-end">
        {totalCount && <FooterInfos totalCount={totalCount} itemsCount={itemsCount} />}
      </div>
    </div>
  );
};
