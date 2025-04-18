import React, { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useMutation } from '@tanstack/react-query';
import { useDomain, usePlatform } from '@/data/hooks';
import { Loading, InlineEmailAccountFormItem } from '@/components';
import {
  ZimbraOffer,
  getZimbraPlatformListQueryKey,
  formatAccountPayload,
  postZimbraPlatformAccount,
} from '@/data/api';
import { addEmailAccountsSchema, AddEmailAccountsSchema } from '@/utils';
import {
  CONFIRM,
  ONBOARDING_CONFIGURE_EMAIL_ACCOUNTS,
  SKIP,
} from '@/tracking.constants';
import queryClient from '@/queryClient';

export const ConfigureEmailAccounts: React.FC = () => {
  const { t } = useTranslation(['onboarding', 'common']);
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
      accounts: [
        { domain: domain?.currentState?.name, offer: ZimbraOffer.STARTER },
      ],
    });
  }, [domain]);

  const starterAccounts = useMemo(
    () =>
      (accounts || []).filter(
        (account) => account.offer === ZimbraOffer.STARTER,
      ),
    [accounts],
  );

  const { mutate: addEmailAccounts, isPending: isSending } = useMutation({
    mutationFn: (payload: AddEmailAccountsSchema) => {
      return Promise.allSettled(
        payload.accounts.map((acc) => {
          acc.displayName = `${acc.firstName} ${acc.lastName}`.trim();
          return postZimbraPlatformAccount(
            platformId,
            formatAccountPayload(acc),
          );
        }),
      );
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: ONBOARDING_CONFIGURE_EMAIL_ACCOUNTS,
      });
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('configure_success_message')}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
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
      <form
        onSubmit={methods.handleSubmit(handleConfirmClick)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-4">
          <OdsText
            preset={ODS_TEXT_PRESET.heading5}
          >{`Zimbra Starter (${starterAccounts.length}/${availableStarterAccounts})`}</OdsText>
          {fields.map((field, index) => (
            <InlineEmailAccountFormItem
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
            />
          ))}
          <OdsButton
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
            variant={ODS_BUTTON_VARIANT.ghost}
            icon={ODS_ICON_NAME.plus}
            isDisabled={
              (!methods.formState.isValid && starterAccounts.length !== 0) ||
              starterAccounts.length >= availableStarterAccounts
            }
            label={t('common:configure_another_account')}
          />
        </div>
        <div className="flex gap-4">
          <OdsButton
            id="confirm"
            data-testid="confirm"
            type="submit"
            isLoading={isSending}
            isDisabled={
              !methods.formState.isDirty || !methods.formState.isValid
            }
            label={t('common:configure')}
          />
          <OdsButton
            id="skip"
            data-testid="skip"
            onClick={handleSkipClick}
            variant={ODS_BUTTON_VARIANT.ghost}
            label={t('common:skip_step')}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default ConfigureEmailAccounts;
