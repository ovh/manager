import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOrderURL } from '@ovh-ux/manager-module-order';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  OsdsModal,
  OsdsButton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { handleClick } from '@/utils/ods-utils';
import { getExpressOrderLink } from '../order-utils';
import {
  ButtonType,
  PageLocation,
  PageName,
  PageType,
  TrackingClickParams,
  getClickProps,
} from '@/utils/tracking';

const trackingParams: TrackingClickParams = {
  pageName: PageName.createVrackServices,
  pageType: PageType.popup,
  buttonType: ButtonType.button,
  location: PageLocation.popup,
};

export type VrackConfirmModalProps = {
  displayName?: string;
  selectedRegion: string;
  onCancel: () => void;
  onDeny: () => void;
  onConfirm: () => void;
};

export const VrackConfirmModal: React.FC<VrackConfirmModalProps> = ({
  displayName,
  selectedRegion,
  onCancel,
  onConfirm,
  onDeny,
}) => {
  const { t } = useTranslation('vrack-services/create');
  const orderBaseUrl = useOrderURL('express_review_base');
  const {
    shell: {
      tracking: { trackClick },
    },
  } = React.useContext(ShellContext);

  const cancel = () => {
    trackClick(
      getClickProps({
        ...trackingParams,
        actions: ['cancel'],
      }),
    );
    onCancel();
  };

  return (
    <OsdsModal
      dismissible
      headline={t('modalHeadline')}
      onOdsModalClose={cancel}
    >
      <OsdsText
        className="block mb-4"
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('modalDescriptionLine1')}
      </OsdsText>
      <OsdsText
        className="block mb-4"
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('modalDescriptionLine2')}
      </OsdsText>
      <OsdsText
        className="block"
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('modalDescriptionLine3')}
      </OsdsText>
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(cancel)}
      >
        {t('modalCancelButtonLabel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.stroked}
        color={ODS_THEME_COLOR_INTENT.primary}
        target={OdsHTMLAnchorElementTarget._blank}
        href={getExpressOrderLink({
          orderBaseUrl,
          displayName,
          region: selectedRegion,
          includeVrackOrder: false,
        })}
        {...handleClick(() => {
          trackClick(
            getClickProps({
              ...trackingParams,
              actions: ['confirm', 'no-vrack'],
            }),
          );
          onDeny();
        })}
      >
        {t('modalNoVrackButtonLabel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        target={OdsHTMLAnchorElementTarget._blank}
        href={getExpressOrderLink({
          orderBaseUrl,
          displayName,
          region: selectedRegion,
          includeVrackOrder: true,
        })}
        {...handleClick(() => {
          trackClick(
            getClickProps({
              ...trackingParams,
              actions: ['confirm', 'create-vrack'],
            }),
          );
          onConfirm();
        })}
      >
        {t('modalConfirmVrackButtonLabel')}
      </OsdsButton>
    </OsdsModal>
  );
};
