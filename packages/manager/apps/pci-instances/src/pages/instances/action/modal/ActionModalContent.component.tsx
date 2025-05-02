import { FC, useMemo } from 'react';
import {
  OsdsMessage,
  OsdsSkeleton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { isCustomUrlSection, replaceToSnakeCase } from '@/utils';
import { DeepReadonly } from '@/types/utils.type';
import { TSectionType } from '@/types/instance/action/action.type';
import { TInstanceDto } from '@/types/instance/api.type';

type TActionModalProps = DeepReadonly<
  React.PropsWithChildren<{
    type: TSectionType;
    instance?: TInstanceDto;
    isLoading: boolean;
  }>
>;

export const ActionModalContent: FC<TActionModalProps> = ({
  type,
  instance,
  children,
  isLoading,
}) => {
  const { t } = useTranslation('actions');

  const { name, isImageDeprecated } = instance ?? {};

  const labels = useMemo((): string[] => {
    const sectionSnakeCase = isCustomUrlSection(type)
      ? replaceToSnakeCase(type)
      : type;
    const confirmationMessage = t(
      `pci_instances_actions_${sectionSnakeCase}_instance_confirmation_message`,
      {
        name,
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
      case 'rescue/start':
      case 'rescue/end':
        return [confirmationMessage];
      case 'reinstall':
        return isImageDeprecated
          ? [
              t(
                'pci_instances_actions_new_image_reinstall_instance_confirmation_message',
              ),
            ]
          : [confirmationMessage];
      case 'shelve':
        return [confirmationMessage, notaMessage];
      default:
        return [];
    }
  }, [name, isImageDeprecated, t, type]);

  const warningMessage = useMemo(() => {
    if (
      type === 'reinstall' ||
      type === 'billing/monthly/activate' ||
      type === 'backup'
    ) {
      const sectionSnakeCase = isCustomUrlSection(type)
        ? replaceToSnakeCase(type)
        : type;
      return t(
        `pci_instances_actions_${sectionSnakeCase}_instance_warning_message`,
      );
    }

    return null;
  }, [type, t]);

  return isLoading ? (
    <div className="pt-6">
      {[...new Array(3)].map((_elt, index) => (
        <OsdsSkeleton key={index} />
      ))}
    </div>
  ) : (
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
      {children}
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
