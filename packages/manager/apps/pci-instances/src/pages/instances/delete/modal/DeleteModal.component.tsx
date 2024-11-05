import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@/components/spinner/Spinner.component';
import { DeepReadonly } from '@/types/utils.type';

type TDeleteModalProps = DeepReadonly<{
  instanceName: string;
  isPending: boolean;
  onModalClose: () => void;
  onModalConfirm: () => void;
}>;

export const DeleteModal: FC<TDeleteModalProps> = ({
  instanceName,
  isPending,
  onModalClose,
  onModalConfirm,
}) => {
  const { t } = useTranslation(['delete', 'common']);

  return (
    <OsdsModal
      headline={t('pci_instances_delete_instance_title')}
      onOdsModalClose={onModalClose}
    >
      <slot name="content">
        {isPending ? (
          <Spinner />
        ) : (
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._400}
            className="block mt-6"
          >
            {t('pci_instances_delete_instance_confirmation_message', {
              name: instanceName,
            })}
          </OsdsText>
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onModalClose}
      >
        {t('common:pci_instances_common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onModalConfirm}
        {...(isPending && { disabled: true })}
      >
        {t('common:pci_instances_common_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
};
