import { useTranslation } from 'react-i18next';
import { Text } from '../../../../text';

export const EmptyRow = () => {
  const { t } = useTranslation(['datagrid']);
  return (
    <tbody>
      <tr className="h-[3.25rem] w-full">
        <td
          className="absolute text-center w-full py-[15px]"
          style={{
            borderRight: '1px solid var(--ods-color-neutral-100)',
            left: 0,
          }}
        >
          <Text>{t('common_pagination_no_results')}</Text>
        </td>
      </tr>
    </tbody>
  );
};
