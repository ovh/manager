import React, { useContext } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsLink,
  OdsMessage,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { ApiErrorMessage } from '@/components/ApiError/ApiErrorMessage';
import { getIpDetailsQueryKey } from '@/data/api';
import { useByoipSlice, useGetIpdetails } from '@/data/hooks/ip';
import { ListingContext } from '@/pages/listing/listingContext';
import {
  TRANSLATION_NAMESPACES,
  fromIdToIp,
  ipFormatter,
  useGuideUtils,
} from '@/utils';

export default function SliceModal() {
  const queryClient = useQueryClient();
  const { parentId } = useParams();
  const { ipGroup } = ipFormatter(fromIdToIp(parentId));
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.aggregateSlice,
    NAMESPACES.ACTIONS,
  ]);
  const { links } = useGuideUtils();
  const { addSuccess } = useNotifications();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [slicingSize, setSlizingSize] = React.useState<number | undefined>();
  const { setOnGoingCreatedIps, setOnGoingSlicedIps } = useContext(
    ListingContext,
  );
  const { trackClick, trackPage } = useOvhTracking();

  const closeModal = React.useCallback(() => {
    navigate(`..?${search.toString()}`);
  }, [navigate, search]);

  const {
    slice,
    isLoading,
    error,
    isSlicePending,
    slicingError,
    postSlice,
  } = useByoipSlice({
    ip: ipGroup,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'edge_firewall_add_rule_error',
      });
      addSuccess(t('sliceSuccessMessage'));
      closeModal();
      const childrenIps =
        slice.find((a) => a.slicingSize === slicingSize)?.childrenIps || [];

      Promise.all(
        childrenIps?.map((ip) =>
          queryClient.invalidateQueries({
            queryKey: getIpDetailsQueryKey({ ip }),
          }),
        ),
      );

      setOnGoingCreatedIps((prev) => [...prev, ...childrenIps]);
      setOnGoingSlicedIps((prev) => [...prev, ipGroup]);
    },
  });

  useGetIpdetails({
    ip: ipGroup,
    enabled: true,
  });

  const cancel = React.useCallback(() => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['slice', 'cancel'],
    });
    closeModal();
  }, [closeModal, trackClick]);

  React.useEffect(() => {
    if (!slicingSize && slice && slice.length > 0) {
      setSlizingSize(
        slice.find((a) => a.childrenIps.length > 0)?.slicingSize || undefined,
      );
    }
  }, [slice, slicingSize]);

  const apiError = error || slicingError;

  return (
    <Modal
      isOpen
      heading={t('sliceModalTitle', { ip: ipGroup })}
      isLoading={isLoading}
      onDismiss={cancel}
      onSecondaryButtonClick={cancel}
      onPrimaryButtonClick={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['slice', 'confirm'],
        });
        postSlice({ slicingSize });
      }}
      primaryLabel={t('confirm', { ns: NAMESPACES.ACTIONS })}
      primaryButtonTestId="confirm-button"
      isPrimaryButtonLoading={isSlicePending}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      secondaryButtonTestId="cancel-button"
      isPrimaryButtonDisabled={!slicingSize}
    >
      {!isLoading && slice.length === 0 && !apiError && (
        <OdsMessage className="mb-4" color={ODS_MESSAGE_COLOR.warning}>
          <div className="inline">
            {t('noAggregateSliceAvailable')}
            <OdsLink
              href={links.aggreateSliceLink?.link}
              target="_blank"
              rel="noopener"
              label={t('noAggregateLinkLabel')}
              onClick={() => {
                trackClick({
                  location: PageLocation.popup,
                  buttonType: ButtonType.link,
                  actionType: 'action',
                  actions: [`go-to_${links.aggreateSliceLink?.trackingLabel}`],
                });
              }}
            />
          </div>
        </OdsMessage>
      )}
      {slice.length > 0 && (
        <>
          <OdsText className="mb-4 block" preset={ODS_TEXT_PRESET.paragraph}>
            {t('sliceModalDescription')}
          </OdsText>
          <OdsSelect
            className="block"
            name="slicing-size"
            value={slicingSize?.toString()}
            onOdsChange={(e) => {
              const newValue = parseInt(e.detail.value, 10);
              if (newValue) {
                setSlizingSize(newValue);
              }
            }}
          >
            {slice.map((a) => (
              <option key={a.slicingSize} value={a.slicingSize}>
                /{a.slicingSize}
              </option>
            ))}
          </OdsSelect>
          <section className="mb-4 bg-neutral-100 p-4">
            <OdsText>{t('sliceModalChildrenIpsDescription')}</OdsText>
            <ul>
              {slice
                .find((a) => a.slicingSize === slicingSize)
                ?.childrenIps?.map((ip) => (
                  <li key={ip}>
                    <OdsText>{ip}</OdsText>
                  </li>
                ))}
            </ul>
          </section>
        </>
      )}
      <ApiErrorMessage error={apiError} />
    </Modal>
  );
}
