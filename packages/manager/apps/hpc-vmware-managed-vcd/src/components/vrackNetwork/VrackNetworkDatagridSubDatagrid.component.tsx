import { Datagrid } from '@ovh-ux/manager-react-components';
import { OdsButton } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { VrackSegment } from '@ovh-ux/manager-module-vcd-api';
import { LABELS } from '../../utils/labels.constants';
import { subRoutes, urls } from '@/routes/routes.constant';

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
  vrackSegment,
}: {
  vrackSegment: VrackSegment;
  headerRefs?: React.RefObject<HTMLTableCellElement>;
}) {
  const { t } = useTranslation('datacentres/vrack-segment');
  const navigate = useNavigate();
  const { id, vdcId } = useParams();
  const {
    id: vrackSegmentId,
    resourceStatus: vrackSegmentStatus,
    targetSpec: { networks },
  } = vrackSegment;

  return (
    <>
      <style>{CSS}</style>
      <Datagrid
        columns={[
          {
            id: 'network',
            label: LABELS.network,
            cell: (network: string) => {
              return (
                <>
                  {LABELS.network} {network}
                </>
              );
            },
          },
          {
            id: 'actions',
            label: '',
            cell: (network: string) => (
              <div className="flex items-center justify-end">
                <OdsButton
                  aria-hidden="true"
                  label=""
                  aria-label={t(
                    'managed_vcd_dashboard_vrack_network_delete_network',
                  )}
                  icon="trash"
                  variant="ghost"
                  isDisabled={vrackSegmentStatus === 'deleting'}
                  onClick={() => {
                    const networkIp = network.split('/')[0];
                    navigate(
                      urls.vrackSegmentDeleteNetwork
                        .replace(subRoutes.dashboard, id)
                        .replace(subRoutes.vdcId, vdcId)
                        .replace(subRoutes.vrackSegmentId, vrackSegmentId)
                        .replace(subRoutes.vrackNetworkId, networkIp),
                    );
                  }}
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
