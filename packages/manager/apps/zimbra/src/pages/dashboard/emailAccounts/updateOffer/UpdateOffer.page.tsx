import React, { useContext, useEffect, useMemo, useState } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  IconLinkAlignmentType,
  LinkType,
  Links,
  OvhSubsidiary,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import {
  ButtonType,
  PageLocation,
  PageType,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { Loading, PriceCard, TotalPriceCard } from '@/components';
import { ZimbraOffer, ZimbraPlanCodes, getZimbraPlatformAccountsQueryKey, order } from '@/data/api';
import { useOrderCatalog, useSlotWithService, useUpgradeOrder } from '@/data/hooks';
import { useUpgradeMutation } from '@/data/hooks/account/useUpgradeMutation';
import { useGenerateUrl } from '@/hooks';
import { BACK_PREVIOUS_PAGE, UPDATE_OFFER_SLOT } from '@/tracking.constants';

export const UpdateOffer = () => {
  const { platformId } = useParams();
  const context = useContext(ShellContext);
  const locale = context.environment.getUserLocale();
  const { ovhSubsidiary } = context.environment.getUser();
  const { trackClick, trackPage } = useOvhTracking();
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { t } = useTranslation(['accounts', 'common', NAMESPACES.ACTIONS]);
  const goBackUrl = useGenerateUrl('../../..', 'href');
  const { slotWithService, isLoading: isSlotWithServiceLoading } = useSlotWithService();
  const [selectedOffer, setSelectedOffer] = useState<string>(slotWithService?.offer);
  const { data: zimbraCatalog, isLoading: isOrderCatalogLoading } = useOrderCatalog({
    ovhSubsidiary,
  });
  const { data: upgradeOrder, isLoading: isUpgradeOrderLoading } = useUpgradeOrder({
    planCode:
      slotWithService?.offer === ZimbraOffer.STARTER
        ? ZimbraPlanCodes.ZIMBRA_PRO
        : ZimbraPlanCodes.ZIMBRA_STARTER,
    serviceName: slotWithService?.id,
  });

  const { upgradeService, isSending } = useUpgradeMutation({
    onSuccess: (data) => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: UPDATE_OFFER_SLOT,
      });
      clearNotifications();
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {slotWithService?.offer === ZimbraOffer.STARTER
            ? t('zimbra_account_upgrade_success_message')
            : t('zimbra_account_downgrade_success_message')}
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
        pageName: UPDATE_OFFER_SLOT,
      });
      clearNotifications();
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {slotWithService?.offer === ZimbraOffer.STARTER
            ? t('zimbra_account_upgrade_error_message', {
                error: error.response?.data?.message,
              })
            : t('zimbra_account_downgrade_error_message', {
                error: error.response?.data?.message,
              })}
        </OdsText>,
        true,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: getZimbraPlatformAccountsQueryKey(platformId),
      });
    },
  });

  const offerPrices = useMemo(() => {
    const prices = {};
    zimbraCatalog?.plans?.forEach((plan) => {
      prices[
        plan.planCode === String(ZimbraPlanCodes.ZIMBRA_PRO) ? ZimbraOffer.PRO : ZimbraOffer.STARTER
      ] = plan.pricings.find((price) =>
        price.capacities.includes(order.cart.GenericProductPricingCapacitiesEnum.RENEW),
      );
    });
    return prices;
  }, [zimbraCatalog]);

  useEffect(() => {
    if (selectedOffer === undefined && slotWithService?.offer) {
      setSelectedOffer(slotWithService?.offer);
    }
  }, [selectedOffer, slotWithService?.offer]);

  const handleOfferSelect = (offer: string) => {
    setSelectedOffer(offer);
  };

  const handleUpgrade = () => {
    upgradeService({
      planCode:
        slotWithService?.offer === ZimbraOffer.PRO
          ? ZimbraPlanCodes.ZIMBRA_STARTER
          : ZimbraPlanCodes.ZIMBRA_PRO,
      serviceName: slotWithService?.id,
    });
  };

  if (isSlotWithServiceLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-start mb-6" data-testid="update-offer-account-page">
      <Links
        iconAlignment={IconLinkAlignmentType.left}
        type={LinkType.back}
        href={goBackUrl}
        onClickReturn={() => {
          trackClick({
            location: PageLocation.funnel,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: [UPDATE_OFFER_SLOT, BACK_PREVIOUS_PAGE],
          });
        }}
        label={t('zimbra_account_upgrade_cta_back')}
      />
      <OdsText preset="heading-3" className="mt-5">
        {t('common:update_offer_title')}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{slotWithService?.email}</OdsText>
      <div className="flex justify-between w-full gap-8 my-8">
        <div className="grid grid-cols-3 gap-4">
          {Object.values(ZimbraOffer).map((planCode) => (
            <PriceCard
              key={planCode}
              planCode={planCode}
              price={offerPrices[planCode]}
              isLoading={isOrderCatalogLoading}
              isSelected={selectedOffer === planCode}
              isCurrentOffer={slotWithService?.offer === planCode}
              isDisabled={planCode === ZimbraOffer.BUSINESS}
              onSelect={() => handleOfferSelect(planCode)}
              locale={locale}
              subsidiary={ovhSubsidiary as OvhSubsidiary}
              className="max-w-xs"
            />
          ))}
        </div>
        <div className="flex">
          <TotalPriceCard
            total={upgradeOrder?.prices?.withoutTax}
            nextBilling={offerPrices[selectedOffer]}
            onUpgrade={handleUpgrade}
            isLoading={isUpgradeOrderLoading && isOrderCatalogLoading}
            isSending={isSending}
            isCurrentOffer={slotWithService?.offer === selectedOffer}
            locale={locale}
            subsidiary={ovhSubsidiary as OvhSubsidiary}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateOffer;
