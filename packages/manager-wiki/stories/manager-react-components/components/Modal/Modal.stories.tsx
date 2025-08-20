import React from 'react';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { Modal } from '@ovh-ux/manager-react-components';
import {
  basic as basicMock,
  actions as actionsMock,
  type as typeMock,
  loading as loadingMock,
  other as otherMock,
} from './Modal.mock';

const ModalStory = ({
  heading,
  step,
  type = ODS_MODAL_COLOR.neutral,
  isLoading,
  primaryLabel,
  isPrimaryButtonLoading,
  isPrimaryButtonDisabled,
  onPrimaryButtonClick,
  secondaryLabel,
  isSecondaryButtonDisabled,
  isSecondaryButtonLoading,
  onSecondaryButtonClick,
  onDismiss,
  isOpen = true,
  children,
}) => {
  return (
    <Modal
      heading={heading}
      step={step}
      type={type}
      isLoading={isLoading}
      primaryLabel={primaryLabel}
      isPrimaryButtonLoading={isPrimaryButtonLoading}
      isPrimaryButtonDisabled={isPrimaryButtonDisabled}
      onPrimaryButtonClick={onPrimaryButtonClick}
      secondaryLabel={secondaryLabel}
      isSecondaryButtonDisabled={isSecondaryButtonDisabled}
      isSecondaryButtonLoading={isSecondaryButtonLoading}
      onSecondaryButtonClick={onSecondaryButtonClick}
      onDismiss={onDismiss}
      isOpen={isOpen}
    >
      {children}
    </Modal>
  );
};

export const Basic = ModalStory.bind({});

Basic.parameters = {
  controls: {
    include: ['heading', 'children'],
  },
};

Basic.args = basicMock;

export const Actions = ModalStory.bind({});

Actions.parameters = {
  controls: {
    include: [
      'onDismiss',
      'primaryLabel',
      'isPrimaryButtonLoading',
      'isPrimaryButtonDisabled',
      'onPrimaryButtonClick',
      'secondaryLabel',
      'isSecondaryButtonDisabled',
      'isSecondaryButtonLoading',
      'onSecondaryButtonClick',
    ],
  },
};

Actions.args = {
  ...basicMock,
  ...actionsMock,
};

export const Type = ModalStory.bind({});

Type.parameters = {
  controls: {
    include: ['type'],
  },
};

Type.args = {
  ...basicMock,
  ...actionsMock,
  ...typeMock,
};

export const Loading = ModalStory.bind({});

Loading.parameters = {
  controls: {
    include: ['isLoading'],
  },
};

Loading.args = {
  ...basicMock,
  ...actionsMock,
  ...loadingMock,
};

export const Full = ModalStory.bind({});

Full.args = {
  ...basicMock,
  ...typeMock,
  ...actionsMock,
  ...otherMock,
};

export default {
  title: 'Manager React Components/Components/Modal',
  component: Modal,
};
