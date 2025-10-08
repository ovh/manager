import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OdsText,
  OdsLink,
  OdsMessage,
  OdsSelect,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET, ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import {
  fromIdToIp,
  ipFormatter,
  TRANSLATION_NAMESPACES,
  useGuideUtils,
} from '@/utils';
import { useByoipAggregate } from '@/data/hooks/ip';
import { ApiErrorMessage } from '@/components/ApiError/ApiErrorMessage';

export default function AggregateModal() {
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
      closeModal();
    },
  });

  const cancel = React.useCallback(() => {
    closeModal();
  }, []);

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
      onPrimaryButtonClick={() => postAggregate({ aggregationIp })}
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
              href={links.aggreateSliceLink}
              target="_blank"
              rel="noopener"
              label={t('noAggregateLinkLabel')}
            />
          </div>
        </OdsMessage>
      )}
      {aggregate.length > 0 && (
        <>
          <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
            {t('aggregateModalDescription')}
          </OdsText>
          <OdsSelect
            className="block"
            name="aggregation-ip"
            value={aggregationIp}
            onOdsChange={(e) => {
              const newValue = e.detail.value as string;
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
          <section className="bg-neutral-100 p-4 mb-4">
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
