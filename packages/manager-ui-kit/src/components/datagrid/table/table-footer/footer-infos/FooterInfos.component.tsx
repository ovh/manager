import { memo } from 'react';

import { useTranslation } from 'react-i18next';

import { Text } from '../../../../text';

const FooterInformationsComponent = ({
  itemsCount,
  totalCount,
}: {
  itemsCount?: number;
  totalCount?: number;
}) => {
  const { t } = useTranslation('datagrid');
  return (
    <div className="text-right h-full flex items-bottom justify-end">
      <Text>
        {itemsCount} {totalCount && `${t('common_pagination_of')} ${totalCount}`}{' '}
        {`${t('common_pagination_results')}`}
      </Text>
    </div>
  );
};

export const FooterInfos = memo(FooterInformationsComponent);
