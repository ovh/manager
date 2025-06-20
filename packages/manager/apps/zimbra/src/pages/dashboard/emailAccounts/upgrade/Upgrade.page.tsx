import React, { useContext } from 'react';
import {
  IconLinkAlignmentType,
  LinkType,
  Links,
  Subtitle,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  PageType,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useGenerateUrl } from '@/hooks';
import { BACK_PREVIOUS_PAGE, UPGRADE_SLOT } from '@/tracking.constants';
import { useAccount } from '@/data/hooks';
import { getZimbraPlatformAccountsQueryKey, ZimbraPlanCodes } from '@/data/api';
import { ZimbraBetaLink, ZimbraEmailsLink } from '@/contants';
import { useUpgradeMutation } from '@/data/hooks/account/useUpgradeMutation';

export const UpgradeAccount = () => {
  const { platformId, slotId } = useParams();
  const { trackClick, trackPage } = useOvhTracking();
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation(['accounts', 'common']);
  const navigate = useNavigate();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const goBackUrl = useGenerateUrl('../../..', 'href');
  const { data: account, isLoading } = useAccount();
  const { upgradeService, isSending } = useUpgradeMutation({
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: UPGRADE_SLOT,
      });
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_account_upgrade_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: UPGRADE_SLOT,
      });
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_account_upgrade_error_message', {
            error: error.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformAccountsQueryKey(platformId),
      });
    },
  });
  return (
    <div
      className="flex flex-col items-start mb-6"
      data-testid="upgrade-account-page"
    >
      <Links
        iconAlignment={IconLinkAlignmentType.left}
        type={LinkType.back}
        href={goBackUrl}
        onClickReturn={() => {
          trackClick({
            location: PageLocation.funnel,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: [UPGRADE_SLOT, BACK_PREVIOUS_PAGE],
          });
        }}
        label={t('zimbra_account_upgrade_cta_back')}
      />
      <Subtitle className="mt-5">{t('common:upgrade_account_pro')}</Subtitle>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {account?.currentState.email}
      </OdsText>
      <div className="flex flex-col gap-4 my-8">
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          <Trans
            t={t}
            i18nKey="zimbra_account_upgrade_new_offer"
            values={{
              zimbra_emails_link: ZimbraEmailsLink[ovhSubsidiary],
            }}
            components={{
              Link: (
                <Links
                  target="_blank"
                  type={LinkType.external}
                  onClickReturn={() => {
                    trackClick({
                      location: PageLocation.page,
                      buttonType: ButtonType.externalLink,
                      actionType: 'navigation',
                      actions: [UPGRADE_SLOT],
                    });
                  }}
                />
              ),
            }}
          />
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_account_upgrade_offer_details')}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          <Trans
            t={t}
            i18nKey="zimbra_account_upgrade_lab_page"
            values={{
              zimbra_beta_link: ZimbraBetaLink[ovhSubsidiary],
            }}
            components={{
              Link: (
                <Links
                  target="_blank"
                  type={LinkType.external}
                  onClickReturn={() => {
                    trackClick({
                      location: PageLocation.page,
                      buttonType: ButtonType.externalLink,
                      actionType: 'navigation',
                      actions: [UPGRADE_SLOT],
                    });
                  }}
                />
              ),
            }}
          />
        </OdsText>
      </div>
      <div className="flex gap-4">
        <OdsButton
          slot="actions"
          variant={ODS_BUTTON_VARIANT.outline}
          isLoading={isLoading || isSending}
          data-testid="cancel-btn"
          label={t('common:cancel')}
          onClick={() => navigate(-1)}
        />
        <OdsButton
          slot="actions"
          color={ODS_BUTTON_COLOR.primary}
          isLoading={isLoading || isSending}
          data-testid="upgrade-btn"
          label={t('common:upgrade_account_pro')}
          onClick={() =>
            upgradeService({
              serviceName: slotId,
              planCode: ZimbraPlanCodes.ZIMBRA_PRO,
              autoPay: true,
            })
          }
        />
      </div>
    </div>
  );
};

export default UpgradeAccount;
