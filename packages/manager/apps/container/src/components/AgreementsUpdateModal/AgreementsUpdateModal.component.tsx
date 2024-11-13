import React, { useContext, useEffect } from 'react';
import useAgreementsUpdate from '@/hooks/agreements/useAgreementsUpdate';
import { ODS_THEME_COLOR_HUE, ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { OsdsButton, OsdsModal, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import ApplicationContext from '@/context';
import ovhCloudLogo from '@/assets/images/logo-ovhcloud.png';
import { useAuthorizationIam } from '@ovh-ux/manager-react-components/src/hooks/iam';
import useAccountUrn from '@/hooks/accountUrn/useAccountUrn';
import { ModalTypes } from '@/context/modals/modals.context';
import { useModals } from '@/context/modals';

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
    '#/billing/autoRenew/agreements',
  );
  const { t } = useTranslation('agreements-update-modal');
  const { data: urn } = useAccountUrn({ enabled: region !== 'US' && current === ModalTypes.agreements && window.location.href !== myContractsLink });
  const { isAuthorized: canUserAcceptAgreements } = useAuthorizationIam(['account:apiovh:me/agreements/accept'], urn);
  const { data: agreements } = useAgreementsUpdate({ enabled: canUserAcceptAgreements });
  const goToContractPage = () => {
    navigation.navigateTo('dedicated', `#/billing/autoRenew/agreements`);
  };

  useEffect(() => {
    if (canUserAcceptAgreements && !agreements?.length && current === ModalTypes.agreements) {
      shell.getPlugin('ux').notifyModalActionDone();
    }
  }, [canUserAcceptAgreements, agreements, current]);

  return agreements?.length ? (
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
          <p
            className="mt-6"
            dangerouslySetInnerHTML={{
              __html: t('agreements_update_modal_description', {
                link: myContractsLink,
              }),
            }}
          ></p>
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
