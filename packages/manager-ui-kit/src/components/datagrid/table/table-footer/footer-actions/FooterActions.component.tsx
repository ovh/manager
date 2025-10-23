import { memo } from 'react';

import { useTranslation } from 'react-i18next';

import { BUTTON_SIZE, BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { Button } from '../../../../button';

const FooterActionsComponent = ({
  hasNextPage,
  isLoading,
  onFetchAllPages,
  onFetchNextPage,
}: {
  hasNextPage?: boolean;
  isLoading?: boolean;
  onFetchAllPages?: () => void;
  onFetchNextPage?: () => void;
}) => {
  const { t } = useTranslation('datagrid');
  return (
    <div className="h-full flex items-center justify-center">
      {hasNextPage && (
        <div className="flex justify-center gap-5">
          {onFetchNextPage && (
            <Button
              data-testid="load-more-btn"
              size={BUTTON_SIZE.sm}
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
              size={BUTTON_SIZE.sm}
              variant={BUTTON_VARIANT.outline}
              onClick={onFetchAllPages}
              loading={isLoading}
            >
              {t('common_pagination_load_all')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export const FooterActions = memo(FooterActionsComponent);
