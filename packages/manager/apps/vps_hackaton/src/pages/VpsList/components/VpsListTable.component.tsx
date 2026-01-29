import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Icon, ICON_NAME, Table, Text } from '@ovhcloud/ods-react';

import { VpsStateBadge } from '@/components/VpsStateBadge/VpsStateBadge.component';
import { VpsActionsMenu } from '@/components/VpsActionsMenu/VpsActionsMenu.component';
import { getVpsDetailUrl } from '@/routes/Routes.constants';
import type { TSortDirection, TSortableField } from '@/domain/services/vpsFilter.service';
import type { TVpsForView } from '@/pages/VpsList/view-models/vpsList.viewmodel';

type TVpsListTableProps = {
  vpsList: Array<TVpsForView>;
  sortField: TSortableField;
  sortDirection: TSortDirection;
  onSortChange: (field: TSortableField) => void;
};

type TSortableColumn = {
  field: TSortableField;
  translationKey: string;
};

type TSortIconProps = {
  field: TSortableField;
  currentField: TSortableField;
  direction: TSortDirection;
};

const COLUMN_NAME: TSortableColumn = { field: 'displayName', translationKey: 'vps_list_column_name' };
const COLUMN_STATE: TSortableColumn = { field: 'state', translationKey: 'vps_list_column_state' };
const COLUMN_DATACENTER: TSortableColumn = { field: 'datacenter', translationKey: 'vps_list_column_datacenter' };
const COLUMN_EXPIRATION: TSortableColumn = { field: 'expirationDate', translationKey: 'vps_list_column_expiration' };

const SortIcon = ({ field, currentField, direction }: TSortIconProps) => {
  const isActive = field === currentField;

  return (
    <span className="ml-1 inline-flex flex-col">
      <Icon
        name={ICON_NAME.chevronUp}
        className={isActive && direction === 'asc' ? 'text-[--ods-color-primary-500]' : 'text-[--ods-color-neutral-400]'}
      />
      <Icon
        name={ICON_NAME.chevronDown}
        className={isActive && direction === 'desc' ? 'text-[--ods-color-primary-500]' : 'text-[--ods-color-neutral-400]'}
      />
    </span>
  );
};

export const VpsListTable = ({ vpsList, sortField, sortDirection, onSortChange }: TVpsListTableProps) => {
  const { t } = useTranslation('vps');
  const navigate = useNavigate();

  const handleRowClick = (serviceName: string) => {
    navigate(getVpsDetailUrl(serviceName));
  };

  const getAriaSortValue = (field: TSortableField): 'ascending' | 'descending' | 'none' => {
    if (field !== sortField) return 'none';
    return sortDirection === 'asc' ? 'ascending' : 'descending';
  };

  const renderSortableHeader = (column: TSortableColumn) => (
    <th
      key={column.field}
      role="columnheader"
      aria-sort={getAriaSortValue(column.field)}
      className="p-4 text-left cursor-pointer select-none hover:bg-[--ods-color-neutral-100]"
      onClick={() => onSortChange(column.field)}
    >
      <span className="inline-flex items-center">
        {t(column.translationKey)}
        <SortIcon field={column.field} currentField={sortField} direction={sortDirection} />
      </span>
    </th>
  );

  return (
    <Table className="w-full" >
      <table className="w-full">
        <thead>
          <tr>
            {renderSortableHeader(COLUMN_NAME)}
            {renderSortableHeader(COLUMN_STATE)}
            <th className="p-4 text-left">{t('vps_list_column_model')}</th>
            {renderSortableHeader(COLUMN_DATACENTER)}
            <th className="p-4 text-left">{t('vps_list_column_ip')}</th>
            {renderSortableHeader(COLUMN_EXPIRATION)}
            <th className="p-4 text-left w-12">{t('vps_list_column_actions')}</th>
          </tr>
        </thead>
        <tbody>
          {vpsList.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center">
                <div className="flex flex-col gap-2">
                  <Text preset="paragraph" className="text-[--ods-color-neutral-900]">
                    {t('vps_list_empty_title')}
                  </Text>
                  <Text preset="paragraph" className="text-[--ods-color-neutral-500]">
                    {t('vps_list_empty_description')}
                  </Text>
                </div>
              </td>
            </tr>
          ) : (
            vpsList.map((vps) => (
              <tr
                key={vps.serviceName}
                className="cursor-pointer hover:bg-[--ods-color-neutral-100]"
                onClick={() => handleRowClick(vps.serviceName)}
              >
                <td className="p-4">
                  <div className="font-medium">{vps.displayName}</div>
                  {vps.displayName !== vps.serviceName && (
                    <div className="text-sm text-[--ods-color-neutral-500]">{vps.serviceName}</div>
                  )}
                </td>
                <td className="p-4">
                  <VpsStateBadge state={vps.state} />
                </td>
                <td className="p-4">{vps.model}</td>
                <td className="p-4">{vps.datacenter}</td>
                <td className="p-4 font-mono text-sm">{vps.ipAddress}</td>
                <td className="p-4">{vps.formattedExpiration}</td>
                <td className="p-4">
                  <VpsActionsMenu serviceName={vps.serviceName} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Table>
  );
};
