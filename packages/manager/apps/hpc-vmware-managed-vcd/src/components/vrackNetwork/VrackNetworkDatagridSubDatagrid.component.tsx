import { Datagrid } from '@ovh-ux/manager-react-components';
import { OdsButton } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LABELS } from '../../utils/labels.constants';

const CSS = `
      .sub-row > td {
        padding: 0 0 0 var(--expander-column-width) !important;
      }
      .sub-row table, .sub-row tr {
        border: none;
      }
      .sub-row table td {
        border-left: none !important;
        border-right: none !important;
      }
      .sub-row table tr:first-child td {
        border-top: none;
      }
      .sub-row table tr:last-child td {
        border-bottom: none;
      }
      .sub-row table tr td:first-child {
        border-left: none;
      }
      .sub-row table tr td:last-child {
        border-right: none;
      }
`;

export default function VrackNetworkDatagridSubDatagrid({
  networks,
}: {
  networks: string[];
  headerRefs?: React.RefObject<HTMLTableCellElement>;
}) {
  const { t } = useTranslation('datacentres/vrack-network');
  return (
    <>
      <style>{CSS}</style>
      <Datagrid
        columns={[
          {
            id: 'network',
            label: LABELS.network,
            cell: (item: string) => (
              <>
                {LABELS.network} {item}
              </>
            ),
          },
          {
            id: 'actions',
            label: '',
            cell: () => (
              <div className="flex items-center justify-end">
                <OdsButton
                  aria-hidden="true"
                  label=""
                  aria-label={t(
                    'managed_vcd_dashboard_vrack_network_delete_network',
                  )}
                  icon="trash"
                  variant="ghost"
                />
              </div>
            ),
          },
        ]}
        items={networks}
        totalItems={networks.length}
        hideHeader={true}
        tableLayoutFixed={true}
      ></Datagrid>
    </>
  );
}
