import { useState, Suspense, useMemo, useEffect } from 'react';
import {
  useUpdateVcdVrackSegment,
  useVcdDatacentre,
  useVcdVrackSegmentsList,
} from '@ovh-ux/manager-module-vcd-api';

import { useVrackIpList } from '@ovh-ux/manager-network-common/src/vrack/hooks/useVrackIpList';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Modal,
  ErrorBoundary,
  LinkType,
  Links,
} from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import {
  OdsMessage,
  OdsText,
  OdsFormField,
  OdsSelect,
} from '@ovhcloud/ods-components/react';
import {
  VRACK_PATH,
  DEDICATED_PATH,
} from '@/pages/listing/datacentres/Datacentres.constants';

import { subRoutes } from '@/routes/routes.constant';
import TEST_IDS from '@/utils/testIds.constants';

import { useMessageContext } from '@/context/Message.context';
import { getGatewayFromCIDR } from '@/utils/ipaddrUtilities';

function AddPublicIpBlockLoaded() {
  const { id, vdcId } = useParams();
  const { t } = useTranslation('dashboard');
  const { t: tVrackSegment } = useTranslation('datacentres/vrack-segment');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);

  const navigate = useNavigate();
  const closeModal = () => navigate('..');

  const { addSuccess } = useMessageContext();

  const [selectedBlockIp, setSelectedBlockIp] = useState(null);
  const [
    doesBlockIpExistInVrackSegment,
    setDoesBlockIpExistInVrackSegment,
  ] = useState(null);

  const {
    data: vdcData,
    isLoading: isLoadingVcdDatacenter,
    isError: isErrorVcdDatacenter,
  } = useVcdDatacentre(id, vdcId);
  const vrack = vdcData?.data?.currentState?.vrack;

  const {
    data: segmentListData,
    isError: isErrorVrackSegmentList,
    isLoading: isLoadingVrackSegmentList,
  } = useVcdVrackSegmentsList(id, vdcId, { enabled: !!id && !!vdcId });

  const vrackSegment = useMemo(() => {
    if (!segmentListData?.data) return undefined;

    return segmentListData.data.find(
      (segment) => segment?.currentState?.mode === 'UNTAGGED',
    );
  }, [segmentListData]);

  const vrackSegmentId = vrackSegment?.id;

  const { ip: ipVrackList, isLoading: isLoadingIpVrackList } = useVrackIpList(
    vrack,
    {
      enabled: !!vrack,
    },
  );

  const { data: urlVrack } = useNavigationGetUrl([
    DEDICATED_PATH,
    `/${VRACK_PATH}/${vrack}`,
    {},
  ]);

  const {
    mutate: updateVrackSegment,
    error: updateError,
    isPending: isUpdatePending,
  } = useUpdateVcdVrackSegment({
    id,
    vdcId,
    vrackSegmentId,
    onSuccess: () => {
      addSuccess({
        content: t(
          'managed_vcd_dashboard_add_ip_public_block_message_success',
          {
            gateway: getGatewayFromCIDR(selectedBlockIp),
            blockIp: selectedBlockIp,
          },
        ),
        includedSubRoutes: [vdcId],
        excludedSubRoutes: [
          subRoutes.datacentreCompute,
          subRoutes.datacentreStorage,
        ],
      });
      closeModal();
    },
  });

  const onSubmit = () => {
    if (vrackSegment) {
      updateVrackSegment({
        ...vrackSegment.targetSpec,
        networks: [
          ...vrackSegment.targetSpec.networks,
          getGatewayFromCIDR(selectedBlockIp),
        ],
      });
    }
  };

  useEffect(() => {
    if (
      selectedBlockIp &&
      vrackSegment &&
      vrackSegment.currentState?.networks?.includes(
        getGatewayFromCIDR(selectedBlockIp),
      )
    ) {
      setDoesBlockIpExistInVrackSegment(true);
    } else {
      setDoesBlockIpExistInVrackSegment(false);
    }
  }, [selectedBlockIp]);

  if (isErrorVcdDatacenter || isErrorVrackSegmentList) {
    return (
      <Modal isOpen onDismiss={closeModal}>
        <ErrorBoundary redirectionApp="vcd" />
      </Modal>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <Modal
        isOpen
        heading={t('managed_vcd_dashboard_add_ip_public_block_modal_heading')}
        primaryLabel={
          ipVrackList && ipVrackList.length > 0 ? tActions('add') : null
        }
        isPrimaryButtonLoading={isUpdatePending}
        isPrimaryButtonDisabled={
          isUpdatePending || !selectedBlockIp || doesBlockIpExistInVrackSegment
        }
        onPrimaryButtonClick={onSubmit}
        secondaryLabel={tActions('cancel')}
        onSecondaryButtonClick={closeModal}
        onDismiss={closeModal}
        isLoading={
          isLoadingIpVrackList ||
          isLoadingVcdDatacenter ||
          isLoadingVrackSegmentList
        }
        primaryButtonTestId={TEST_IDS.modalSubmitCta}
      >
        {ipVrackList && ipVrackList.length > 0 ? (
          <div className="flex flex-col gap-2">
            {updateError && (
              <OdsMessage color="critical" isDismissible={false}>
                {tVrackSegment(
                  'managed_vcd_dashboard_vrack_add_network_error',
                  {
                    errorApi: updateError.message,
                  },
                )}
              </OdsMessage>
            )}

            <OdsText>
              {t('managed_vcd_dashboard_add_ip_public_block_description')}
            </OdsText>

            <OdsMessage color="information" isDismissible={false}>
              <>{t('managed_vcd_dashboard_add_ip_public_block_information')}</>
            </OdsMessage>
            <Links
              id={`vrack-${vdcId}`}
              aria-labelledby={`vrack-${vrack}-tooltip`}
              href={urlVrack as string}
              type={LinkType.next}
              label={vrack}
            />

            <OdsFormField className="mt-3">
              <div slot="label" className="space-y-2 mb-2">
                <OdsText className="block" preset={ODS_TEXT_PRESET.heading5}>
                  {t('managed_vcd_dashboard_add_ip_public_block_label')}
                </OdsText>
              </div>
              <OdsSelect
                name="ip list "
                onOdsChange={(e) => {
                  setSelectedBlockIp(e.detail.value);
                }}
              >
                {(ipVrackList || []).map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </OdsSelect>
              {doesBlockIpExistInVrackSegment && (
                <OdsMessage
                  className="mt-2"
                  color="critical"
                  isDismissible={false}
                >
                  {t(
                    'managed_vcd_dashboard_add_ip_public_block_add_already_exist',
                    {
                      gateway: getGatewayFromCIDR(selectedBlockIp),
                      blockIp: selectedBlockIp,
                    },
                  )}
                </OdsMessage>
              )}
            </OdsFormField>
          </div>
        ) : (
          <>
            <OdsMessage color="information" isDismissible={false}>
              {t(
                'managed_vcd_dashboard_add_ip_public_block_no_vrack_ip_information',
              )}
            </OdsMessage>
            <Links
              className="mt-2"
              id={`vrack-${vdcId}`}
              aria-labelledby={`vrack-${vrack}-tooltip`}
              href={urlVrack as string}
              type={LinkType.next}
              label={vrack}
            />
          </>
        )}
      </Modal>
    </form>
  );
}

export default function AddPuplicIpBlock() {
  const { t } = useTranslation('datacentres/vrack-segment');

  return (
    <Suspense
      fallback={
        <Modal
          isOpen
          heading={t('managed_vcd_dashboard_vrack_add_network')}
          isLoading
        ></Modal>
      }
    >
      <AddPublicIpBlockLoaded />;
    </Suspense>
  );
}
