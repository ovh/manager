import { useTranslation } from 'react-i18next';
import { Text } from '../../../../text';

export const EmptyTableRow = () => {
  const { t } = useTranslation(['datagrid']);
  return (
    <tbody>
      <tr className="h-[3.25rem]">
        <td className="text-center w-full">
          <Text>{t('common_pagination_no_results')}</Text>
        </td>
      </tr>
    </tbody>
  );
};
