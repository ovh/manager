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
import { handleClick } from '@/utils/ods-utils';
import { getExpressOrderLink } from '../order-utils';

export type Props = {
  displayName?: string;
  selectedRegion: string;
  isModalVisible?: boolean;
  cancelDataTracking?: string;
  confirmDataTracking?: string;
  denyDataTracking?: string;
  onCancel: () => void;
  onDeny: () => void;
  onConfirm: () => void;
};

export const VrackConfirmModal: React.FC<Props> = ({
  displayName,
  selectedRegion,
  isModalVisible,
  cancelDataTracking,
  confirmDataTracking,
  denyDataTracking,
  onCancel,
  onConfirm,
  onDeny,
}) => {
  const { t } = useTranslation('vrack-services/create');
  const modal = React.useRef<HTMLOsdsModalElement>(null);
  const orderBaseUrl = useOrderURL('express_review_base');

  const cancel = () => {
    onCancel();
    modal.current.close();
  };

  const confirm = () => {
    onConfirm();
    modal.current.close();
  };

  const deny = () => {
    onDeny();
    modal.current.close();
  };

  return (
    <OsdsModal
      ref={modal}
      dismissible
      headline={t('modalHeadline')}
      masked={!isModalVisible || undefined}
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
        data-tracking={cancelDataTracking}
        {...handleClick(cancel)}
      >
        {t('modalCancelButtonLabel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.stroked}
        color={ODS_THEME_COLOR_INTENT.primary}
        data-tracking={denyDataTracking}
        target={OdsHTMLAnchorElementTarget._blank}
        href={getExpressOrderLink({
          orderBaseUrl,
          displayName,
          region: selectedRegion,
          includeVrackOrder: false,
        })}
        {...handleClick(deny)}
      >
        {t('modalNoVrackButtonLabel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        data-tracking={confirmDataTracking}
        target={OdsHTMLAnchorElementTarget._blank}
        href={getExpressOrderLink({
          orderBaseUrl,
          displayName,
          region: selectedRegion,
          includeVrackOrder: true,
        })}
        {...handleClick(confirm)}
      >
        {t('modalConfirmVrackButtonLabel')}
      </OsdsButton>
    </OsdsModal>
  );
};
