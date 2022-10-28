import React from 'react';
import {
  Alert,
  AlertStatus,
  Box,
  CloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import {
  ErrorCircleIcon,
  InfoCircleIcon,
  SuccessCircleIcon,
  WarningCircleIcon,
} from '@ovh-ux/manager-themes';

export type MessageBoxMessage = {
  type: AlertStatus;
  message: string | React.ReactNode;
  error?: Error;
};

type MessageBoxProps = MessageBoxMessage & {
  dismissable?: boolean;
  onDismiss?: () => void;
};

export default function MessageBox({
  type,
  message,
  // error,
  dismissable,
  onDismiss,
}: MessageBoxProps): JSX.Element {
  const { isOpen: isVisible, onClose } = useDisclosure({
    defaultIsOpen: true,
    onClose: () => onDismiss,
  });

  let MessageBoxIcon;

  switch (type) {
    case 'error':
      MessageBoxIcon = ErrorCircleIcon;
      break;
    case 'info':
      MessageBoxIcon = InfoCircleIcon;
      break;
    case 'success':
      MessageBoxIcon = SuccessCircleIcon;
      break;
    case 'warning':
      MessageBoxIcon = WarningCircleIcon;
      break;
    default:
      MessageBoxIcon = React.Fragment;
      break;
  }

  return (
    <>
      {isVisible && (
        <Alert status={type}>
          <MessageBoxIcon mr={2} />
          <Box w="100%">{message}</Box>
          {dismissable && (
            <CloseButton
              position="relative"
              right={-1}
              top={-1}
              onClick={onClose}
            />
          )}
        </Alert>
      )}
    </>
  );
}
