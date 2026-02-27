import React, { useContext } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  MESSAGE_COLOR,
  MessageBody,
  TEXT_PRESET,
  Link,
  Message,
  Select,
  Text,
  SelectContent,
  SelectControl,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/muk';
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
    loading,
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
      heading={t('sliceModalTitle', { ip: ipGroup })}
      loading={loading}
      onOpenChange={cancel}
      primaryButton={{
        label: t('confirm', { ns: NAMESPACES.ACTIONS }),
        testId: 'confirm-button',
        loading: isSlicePending,
        disabled: !slicingSize,
        onClick: () => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['slice', 'confirm'],
          });
          postSlice({ slicingSize });
        },
      }}
      secondaryButton={{
        label: t('cancel', { ns: NAMESPACES.ACTIONS }),
        testId: 'cancel-button',
        onClick: cancel,
      }}
    >
      {!loading && slice.length === 0 && !apiError && (
        <Message className="mb-4" color={MESSAGE_COLOR.warning}>
          <MessageBody>
            <div className="inline">
              {t('noAggregateSliceAvailable')}
              <Link
                href={links.aggreateSliceLink?.link}
                target="_blank"
                rel="noopener"
                onClick={() => {
                  trackClick({
                    location: PageLocation.popup,
                    buttonType: ButtonType.link,
                    actionType: 'action',
                    actions: [
                      `go-to_${links.aggreateSliceLink?.trackingLabel}`,
                    ],
                  });
                }}
              >
                {t('noAggregateLinkLabel')}
              </Link>
            </div>
          </MessageBody>
        </Message>
      )}
      {slice.length > 0 && (
        <>
          <Text className="mb-4 block" preset={TEXT_PRESET.paragraph}>
            {t('sliceModalDescription')}
          </Text>
          <Select
            className="block"
            name="slicing-size"
            value={[slicingSize?.toString()]}
            onValueChange={(e) => {
              const newValue = parseInt(e.value?.[0], 10);
              if (newValue) {
                setSlizingSize(newValue);
              }
            }}
            items={slice.map((a) => ({
              label: `/${a.slicingSize}`,
              value: a.slicingSize.toString(),
            }))}
          >
            <SelectContent />
            <SelectControl />
          </Select>
          <section className="mb-4 bg-neutral-100 p-4">
            <Text>{t('sliceModalChildrenIpsDescription')}</Text>
            <ul>
              {slice
                .find((a) => a.slicingSize === slicingSize)
                ?.childrenIps?.map((ip) => (
                  <li key={ip}>
                    <Text>{ip}</Text>
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
