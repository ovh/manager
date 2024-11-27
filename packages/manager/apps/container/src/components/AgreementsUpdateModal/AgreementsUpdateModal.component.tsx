import React, { useContext, useEffect, useMemo, useState } from 'react';
import useAgreementsUpdate from '@/hooks/agreements/useAgreementsUpdate';
import { ODS_THEME_COLOR_HUE, ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { OsdsButton, OsdsLink, OsdsModal, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { Trans, useTranslation } from 'react-i18next';
import ApplicationContext from '@/context';
import ovhCloudLogo from '@/assets/images/logo-ovhcloud.png';
import { useAuthorizationIam } from '@ovh-ux/manager-react-components/src/hooks/iam';
import useAccountUrn from '@/hooks/accountUrn/useAccountUrn';
import { ModalTypes } from '@/context/modals/modals.context';
import { useModals } from '@/context/modals';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { requiredStatusKey } from '@/identity-documents-modal/constants';

export default function AgreementsUpdateModal () {
  const { shell } = useContext(ApplicationContext);
  const region: string = shell
    .getPlugin('environment')
    .getEnvironment()
    .getRegion();
  const navigation = shell.getPlugin('navigation');
  const { current } = useModals();
  const myContractsLink = navigation.getURL(
    'dedicated',
    '#/billing/autorenew/agreements',
  );
  const [ showModal, setShowModal ] = useState(false);
  const shouldTryToDisplay = useMemo(() => region !== 'US' && current === ModalTypes.agreements && window.location.href !== myContractsLink, [region, current, window.location.href]);
  const { t } = useTranslation('agreements-update-modal');
  const { data: urn } = useAccountUrn({ enabled: shouldTryToDisplay });
  const { isAuthorized: canUserAcceptAgreements, isLoading: isAuthorizationLoading } = useAuthorizationIam(['account:apiovh:me/agreements/accept'], urn);
  const { data: agreements, isLoading: areAgreementsLoading } = useAgreementsUpdate({ enabled: canUserAcceptAgreements });
  const goToContractPage = () => {
    setShowModal(false);
    navigation.navigateTo('dedicated', `#/billing/autorenew/agreements`);
  };

  useEffect(() => {
    const shouldManageModal = region !== 'US' && current === ModalTypes.agreements && window.location.href !== myContractsLink;
    // We consider we have loaded all information if conditions are not respected to try to display the modal
    const hasFullyLoaded = !shouldManageModal
      // Or authorization are loaded but user does have right to accept contract or has no contract to accept
      || !isAuthorizationLoading && (!canUserAcceptAgreements || !areAgreementsLoading);
    // We handle the modal display only when the Agreements modal is the current one, contract management is available
    // (region is not US) and we are not on the page where the user can do the related action (accepts his contract)
    if (shouldManageModal) {
      // We will wait for all data to be retrieved before handling the modal lifecycle
      if (hasFullyLoaded) {
        // If no contract are to be accepted we go to the next modal (if it exists)
        if (!agreements?.length) {
          shell.getPlugin('ux').notifyModalActionDone();
        }
        // Otherwise we display the modal
        else {
          setShowModal(true);
        }
      }
    }
  }, [canUserAcceptAgreements, isAuthorizationLoading, canUserAcceptAgreements, areAgreementsLoading, agreements, current]);

  return showModal ? (
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
