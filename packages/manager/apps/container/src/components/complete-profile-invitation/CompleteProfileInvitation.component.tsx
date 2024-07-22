import { useState } from 'react';
import {
  OsdsButton,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { TRACKING_PREFIX } from '@/components/complete-profile-invitation/constants';
import { User } from '@ovh-ux/manager-config';

type MissingInformation = {
  type: string; // to determine priority ?
  url: string;
};

const CompleteProfileInvitation = (): JSX.Element => {
  const { t } = useTranslation('payment-modal');
  const [showModal, setShowModal] = useState(false);
  const shell = useShell();
  const { ovhSubsidiary: subsidiary, legalform, companyNationalIdentificationNumber } = shell
    .getPlugin('environment')
    .getEnvironment()
    .getUser() as User;

  const missingSiretInformation = {
    type: 'SIRET',
    url: shell
      .getPlugin('navigation')
      .getURL('dedicated', '#/useraccount/infos?fieldToFocus=siretForm')
  };
  const missingInformation = [];
  // FIXME: should it be possible to have multiple "MissingInformation" at the same time ? if so what url / anchor ?
  // FIXME: should the condition for Siret missing information includes empty companyNationalIdentificationNumber ? if so how to test
  if (subsidiary === 'FR' && legalform === 'corporation' && !companyNationalIdentificationNumber) {
    missingInformation.push(missingSiretInformation);
  }

  const onClose = () => setShowModal(false);
  const onAccept = () =>  {
    setShowModal(false);
    const [{ url, type }] = missingInformation;
    shell.getPlugin('tracking').trackClick({
      name: `${TRACKING_PREFIX + type}::confirm`,
      type: 'action',
    });
    window.top.location.href = url;
  };

  /*
  const { data: paymentResponse } = useQuery({
    queryKey: ['me-payment-method'],
    queryFn: () => fetchIcebergV6<IPaymentMethod>({ route: '/me/payment/method' })
  });

  useEffect(() => {
    if (paymentResponse) {
      const alert = computeAlert(paymentResponse.data);
      if (alert) {
        setAlert(alert);
        setShowPaymentModal(true);
      }
    }
  }, [paymentResponse]);
  */

  return !missingInformation.length ? (
    <></>
  ) : (
    <OsdsModal
      onOdsModalClose={onClose}
      headline={t('payment_modal_title')}
      color={ODS_THEME_COLOR_INTENT.info}
    >
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        <p>{t(`payment_modal_description_${alert}`)}</p>
        <p>{t('payment_modal_description_sub')}</p>
      </OsdsText>

      <OsdsButton
        onClick={onClose}
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        size={ODS_BUTTON_SIZE.sm}
      >
        {t('payment_modal_action_cancel')}
      </OsdsButton>

      <OsdsButton
        onClick={onAccept}
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.flat}
        size={ODS_BUTTON_SIZE.sm}
      >
        {t('payment_modal_action_validate')}
      </OsdsButton>
    </OsdsModal>
  );
};

export default CompleteProfileInvitation;
