import { useContext, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { getExpressOrderURL } from '@ovh-ux/manager-module-order';
import {
  IconLinkAlignmentType,
  LinkType,
  Links,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

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
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_account_order_no_product_error_message')}
        </OdsText>,
        true,
      );
    }
  }, [isError, error]);

  return (
    <div className="mb-5 flex w-full flex-col items-start space-y-4 md:w-3/4">
      <Links
        type={LinkType.back}
        onClickReturn={goBack}
        label={t('zimbra_account_order_cta_back')}
        iconAlignment={IconLinkAlignmentType.left}
      />
      <OdsText data-testid="page-title" preset={ODS_TEXT_PRESET.heading2} className="mb-6">
        {t('zimbra_account_order_title')}
      </OdsText>
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
