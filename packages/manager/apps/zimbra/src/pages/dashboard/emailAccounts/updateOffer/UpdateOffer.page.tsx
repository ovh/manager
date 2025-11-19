import React, { useContext, useEffect, useMemo, useState } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import {
  ButtonType,
  PageLocation,
  PageType,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Link, LinkType, OvhSubsidiary, useNotifications } from '@ovh-ux/muk';

import { Loading, PriceCard, TotalPriceCard } from '@/components';
import { ZimbraOffer, ZimbraPlanCodes, getZimbraPlatformAccountsQueryKey, order } from '@/data/api';
import { useOrderCatalog, useSlotWithService, useUpgradeOrder } from '@/data/hooks';
import { useUpgradeMutation } from '@/data/hooks/account/useUpgradeMutation';
import { useGenerateUrl } from '@/hooks';
import { BACK_PREVIOUS_PAGE, UPDATE_OFFER_SLOT } from '@/tracking.constants';

const DRIVE_NOT_EMPTY_ERROR = 'Briefcase not empty';

export const UpdateOffer = () => {
  const { platformId } = useParams();
  const context = useContext(ShellContext);
  const locale = context.environment.getUserLocale();
  const { ovhSubsidiary } = context.environment.getUser();
  const { trackClick, trackPage } = useOvhTracking();
  const { addSuccess, addError, addWarning, clearNotifications } = useNotifications();
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
        <Text preset={TEXT_PRESET.paragraph}>
          {slotWithService?.offer === ZimbraOffer.STARTER
            ? t('zimbra_account_upgrade_success_message')
            : t('zimbra_account_downgrade_success_message')}
        </Text>,
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
      if (
        selectedOffer === ZimbraOffer.STARTER &&
        error.response?.data?.message?.includes(DRIVE_NOT_EMPTY_ERROR)
      ) {
        addWarning(
          <Text preset={TEXT_PRESET.paragraph}>
            {t('zimbra_account_downgrade_drive_not_empty_warning_message')}
          </Text>,
        );
      } else {
        addError(
          <Text preset={TEXT_PRESET.paragraph}>
            {slotWithService?.offer === ZimbraOffer.STARTER
              ? t('zimbra_account_upgrade_error_message', {
                  error: error.response?.data?.message,
                })
              : t('zimbra_account_downgrade_error_message', {
                  error: error.response?.data?.message,
                })}
          </Text>,
          true,
        );
      }
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
    const planCode =
      slotWithService?.offer === ZimbraOffer.PRO
        ? ZimbraPlanCodes.ZIMBRA_STARTER
        : ZimbraPlanCodes.ZIMBRA_PRO;

    upgradeService({
      planCode,
      serviceName: slotWithService?.id,
    });
  };

  if (isSlotWithServiceLoading) {
    return <Loading />;
  }

  return (
    <div className="mb-6 flex flex-col items-start" data-testid="update-offer-account-page">
      <Link
        type={LinkType.back}
        href={goBackUrl}
        onClick={() => {
          trackClick({
            location: PageLocation.funnel,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: [UPDATE_OFFER_SLOT, BACK_PREVIOUS_PAGE],
          });
        }}
      >
        {t('zimbra_account_upgrade_cta_back')}
      </Link>
      <Text preset="heading-3" className="mt-5">
        {t('common:update_offer_title')}
      </Text>
      <Text preset={TEXT_PRESET.paragraph}>{slotWithService?.email}</Text>
      <div className="my-8 flex w-full justify-between gap-8">
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
