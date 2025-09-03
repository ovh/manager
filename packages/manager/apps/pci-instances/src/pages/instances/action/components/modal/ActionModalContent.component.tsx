import { FC, useMemo } from 'react';
import {
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Skeleton,
  Text,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { isCustomUrlSection, replaceToSnakeCase } from '@/utils';
import { TSectionType } from '@/types/instance/action/action.type';
import { TInstanceActionModalViewModel } from '../../view-models/selectInstanceForActionModal';

type TActionModalProps = React.PropsWithChildren<{
  type: TSectionType;
  instance: TInstanceActionModalViewModel;
  isLoading: boolean;
}>;

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
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment  */}
      {[...new Array(3)].map((_elt, index) => (
        <Skeleton key={index} />
      ))}
    </div>
  ) : (
    <>
      {labels.map((label) => (
        <Text key={label} className="block mt-6">
          {label}
        </Text>
      ))}
      {children}
      {warningMessage && (
        <Message
          color={MESSAGE_COLOR.warning}
          className="mt-6"
          dismissible={false}
        >
          <MessageIcon name={ICON_NAME.triangleExclamation} />
          <MessageBody>{warningMessage}</MessageBody>
        </Message>
      )}
    </>
  );
};
