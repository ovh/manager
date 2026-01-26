import React, { useContext } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  MESSAGE_COLOR,
  MessageBody,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Link,
  Message,
  Select,
  Text,
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
  const { setOnGoingCreatedIps, setOnGoingAggregatedIps } = useContext(
    ListingContext,
  );
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
    loading,
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
      open
      heading={t('aggregateModalTitle', { ip: ipGroup })}
      loading={loading}
      onOpenChange={cancel}
      secondaryButton={{
        label: t('cancel', { ns: NAMESPACES.ACTIONS }),
        onClick: cancel,
        testId: 'cancel-button',
      }}
      primaryButton={{
        label: t('confirm', { ns: NAMESPACES.ACTIONS }),
        onClick: () => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['aggregate', 'confirm'],
          });
          postAggregate({ aggregationIp });
        },
        testId: 'confirm-button',
        loading: isAggregatePending,
        disabled: !aggregationIp,
      }}
    >
      {!loading && aggregate.length === 0 && !apiError && (
        <Message className="mb-4" color={MESSAGE_COLOR.warning}>
          <MessageBody className="inline">
            {t('noAggregateSliceAvailable')}
            <Link
              href={links.aggreateSliceLink?.link}
              target="_blank"
              rel="noopener"
              onClick={() => {
                trackClick({
                  actionType: 'action',
                  buttonType: ButtonType.link,
                  location: PageLocation.popup,
                  actions: [`go-to_${links?.aggreateSliceLink?.trackingLabel}`],
                });
              }}
            >
              {t('noAggregateLinkLabel')}
            </Link>
          </MessageBody>
        </Message>
      )}
      {aggregate.length > 0 && (
        <>
          <Text className="mb-4 block" preset={TEXT_PRESET.paragraph}>
            {t('aggregateModalDescription')}
          </Text>
          <Select
            className="block"
            name="aggregation-ip"
            value={[aggregationIp]}
            onValueChange={(e) => {
              const newValue = e.value;
              if (newValue) {
                setAggregationIp(newValue?.[0]);
              }
            }}
            items={aggregate.map((a) => ({
              label: a.aggregationIp,
              value: a.aggregationIp,
            }))}
          >
            <SelectControl />
            <SelectContent />
          </Select>
          <section className="mb-4 bg-neutral-100 p-4">
            <Text>{t('aggregateModalChildrenIpsDescription')}</Text>
            <ul>
              {aggregate
                .find((a) => a.aggregationIp === aggregationIp)
                ?.childrenIps.map((ip) => (
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
