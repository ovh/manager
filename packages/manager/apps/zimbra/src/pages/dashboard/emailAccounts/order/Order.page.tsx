import { useContext, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { getExpressOrderURL } from '@ovh-ux/manager-module-order';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Link, LinkType, useNotifications } from '@ovh-ux/muk';

import { Loading } from '@/components';
import { useOrderCatalog } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import { CANCEL, ORDER_ZIMBRA_EMAIL_ACCOUNT } from '@/tracking.constants';

import OrderCatalogForm from './OrderCatalogForm.component';

export const EmailAccountsOrder = () => {
  const { trackClick } = useOvhTracking();
  const { addError } = useNotifications();
  const { t } = useTranslation('accounts/order');
  const context = useContext(ShellContext);
  const locale = context.environment.getUserLocale();
  const { ovhSubsidiary } = context.environment.getUser();
  const region = context.environment.getRegion();
  const orderBaseURL = getExpressOrderURL(region, ovhSubsidiary);

  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path');

  const goBack = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [ORDER_ZIMBRA_EMAIL_ACCOUNT, CANCEL],
    });
    navigate(goBackUrl);
  };

  const {
    data: catalog,
    isLoading,
    isError,
    error,
  } = useOrderCatalog({
    productName: 'zimbra',
    ovhSubsidiary,
  });

  useEffect(() => {
    if (isError && error) {
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('zimbra_account_order_no_product_error_message')}
        </Text>,
        true,
      );
    }
  }, [isError, error]);

  return (
    <div className="mb-5 flex w-full flex-col items-start space-y-4 md:w-3/4">
      <Link type={LinkType.back} onClick={goBack}>
        {t('zimbra_account_order_cta_back')}
      </Link>
      <Text data-testid="page-title" preset={TEXT_PRESET.heading2} className="mb-6">
        {t('zimbra_account_order_title')}
      </Text>
      {isLoading ? (
        <Loading />
      ) : (
        <OrderCatalogForm
          catalog={catalog}
          locale={locale}
          orderBaseURL={orderBaseURL}
          goBack={goBack}
        />
      )}
    </div>
  );
};

export default EmailAccountsOrder;
