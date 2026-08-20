import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import pLimit from 'p-limit';
import {
  Button,
  BUTTON_VARIANT,
  Checkbox,
  CheckboxCheckedChangeDetail,
  CheckboxControl,
  CheckboxLabel,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { validateFoa } from '@/data/api/foa';
import { FoaChoiceEnum } from '@/enum/foa.enum';
import { isPendingFoa } from '@/utils/foa.utils';
import { urls } from '@/routes/routes.constant';
import { useTrackNavigation } from '@/hooks/tracking/useTrackDatagridNavivationLink';
import { TFoa } from '@/types';

interface FoaActionsProps {
  readonly domainName: string;
  readonly taskId: string;
  readonly foas: TFoa[];
  readonly product: string;
}

export default function FoaActions({
  domainName,
  taskId,
  foas,
  product,
}: FoaActionsProps) {
  const { t } = useTranslation(['dashboard', NAMESPACES.ACTIONS]);
  const { trackPageNavivationButton } = useTrackNavigation();
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCertified, setIsCertified] = useState(false);

  const backToListing = () => {
    const url = `${urls.root}${product}`;
    trackPageNavivationButton(url);
    navigate(url);
  };

  const {
    mutate: validateFoas,
    isPending,
    variables: submittedChoice,
  } = useMutation({
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
              validateFoa(domainName, taskId, foa.id, choice),
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

  return (
    <section className="flex flex-col gap-y-6">
      <Checkbox
        checked={isCertified}
        disabled={isPending}
        name="certification"
        onCheckedChange={(detail: CheckboxCheckedChangeDetail) =>
          setIsCertified(detail.checked === true)
        }
      >
        <CheckboxControl />
        <CheckboxLabel>
          {t('domain_operations_foa_certification')}
        </CheckboxLabel>
      </Checkbox>

      <div className="flex gap-x-2 mt-8">
        <Button
          name="cancel"
          variant={BUTTON_VARIANT.ghost}
          disabled={isPending}
          onClick={backToListing}
        >
          {t(`${NAMESPACES.ACTIONS}:cancel`)}
        </Button>
        <Button
          name="reject"
          variant={BUTTON_VARIANT.outline}
          disabled={!isCertified || isPending}
          loading={isPending && submittedChoice === FoaChoiceEnum.Reject}
          onClick={() => validateFoas(FoaChoiceEnum.Reject)}
        >
          {t('domain_operations_foa_reject')}
        </Button>
        <Button
          name="accept"
          disabled={!isCertified || isPending}
          loading={isPending && submittedChoice === FoaChoiceEnum.Accept}
          onClick={() => validateFoas(FoaChoiceEnum.Accept)}
        >
          {t('domain_operations_foa_accept')}
        </Button>
      </div>
    </section>
  );
}
