import { FooterInfos } from './footer-infos/FooterInfos.component';
import { FooterActions } from './footer-actions/FooterActions.component';

export const TableFooter = ({
  hasNextPage,
  onFetchAllPages,
  onFetchNextPage,
  isLoading,
  totalCount,
  itemsCount,
}: {
  hasNextPage?: boolean;
  onFetchAllPages?: () => void;
  onFetchNextPage?: () => void;
  isLoading?: boolean;
  totalCount?: number;
  itemsCount?: number;
}) => {
  return (
    <div className="flex justify-center items-center">
      <div className="size-14 grow-3 w-[25%]" />
      <div className="size-14 grow-7 w-1/2">
        <FooterActions
          hasNextPage={hasNextPage}
          onFetchAllPages={onFetchAllPages}
          onFetchNextPage={onFetchNextPage}
          isLoading={isLoading}
        />
      </div>
      <div className="size-14 grow-3 w-[25%]">
        <FooterInfos totalCount={totalCount} itemsCount={itemsCount} />
      </div>
    </div>
  );
};
