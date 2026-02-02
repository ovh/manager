import React, { useEffect, useMemo } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT, Button, ICON_NAME, Icon, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

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
  ZimbraOffer,
  formatAccountPayload,
  getZimbraPlatformListQueryKey,
  postZimbraPlatformAccount,
} from '@/data/api';
import { useDomain, usePlatform } from '@/data/hooks';
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
  const { data: platform, platformId } = usePlatform();

  const onClose = () => navigate(`/${platformId}/email_accounts`);

  const availableStarterAccounts = useMemo(() => {
    return (
      platform?.currentState?.accountsStatistics.find(
        (stats) => stats.offer === ZimbraOffer.STARTER,
      )?.availableAccountsCount || 0
    );
  }, [platform]);

  const methods = useForm<AddEmailAccountsSchema>({
    mode: 'onTouched',
    resolver: zodResolver(addEmailAccountsSchema),
    defaultValues: {
      accounts: [
        // @TODO: remove offer when backend doesn't require that anymore
        { domain: domain?.currentState?.name, offer: ZimbraOffer.STARTER },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'accounts',
  });

  const accounts = methods.watch('accounts');

  useEffect(() => {
    methods.reset({
      accounts: [{ domain: domain?.currentState?.name, offer: ZimbraOffer.STARTER }],
    });
  }, [domain, methods]);

  const starterAccounts = useMemo(
    () => (accounts || []).filter((account) => account.offer === ZimbraOffer.STARTER),
    [accounts],
  );

  const { mutate: addEmailAccounts, isPending: isSending } = useMutation({
    mutationFn: (payload: AddEmailAccountsSchema) => {
      // run post requests sequentially to avoid
      // concurrency bug on backend side
      return allSettledSequential(
        payload.accounts.map((acc) => {
          acc.displayName = `${acc.firstName} ${acc.lastName}`.trim();
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

  if (isLoadingDomain) {
    return <Loading />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleConfirmClick)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <Text
            preset={TEXT_PRESET.heading5}
          >{`Zimbra Starter (${starterAccounts.length}/${availableStarterAccounts})`}</Text>
          {fields.map((field, index) => (
            <InlineEmailAccountFormItem
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
            />
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
                  accounts: [
                    {
                      domain: domain?.currentState?.name,
                      offer: ZimbraOffer.STARTER,
                    },
                  ],
                });
              } else {
                append({
                  domain: domain?.currentState?.name,
                  offer: ZimbraOffer.STARTER,
                });
              }
            }}
            variant={BUTTON_VARIANT.ghost}
            disabled={
              (!methods.formState.isValid && starterAccounts.length !== 0) ||
              starterAccounts.length >= availableStarterAccounts ||
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
