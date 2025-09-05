import { Datagrid } from '@ovh-ux/manager-react-components';
import { OdsButton, OdsTooltip } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  isStatusTerminated,
  useVcdOrganization,
  VCDVrackSegment,
} from '@ovh-ux/manager-module-vcd-api';
import { LABELS } from '../../utils/labels.constants';
import { subRoutes, urls } from '@/routes/routes.constant';
import { encodeVrackNetwork } from '@/utils/encodeVrackNetwork';
import { TRACKING } from '@/tracking.constants';

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

export const VrackSegmentSubDatagrid = ({
  vrackSegment,
}: {
  vrackSegment: VCDVrackSegment;
  headerRefs?: React.RefObject<HTMLTableCellElement>;
}) => {
  const { t } = useTranslation('datacentres/vrack-segment');
  const navigate = useNavigate();
  const { id, vdcId } = useParams();
  const { data: vcdOrganization } = useVcdOrganization({ id });
  const isVcdTerminated = isStatusTerminated(
    vcdOrganization?.data?.resourceStatus,
  );
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
                  {t('managed_vcd_dashboard_vrack_network')} {network}
                </>
              );
            },
          },
          {
            id: 'actions',
            label: '',
            cell: (network: string) => {
              const isNotReadyForChange =
                !isVcdTerminated &&
                !['READY', 'ERROR'].includes(vrackSegmentStatus);
              const isLastNetwork = networks.length <= 1;
              const buttonId = `delete-network-${network}`;
              return (
                <div className="flex items-center justify-end">
                  <OdsButton
                    id={buttonId}
                    aria-hidden="true"
                    label=""
                    aria-label={t('managed_vcd_dashboard_vrack_delete_network')}
                    icon="trash"
                    variant="ghost"
                    color="critical"
                    isDisabled={isNotReadyForChange || isLastNetwork}
                    onClick={() => {
                      navigate(
                        urls.vrackSegmentDeleteNetwork
                          .replace(subRoutes.dashboard, id)
                          .replace(subRoutes.vdcId, vdcId)
                          .replace(subRoutes.vrackSegmentId, vrackSegmentId)
                          .replace(
                            subRoutes.vrackNetworkId,
                            encodeVrackNetwork(network),
                          ),
                      );
                    }}
                  />
                  {isLastNetwork && (
                    <OdsTooltip triggerId={buttonId}>
                      {t(
                        'managed_vcd_dashboard_vrack_unable_delete_last_network',
                      )}
                    </OdsTooltip>
                  )}
                </div>
              );
            },
          },
        ]}
        items={networks}
        totalItems={networks.length}
        hideHeader={true}
        tableLayoutFixed={true}
      ></Datagrid>
    </>
  );
};
