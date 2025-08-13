import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { HandleLinkNavigation } from './handleLink.component';

export default function TerminateByoip() {
  const { t } = useTranslation(['listing', NAMESPACES.ACTIONS]);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const shell = useContext(ShellContext);
  const region = useMemo(() => shell?.environment.getRegion(), [shell]);

  const closeModal = () => {
    navigate('..');
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
                Link: <HandleLinkNavigation params={{ searchText: 'byoip' }} />,
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
