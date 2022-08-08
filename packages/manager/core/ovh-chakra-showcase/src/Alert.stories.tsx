import { Alert, AlertIcon, CloseButton } from '@chakra-ui/react';
import {
  CloseIcon,
  ErrorCircleIcon,
  InfoCircleIcon,
  SuccessCircleIcon,
  WarningCircleIcon,
} from '@ovh-ux/manager-themes';

export default {
  title: 'Example/Alerts',
  component: Alert,
};

const TemplateInfo = () => (
  <Alert status="info">
    <AlertIcon as={InfoCircleIcon} />
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </Alert>
);
export const Info = TemplateInfo.bind({});

const TemplateSuccess = () => (
  <Alert status="success">
    <AlertIcon as={SuccessCircleIcon} />
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </Alert>
);
export const Success = TemplateSuccess.bind({});

const TemplateWarning = () => (
  <Alert status="warning">
    <AlertIcon as={WarningCircleIcon} />
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </Alert>
);
export const Warning = TemplateWarning.bind({});

const TemplateError = () => (
  <Alert status="error">
    <AlertIcon as={ErrorCircleIcon} />
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </Alert>
);
export const Error = TemplateError.bind({});

const TemplateNoIcon = () => (
  <Alert status="info">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </Alert>
);
export const NoIcon = TemplateNoIcon.bind({});

const TemplateDismissable = () => (
  <Alert status="info">
    <AlertIcon as={InfoCircleIcon} />
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    <CloseButton
      as={CloseIcon}
      position="absolute"
      right={'.25rem'}
      top={'.25rem'}
      boxSize={'1rem'}
      cursor={'pointer'}
      onClick={() => {}}
    />
  </Alert>
);
export const Dismissable = TemplateDismissable.bind({});
