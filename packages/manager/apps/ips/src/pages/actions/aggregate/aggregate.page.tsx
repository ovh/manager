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
import { useByoipAggregate } from '@/data/hooks/ip';
import { ListingContext } from '@/pages/listing/listingContext';
import {
  TRANSLATION_NAMESPACES,
  fromIdToIp,
  ipFormatter,
  useGuideUtils,
} from '@/utils';

export default function AggregateModal() {
  const queryClient = useQueryClient();
  const { setOnGoingCreatedIps, setOnGoingAggregatedIps } =
    useContext(ListingContext);
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
  const { trackClick, trackPage } = useOvhTracking();
  const [aggregationIp, setAggregationIp] = React.useState('');

  const closeModal = () => {
    navigate(`..?${search.toString()}`);
  };

  const {
    aggregate,
    isLoading,
    error,
    aggregateError,
    isAggregatePending,
    postAggregate,
  } = useByoipAggregate({
    ip: ipGroup,
    onSuccess: () => {
      addSuccess(t('aggregateSuccessMessage'));
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'aggregate_success',
      });
      closeModal();
      const childrenIps =
        aggregate.find((a) => a.aggregationIp === aggregationIp)?.childrenIps ||
        [];

      queryClient.invalidateQueries({
        queryKey: getIpDetailsQueryKey({ ip: aggregationIp }),
      });

      setOnGoingCreatedIps((prev) => [...prev, aggregationIp]);
      setOnGoingAggregatedIps((prev) => [...prev, ...childrenIps]);
    },
  });

  const cancel = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['aggregate', 'cancel'],
    });
    closeModal();
  };

  React.useEffect(() => {
    if (!aggregationIp && aggregate && aggregate.length > 0) {
      setAggregationIp(
        aggregate.find((a) => a.childrenIps.length > 0)?.aggregationIp || '',
      );
    }
  }, [aggregate, aggregationIp]);

  const apiError = error || aggregateError;

  return (
    <Modal
      isOpen
      heading={t('aggregateModalTitle', { ip: ipGroup })}
      isLoading={isLoading}
      onDismiss={cancel}
      onSecondaryButtonClick={cancel}
      onPrimaryButtonClick={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['aggregate', 'confirm'],
        });
        postAggregate({ aggregationIp });
      }}
      primaryLabel={t('confirm', { ns: NAMESPACES.ACTIONS })}
      primaryButtonTestId="confirm-button"
      isPrimaryButtonLoading={isAggregatePending}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      secondaryButtonTestId="cancel-button"
      isPrimaryButtonDisabled={!aggregationIp}
    >
      {!isLoading && aggregate.length === 0 && !apiError && (
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
                  actionType: 'action',
                  buttonType: ButtonType.link,
                  location: PageLocation.popup,
                  actions: [`go-to_${links?.aggreateSliceLink?.trackingLabel}`],
                });
              }}
            />
          </div>
        </OdsMessage>
      )}
      {aggregate.length > 0 && (
        <>
          <OdsText className="mb-4 block" preset={ODS_TEXT_PRESET.paragraph}>
            {t('aggregateModalDescription')}
          </OdsText>
          <OdsSelect
            className="block"
            name="aggregation-ip"
            value={aggregationIp}
            onOdsChange={(e) => {
              const newValue = e.detail.value;
              if (newValue) {
                setAggregationIp(newValue);
              }
            }}
          >
            {aggregate.map((a) => (
              <option key={a.aggregationIp} value={a.aggregationIp}>
                {a.aggregationIp}
              </option>
            ))}
          </OdsSelect>
          <section className="mb-4 bg-neutral-100 p-4">
            <OdsText>{t('aggregateModalChildrenIpsDescription')}</OdsText>
            <ul>
              {aggregate
                .find((a) => a.aggregationIp === aggregationIp)
                ?.childrenIps.map((ip) => (
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
