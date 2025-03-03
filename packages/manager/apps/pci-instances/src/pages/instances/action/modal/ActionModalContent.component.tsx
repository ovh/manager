import { FC, useCallback } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { DeepReadonly } from '@/types/utils.type';
import { TSectionType } from '../InstanceAction.page';
import { kebabToSnakeCase } from '@/utils';

type TActionModalProps = DeepReadonly<{
  type: TSectionType;
  instanceName: string;
}>;

export const ActionModalContent: FC<TActionModalProps> = ({
  type,
  instanceName,
}) => {
  const { t } = useTranslation('actions');
  const getLabels = useCallback((): string[] => {
    const sectionSnakeCase = type.includes('-') ? kebabToSnakeCase(type) : type;
    const confirmationMessage = t(
      `pci_instances_actions_${sectionSnakeCase}_instance_confirmation_message`,
      {
        name: instanceName,
      },
    );
    const notaMessage = t(
      `pci_instances_actions_${sectionSnakeCase}_instance_nota_message`,
    );
    switch (type) {
      case 'delete':
      case 'stop':
      case 'start':
      case 'unshelve':
      case 'soft-reboot':
      case 'hard-reboot':
        return [confirmationMessage];
      case 'shelve':
        return [confirmationMessage, notaMessage];
      default:
        return [];
    }
  }, [instanceName, t, type]);

  return getLabels().map((label) => (
    <OsdsText
      key={label}
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      color={ODS_THEME_COLOR_INTENT.text}
      size={ODS_TEXT_SIZE._400}
      className="block mt-6"
    >
      {label}
    </OsdsText>
  ));
};
