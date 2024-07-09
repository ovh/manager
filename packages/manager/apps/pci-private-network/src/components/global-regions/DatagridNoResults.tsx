import { DataGridTextCell } from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';

export default function DataGridNoResults(): JSX.Element {
  const { t } = useTranslation('pagination');

  return (
    <tr
      className={
        'border-solid border-[1px] h-[3.25rem] border-[var(--ods-color-blue-200)]'
      }
    >
      <td className="text-center" colSpan={8}>
        <DataGridTextCell>{t('common_pagination_no_results')}</DataGridTextCell>
      </td>
    </tr>
  );
}
