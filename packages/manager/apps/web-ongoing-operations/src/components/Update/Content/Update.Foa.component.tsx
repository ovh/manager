import {
  BaseLayout,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import pLimit from 'p-limit';
import { toUnicode } from 'punycode';
import {
  Button,
  BUTTON_VARIANT,
  Checkbox,
  CheckboxCheckedChangeDetail,
  CheckboxControl,
  CheckboxLabel,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  RadioValueChangeDetail,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import SubHeader from '@/components/SubHeader/SubHeader';
import Loading from '@/components/Loading/Loading';
import { validateFoa } from '@/data/api/foa';
import { FoaChoiceEnum } from '@/enum/foa.enum';
import {
  useDomain,
  useGetDomainInformation,
  usePendingFoas,
} from '@/hooks/data/query';
import { useNichandle } from '@/hooks/nichandle/useNichandle';
import { useTrackNavigation } from '@/hooks/tracking/useTrackDatagridNavivationLink';
import { isFoaEligibleOperation, isPendingFoa } from '@/utils/foa.utils';
import { urls } from '@/routes/routes.constant';
import NotFound from '@/pages/404';

/**
 * Designated agent validation of a change of registrant. Answering engages
 * both holders and cannot be undone, so the outcome is an explicit choice —
 * accept or reject, nothing preselected — and the certification checkbox
 * remains the sole authorization gate : confirming stays disabled until both
 * are set, then every FOA of the task still awaiting an answer is validated
 * with the chosen choice.
 */
export default function UpdateFoaComponent() {
  const { t } = useTranslation(['dashboard', NAMESPACES.ACTIONS]);
  const { id, product } = useParams<{ id: string; product: string }>();
  const paramId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { trackPageNavivationButton } = useTrackNavigation();
  const {
    notifications,
    addError,
    addSuccess,
    clearNotifications,
  } = useNotifications();
  // Nothing preselected : an irreversible answer is never a default
  const [choice, setChoice] = useState<FoaChoiceEnum | null>(null);
  const [isCertified, setIsCertified] = useState(false);

  const { data: operation, isLoading: operationLoading } = useDomain(paramId);
  const domainName = operation?.domain ?? '';
  // A crafted url must dead-end on anything but a trade still running : a
  // finished or cancelled operation can no longer be answered
  const isOngoingTrade = isFoaEligibleOperation(operation);
  const {
    taskId,
    foas,
    pendingFoas,
    isDesignatedAgentAllowed,
    isLoading: foasLoading,
  } = usePendingFoas(domainName, isOngoingTrade);

  // Answering a FOA engages both holders, so only the admin contact of the
  // domain may do it. Fails open while the identity or the service info is
  // unknown : the real authorization is API side, this guard only avoids
  // offering an action the user is not entitled to.
  const { nichandle } = useNichandle();
  const { data: serviceInfo } = useGetDomainInformation(domainName);
  const isAdminContact =
    !nichandle || !serviceInfo || nichandle === serviceInfo.contactAdmin.id;

  const backToListing = () => {
    const url = `${urls.root}${product ?? ''}`;
    trackPageNavivationButton(url);
    navigate(url);
  };

  const { mutate: validateFoas, isPending } = useMutation({
    mutationFn: async (choice: FoaChoiceEnum) => {
      clearNotifications();
      const validateLimit = pLimit(1);
      // Answered FOAs are re-checked here so a holder answer landed in the
      // meantime is never overwritten by the designated agent
      const results = await Promise.allSettled(
        foas
          .filter(isPendingFoa)
          .map((foa) =>
            validateLimit(() =>
              validateFoa(domainName, taskId ?? '', foa.id, choice),
            ),
          ),
      );
      // A 409 means the FOA has just been finalized : idempotent no-op
      const [failure] = results.filter(
        (result): result is PromiseRejectedResult =>
          result.status === 'rejected' &&
          (result.reason as ApiError)?.response?.status !== 409,
      );
      if (failure) {
        throw failure.reason;
      }
    },
    onSuccess: async (_data, choice) => {
      await queryClient.invalidateQueries({
        queryKey: ['me', 'task'],
      });
      clearNotifications();
      addSuccess(
        <Text preset={TEXT_PRESET.paragraph}>
          {t(
            choice === FoaChoiceEnum.Accept
              ? 'domain_operations_foa_accept_success'
              : 'domain_operations_foa_reject_success',
          )}
        </Text>,
      );
      backToListing();
      // Not awaited : the answered FOAs are refreshed for the listing once
      // this page is left, so the entry point disappears from the row
      queryClient.invalidateQueries({
        queryKey: ['foa'],
      });
    },
    onError: async () => {
      // A 400 or a 404 both mean the local FOA data cannot be trusted anymore
      await queryClient.invalidateQueries({
        queryKey: ['foa'],
      });
      addError(<Text>{t('domain_operations_foa_error')}</Text>);
    },
  });

  if (operationLoading || foasLoading) {
    return <Loading />;
  }

  // Operation over or not a trade, no scheduled trade task, no FOA (404),
  // every FOA already answered or the registry forbids the designated agent
  // procedure on the domain : there is nothing a designated agent can
  // validate here
  if (
    !operation ||
    !isOngoingTrade ||
    !taskId ||
    pendingFoas.length === 0 ||
    !isDesignatedAgentAllowed
  ) {
    return <NotFound />;
  }

  return (
    <BaseLayout
      header={{
        title: t('domain_operations_dashboard_title'),
      }}
      message={notifications.length ? <Notifications /> : undefined}
    >
      <SubHeader
        title={t('domain_operations_foa_title', {
          t0: toUnicode(domainName),
        })}
      />
      <section className="flex flex-col gap-y-6">
        {/* Bounded measure : left to the full width of a large screen, the
            paragraph runs edge to edge and becomes hard to read */}
        <Text preset={TEXT_PRESET.paragraph} className="max-w-3xl">
          {t('domain_operations_foa_description')}
        </Text>

        {!isAdminContact && (
          <Text
            preset={TEXT_PRESET.paragraph}
            className="max-w-3xl"
            data-testid="foa-not-admin"
          >
            {t('domain_operations_update_contact_administrator')}
          </Text>
        )}

        {isAdminContact && (
          <>
            <RadioGroup
              name="choice"
              value={choice ?? undefined}
              disabled={isPending}
              onValueChange={(detail: RadioValueChangeDetail) => {
                if (detail?.value) {
                  setChoice(detail.value as FoaChoiceEnum);
                }
              }}
            >
              <Radio value={FoaChoiceEnum.Accept}>
                <RadioControl />
                <RadioLabel>
                  {/* ODS sets no colour on its labels, so they would fall
                      back to the browser black while every Text of the page
                      follows the theme. The span preset carries the same
                      style as paragraph, minus the <p> tag a label cannot
                      contain. */}
                  <Text preset={TEXT_PRESET.span}>
                    {t('domain_operations_foa_accept', {
                      t0: toUnicode(domainName),
                    })}
                  </Text>
                </RadioLabel>
              </Radio>
              <Radio value={FoaChoiceEnum.Reject}>
                <RadioControl />
                <RadioLabel>
                  <Text preset={TEXT_PRESET.span}>
                    {t('domain_operations_foa_reject', {
                      t0: toUnicode(domainName),
                    })}
                  </Text>
                </RadioLabel>
              </Radio>
            </RadioGroup>

            {/* One line whenever the viewport allows it : the certification
                is a single sentence, and it reads better in one go than the
                paragraph above, which keeps a bounded measure. `max-w-full`
                is still needed — ODS gives the wrapper a
                `width: max-content`, which would overflow a narrow screen
                instead of wrapping. `items-start` undoes the
                `align-items: center` of ODS, which floats the box between the
                lines once the sentence does wrap (de_DE is the longest, 158
                characters). */}
            <Checkbox
              checked={isCertified}
              disabled={isPending}
              name="certification"
              className="max-w-full items-start"
              onCheckedChange={(detail: CheckboxCheckedChangeDetail) =>
                setIsCertified(detail.checked === true)
              }
            >
              <CheckboxControl className="mt-1 shrink-0" />
              <CheckboxLabel>
                <Text preset={TEXT_PRESET.span}>
                  {t('domain_operations_foa_certification')}
                </Text>
              </CheckboxLabel>
            </Checkbox>
          </>
        )}

        <div className="flex gap-x-2 mt-8">
          <Button
            name="cancel"
            variant={BUTTON_VARIANT.ghost}
            disabled={isPending}
            onClick={backToListing}
          >
            {t(`${NAMESPACES.ACTIONS}:cancel`)}
          </Button>
          {isAdminContact && (
            <Button
              name="confirm"
              disabled={!choice || !isCertified || isPending}
              loading={isPending}
              onClick={() => {
                if (choice) {
                  validateFoas(choice);
                }
              }}
            >
              {t(`${NAMESPACES.ACTIONS}:confirm`)}
            </Button>
          )}
        </div>
      </section>
    </BaseLayout>
  );
}
