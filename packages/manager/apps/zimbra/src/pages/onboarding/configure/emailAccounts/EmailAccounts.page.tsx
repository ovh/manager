import React, { useEffect, useMemo } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Button,
  Card,
  ICON_NAME,
  Icon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/muk';

import { InlineEmailAccountFormItem, Loading } from '@/components';
import {
  formatAccountPayload,
  getZimbraPlatformListQueryKey,
  postZimbraPlatformAccount,
} from '@/data/api';
import { useDomain, usePlatform, useSlotsWithService } from '@/data/hooks';
import queryClient from '@/queryClient';
import { CONFIRM, ONBOARDING_CONFIGURE_EMAIL_ACCOUNTS, SKIP } from '@/tracking.constants';
import { AddEmailAccountsSchema, addEmailAccountsSchema, allSettledSequential } from '@/utils';

export const ConfigureEmailAccounts: React.FC = () => {
  const { t } = useTranslation(['onboarding', 'common', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { trackClick, trackPage } = useOvhTracking();
  const { addSuccess } = useNotifications();

  const [searchParams] = useSearchParams();
  const domainId = searchParams.get('domain');

  useEffect(() => {
    if (!domainId) {
      navigate('../organization');
    }
  }, [domainId]);

  const { data: domain, isLoading: isLoadingDomain } = useDomain({
    domainId,
    enabled: !!domainId,
  });
  const { platformId } = usePlatform();

  const { slots, isLoadingSlots } = useSlotsWithService({
    gcTime: 0,
    used: 'false',
    shouldFetchAll: true,
  });

  const onClose = () => navigate(`/${platformId}/email_accounts`);

  const totalAvailableSlots = slots.length;

  const methods = useForm<AddEmailAccountsSchema>({
    mode: 'onTouched',
    resolver: zodResolver(addEmailAccountsSchema),
    defaultValues: {
      accounts: [{ domain: domain?.currentState?.name }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'accounts',
  });

  const accounts = methods.watch('accounts');

  useEffect(() => {
    methods.reset({
      accounts: [{ domain: domain?.currentState?.name }],
    });
  }, [domain, methods]);

  // Per-row available slots: every free slot minus those already picked by
  // sibling rows (the current row keeps its own pick to stay selectable).
  const availableSlotsByRow = useMemo(() => {
    return (accounts || []).map((row) => {
      const usedByOthers = new Set(
        (accounts || [])
          .filter((other) => other !== row && !!other.slotId)
          .map((other) => other.slotId),
      );
      return slots.filter((slot) => !usedByOthers.has(slot.id));
    });
  }, [accounts, slots]);

  const { mutate: addEmailAccounts, isPending: isSending } = useMutation({
    mutationFn: (payload: AddEmailAccountsSchema) => {
      // run post requests sequentially to avoid
      // concurrency bug on backend side
      return allSettledSequential(
        payload.accounts.map((acc) => {
          acc.displayName = `${acc.firstName} ${acc.lastName}`.trim();
          // each row already carries its own slotId / offer (picked in the
          // per-row Select), so we just forward the row to formatAccountPayload.
          return () => postZimbraPlatformAccount(platformId, formatAccountPayload(acc));
        }),
      );
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: ONBOARDING_CONFIGURE_EMAIL_ACCOUNTS,
      });
      addSuccess(
        <Text preset={TEXT_PRESET.paragraph}>{t('configure_success_message')}</Text>,
        true,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: getZimbraPlatformListQueryKey(),
      });
      onClose();
    },
  });

  const handleConfirmClick: SubmitHandler<AddEmailAccountsSchema> = (data) => {
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [ONBOARDING_CONFIGURE_EMAIL_ACCOUNTS, CONFIRM],
    });

    addEmailAccounts(data);
  };

  const handleSkipClick = () => {
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [ONBOARDING_CONFIGURE_EMAIL_ACCOUNTS, SKIP],
    });

    onClose();
  };

  if (isLoadingDomain || isLoadingSlots) {
    return <Loading />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleConfirmClick)} className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-4">
          <Text preset={TEXT_PRESET.heading5}>
            {t('configure_emailAccounts_counter', {
              count: accounts?.length ?? 0,
              total: totalAvailableSlots,
            })}
          </Text>
          {fields.map((field, index) => (
            <Card key={field.id} color="neutral" className="p-4">
              <InlineEmailAccountFormItem
                key={field.id}
                index={index}
                onRemove={() => remove(index)}
                availableSlots={availableSlotsByRow[index] ?? []}
                isLoadingSlots={isLoadingSlots}
              />
            </Card>
          ))}
          <Button
            id="add-starter-account"
            data-testid="add-starter-account"
            className="self-start"
            type="button"
            onClick={() => {
              if (accounts.length === 0) {
                // necessary to prevent bug where
                // row is validated if added when
                // there was 0 accounts
                methods.reset({
                  accounts: [{ domain: domain?.currentState?.name }],
                });
              } else {
                append({ domain: domain?.currentState?.name });
              }
            }}
            variant={BUTTON_VARIANT.ghost}
            disabled={
              (!methods.formState.isValid && accounts.length !== 0) ||
              accounts.length >= totalAvailableSlots ||
              isSending
            }
          >
            <>
              {t('common:configure_another_account')}
              <Icon name={ICON_NAME.plus} />
            </>
          </Button>
        </div>
        <div className="flex gap-4">
          <Button
            id="confirm"
            data-testid="confirm"
            type="submit"
            loading={isSending}
            disabled={!methods.formState.isDirty || !methods.formState.isValid}
          >
            {t(`${NAMESPACES.ACTIONS}:configure`)}
          </Button>
          <Button
            id="skip"
            data-testid="skip"
            onClick={handleSkipClick}
            disabled={isSending}
            variant={BUTTON_VARIANT.ghost}
          >
            {t('common:skip_step')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ConfigureEmailAccounts;
