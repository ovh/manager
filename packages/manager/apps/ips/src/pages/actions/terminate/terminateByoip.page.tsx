import React, { useContext, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsMessage,
  OdsModal,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { US_API_CONSOLE_LINK } from '../actions.constants';
import { LinkToOtherApp } from '@/components/LinkToOtherApp/LinkToOtherApp';

export default function TerminateByoip() {
  const { t } = useTranslation(['listing', NAMESPACES.ACTIONS]);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { environment } = useContext(ShellContext);
  const region = environment.getRegion();

  const closeModal = () => {
    navigate(`..?${search.toString()}`);
  };

  const closeHandler = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'exit',
      actions: ['delete_byoip', 'cancel'],
    });
    closeModal();
  };

  return (
    <OdsModal isOpen isDismissible onOdsClose={closeHandler}>
      <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.heading4}>
        {t('listingTerminateByoip_title')}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        <OdsMessage
          color="warning"
          className="block mb-4"
          isDismissible={false}
        >
          <OdsText>
            <Trans
              t={t}
              i18nKey={
                region !== 'US'
                  ? 'listingTerminateByoip_info1'
                  : 'listingTerminateByoip_info2'
              }
              components={{
                Link: (
                  <LinkToOtherApp
                    appName="billing"
                    path="#/autorenew/services"
                    params={{ searchText: 'byoip' }}
                    icon={ODS_ICON_NAME.externalLink}
                    forcedHref={
                      region === 'US' ? US_API_CONSOLE_LINK : undefined
                    }
                  />
                ),
              }}
            />
          </OdsText>
        </OdsMessage>
      </OdsText>
      <OdsButton
        slot="actions"
        label={t('close', { ns: NAMESPACES.ACTIONS })}
        onClick={closeHandler}
      />
    </OdsModal>
  );
}
