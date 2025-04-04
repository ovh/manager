import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsLink,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import { usePendingAgreements, useAgreementsUpdate } from '@/hooks/agreements/usePendingAgreements';
import ApplicationContext from '@/context';
import ovhCloudLogo from '@/assets/images/logo-ovhcloud.png';

export default function AgreementsUpdateModal () {
  const { shell } = useContext(ApplicationContext);
  const environment = shell
    .getPlugin('environment')
    .getEnvironment();
  const ux = shell.getPlugin('ux');
  const navigation = shell.getPlugin('navigation');

  // TODO: simplify this once new-billing is fully open to the public
  const isNewBillingAvailable = Boolean(environment.getApplicationURL('new-billing'));
  const billingAppName = isNewBillingAvailable ? 'new-billing' : 'dedicated';
  const billingAppPath = `#/${isNewBillingAvailable ? '' : 'billing/'}autorenew/agreements`;
  const myContractsLink = navigation.getURL(billingAppName, billingAppPath);

  const { t } = useTranslation('agreements-update-modal');
  const { isReady, shouldBeDisplayed } = useAgreementsUpdate(myContractsLink);
  const [ showModal, setShowModal ] = useState(true);



  const goToContractPage = () => {
    setShowModal(false);
    navigation.navigateTo(billingAppName, billingAppPath);
  };

  /*
   Since we don't want to display multiple modals at the same time we "watch" the `current` modal, and once it is
   the agreements modal turn, we will try to display it (if conditions are met) or switch to the next one otherwise.
   As a result, only once the agreements modal is the current one will we manage the modal lifecycle.
   Lifecycle management:
    - If user is on the agreements page, we will not display the modal and let the page notify for modal change
    once the user accept non-validated agreements or leave the page
    - Wait until all necessary data (IAM authorization, non-validated agreements list) are loaded
    - Once we have the data, check if they allow the display of the modal (IAM authorized + at least one non-validated
    agreement), if the conditions are met, we show the modal, otherwise we switch to the next one
   */

  useEffect(() => {
    if (isReady && !shouldBeDisplayed) {
      ux.notifyModalActionDone();
    }
  }, [isReady]);

  return shouldBeDisplayed && showModal ? (
    <>
      <OsdsModal
        dismissible={false}
        className="text-center"
        color={ODS_THEME_COLOR_INTENT.info}
        data-testid="agreements-update-modal"
      >
        <div className="w-full flex justify-center items-center mb-6">
          <img
            src={ovhCloudLogo} alt="ovh-cloud-logo"
            height={40}
          />
        </div>
        <OsdsText
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          hue={ODS_THEME_COLOR_HUE._800}
        >
          {t('agreements_update_modal_title')}
        </OsdsText>
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          hue={ODS_THEME_COLOR_HUE._800}
        >
          <p className="mt-6">
            <Trans
              i18nKey="agreements_update_modal_description"
              t={t}
              components={{
                anchor: (
                  <OsdsLink
                    href={myContractsLink}
                    target={OdsHTMLAnchorElementTarget._top}
                    onClick={() => setShowModal(false)}
                  ></OsdsLink>
                ),
              }}
            />
          </p>
        </OsdsText>

        <OsdsButton
          onClick={goToContractPage}
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.flat}
          size={ODS_BUTTON_SIZE.sm}
        >
          {t('agreements_update_modal_action')}
        </OsdsButton>
      </OsdsModal>
    </>
  ) : null;
}
