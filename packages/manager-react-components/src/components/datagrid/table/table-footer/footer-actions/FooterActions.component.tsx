import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BUTTON_VARIANT } from '@ovhcloud/ods-react';
import { Button } from '../../../../button';

const FooterActionsComponent = ({
  hasNextPage,
  onFetchAllPages,
  onFetchNextPage,
  isLoading,
}: {
  hasNextPage?: boolean;
  onFetchNextPage?: () => void;
  onFetchAllPages?: () => void;
  isLoading?: boolean;
}) => {
  const { t } = useTranslation('datagrid');
  return (
    <div className="h-full flex items-center justify-center">
      {hasNextPage ? (
        <div className="flex justify-center gap-5">
          {onFetchNextPage && (
            <Button
              data-testid="load-more-btn"
              variant={BUTTON_VARIANT.outline}
              onClick={onFetchNextPage}
              loading={isLoading}
            >
              {t('common_pagination_load_more')}
            </Button>
          )}
          {onFetchAllPages && (
            <Button
              data-testid="load-all-btn"
              variant={BUTTON_VARIANT.outline}
              onClick={onFetchAllPages}
              loading={isLoading}
            >
              {t('common_pagination_load_all')}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
};

export const FooterActions = memo(FooterActionsComponent);
