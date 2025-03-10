import { FC, useMemo } from 'react';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { DeepReadonly } from '@/types/utils.type';
import { TSectionType } from '../InstanceAction.page';
import { isCustomUrlSection, replaceToSnakeCase } from '@/utils';

type TActionModalProps = DeepReadonly<{
  type: TSectionType;
  instanceName: string;
}>;

export const ActionModalContent: FC<TActionModalProps> = ({
  type,
  instanceName,
}) => {
  const { t } = useTranslation('actions');

  const labels = useMemo((): string[] => {
    const sectionSnakeCase = isCustomUrlSection(type)
      ? replaceToSnakeCase(type)
      : type;
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
      case 'reinstall':
      case 'rescue/start':
      case 'rescue/end':
        return [confirmationMessage];
      case 'shelve':
        return [confirmationMessage, notaMessage];
      default:
        return [];
    }
  }, [instanceName, t, type]);

  const warningMessage = useMemo(() => {
    if (type === 'reinstall') {
      return t(`pci_instances_actions_${type}_instance_warning_message`);
    }
    return null;
  }, [type, t]);

  return (
    <>
      {labels.map((label) => (
        <OsdsText
          key={label}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._400}
          className="block mt-6"
        >
          {label}
        </OsdsText>
      ))}
      {warningMessage && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.warning} className="mt-6">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.warning}
          >
            {warningMessage}
          </OsdsText>
        </OsdsMessage>
      )}
    </>
  );
};
