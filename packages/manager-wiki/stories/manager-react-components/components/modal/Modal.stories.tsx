import React from 'react';
import { MODAL_COLOR } from '@ovhcloud/ods-react';
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
  type = MODAL_COLOR.neutral,
  loading,
  primaryButton,
  secondaryButton,
  onOpenChange,
  open = true,
  children,
}) => {
  return (
    <Modal
      heading={heading}
      type={type}
      loading={loading}
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      onOpenChange={onOpenChange}
      open={open}
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
    include: ['onOpenChange', 'primaryButton', 'secondaryButton'],
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
    include: ['loading'],
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
