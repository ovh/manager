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
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useGenerateUrl } from '@/hooks';
import { BACK_PREVIOUS_PAGE, UPGRADE_SLOT } from '@/tracking.constants';
import { useSlot } from '@/data/hooks';
import { getZimbraPlatformAccountsQueryKey, ZimbraPlanCodes } from '@/data/api';
import { ZimbraEmailsLink, ZimbraLabsLink } from '@/constants';
import { useUpgradeMutation } from '@/data/hooks/account/useUpgradeMutation';

export const UpgradeAccount = () => {
  const { platformId, slotId } = useParams();
  const { trackClick, trackPage } = useOvhTracking();
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { t } = useTranslation(['accounts', 'common', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const goBackUrl = useGenerateUrl('../../..', 'href');
  const { data: slot, isLoading } = useSlot();
  const { upgradeService, isSending } = useUpgradeMutation({
    onSuccess: (data) => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: UPGRADE_SLOT,
      });
      clearNotifications();
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_account_upgrade_success_message')}
        </OdsText>,
        true,
      );
      if (data?.order?.url) {
        window.open(data.order.url, '_blank', 'noopener,noreferrer');
      }
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: UPGRADE_SLOT,
      });
      clearNotifications();
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
        {slot?.currentState.email}
      </OdsText>
      <div className="flex flex-col gap-4 my-8">
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          <Trans
            t={t}
            i18nKey="zimbra_account_upgrade_new_offer"
            values={{
              zimbra_emails_link:
                ZimbraEmailsLink[ovhSubsidiary] || ZimbraEmailsLink.DEFAULT,
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
              zimbra_beta_link: ZimbraLabsLink,
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
          label={t(`${NAMESPACES.ACTIONS}:cancel`)}
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
              autoPay: false,
            })
          }
        />
      </div>
    </div>
  );
};

export default UpgradeAccount;
