import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ShellContext,
  useOvhTracking,
  PageType,
} from '@ovh-ux/manager-react-shell-client';

export default function SiretModal() {
  const { t } = useTranslation('hub/siret');
  const {
    shell: { navigation },
    environment: { user },
  } = useContext(ShellContext);
  const { trackClick, trackPage } = useOvhTracking();
  const modal = useRef<HTMLOsdsModalElement>(null);
  const [isClosed, setIsClosed] = useState(false);

  const shouldBeDisplayed = useMemo(
    () =>
      !user.companyNationalIdentificationNumber &&
      user.legalform === 'corporation' &&
      user.country === 'FR',
    [user],
  );

  const link = navigation.getURL('dedicated', '#/useraccount/infos', {
    fieldToFocus: 'siretForm',
  }) as Promise<string>;

  const cancel = async () => {
    trackClick({
      actionType: 'action',
      actions: ['hub', 'add-siret-popup', 'cancel'],
    });
    setIsClosed(() => true);
  };

  const confirm = async () => {
    trackClick({
      actionType: 'action',
      actions: ['hub', 'add-siret-popup', 'confirm'],
    });
    window.open(await link, '_top');
  };

  useEffect(() => {
    if (shouldBeDisplayed) {
      trackPage({
        pageType: PageType.popup,
        pageName: 'siret',
      });
    }
  }, [shouldBeDisplayed]);

  return shouldBeDisplayed ? (
    <OsdsModal
      masked={isClosed || undefined}
      dismissible
      color={ODS_THEME_COLOR_INTENT.default}
      headline={t('manager_hub_dashboard_modal_title')}
      onOdsModalClose={cancel}
      ref={modal}
      data-testid="siret_modal"
    >
      <slot name="content" data-testid="siret_modal_title">
        <OsdsText
          className="block mt-4 mb-2"
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('manager_hub_dashboard_modal_siret_part_1')}
        </OsdsText>
        <OsdsText
          className="block"
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('manager_hub_dashboard_modal_siret_part_2')}
        </OsdsText>
      </slot>
      <OsdsButton
        id="cancel"
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={cancel}
        data-testid="cancel_go_to_account_button"
      >
        {t('manager_hub_dashboard_modal_siret_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        onClick={confirm}
        color={ODS_THEME_COLOR_INTENT.primary}
        data-testid="confirm_go_to_account_button"
      >
        {t('manager_hub_dashboard_modal_siret_link')}
      </OsdsButton>
    </OsdsModal>
  ) : null;
}
