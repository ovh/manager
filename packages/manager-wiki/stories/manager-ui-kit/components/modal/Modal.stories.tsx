import React, { useState } from 'react';
import { Modal, Button, MODAL_TYPE } from '@ovh-ux/muk';
import {
  actions as actionsMock,
  basic as basicMock,
  loading as loadingMock,
  other as otherMock,
  step as stepMock,
  type as typeMock,
} from './Modal.mock';

const ModalStory = ({
  heading,
  type = MODAL_TYPE.information,
  loading,
  primaryButton,
  secondaryButton,
  open = false,
  children,
  step,
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const handleOpenChange = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        heading={heading}
        type={type}
        loading={loading}
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
        onOpenChange={handleOpenChange}
        open={isOpen}
        step={step}
      >
        {children}
      </Modal>
    </>
  );
};

export const Basic = ModalStory.bind({});

Basic.parameters = {
  argTypes: {
    open: { control: 'boolean' },
  },
  controls: {
    include: ['heading', 'children'],
  },
  docs: {
    source: {
      code: `<Modal
  heading="Example of modal"
  open={true}
>
  <div>Example of content</div>
</Modal>`,
    },
  },
};

Basic.args = basicMock;

export const Actions = ModalStory.bind({});

Actions.parameters = {
  controls: {
    include: ['onOpenChange', 'primaryButton', 'secondaryButton'],
  },
  docs: {
    source: {
      code: `<Modal
  heading="Example of modal"
  open={true}
  primaryButton={{
    label: 'Confirm',
    onClick: () => {},
  }}
  secondaryButton={{
    label: 'Cancel',
    onClick: () => {},
  }}
  onOpenChange={() => {}}
>
  <div>Example of content</div>
</Modal>`,
    },
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
  docs: {
    source: {
      code: `<Modal
  heading="Example of modal"
  type={MODAL_TYPE.critical}
  open={true}
  primaryButton={{
    label: 'Confirm',
    onClick: () => {},
  }}
  secondaryButton={{
    label: 'Cancel',
    onClick: () => {},
  }}
>
  <div>Example of content</div>
</Modal>`,
    },
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
  docs: {
    source: {
      code: `<Modal
  heading="Example of modal"
  loading={true}
  open={true}
  primaryButton={{
    label: 'Confirm',
    onClick: () => {},
  }}
  secondaryButton={{
    label: 'Cancel',
    onClick: () => {},
  }}
>
  <div>Example of content</div>
</Modal>`,
    },
  },
};

Loading.args = {
  ...basicMock,
  ...actionsMock,
  ...loadingMock,
};

export const Step = ModalStory.bind({});

Step.parameters = {
  controls: {
    include: ['step'],
  },
  docs: {
    source: {
      code: `<Modal
  heading="Example of modal"
  open={true}
  step={{
    current: 1,
    total: 3,
  }}
  primaryButton={{
    label: 'Confirm',
    onClick: () => {},
  }}
  secondaryButton={{
    label: 'Cancel',
    onClick: () => {},
  }}
>
  <div>Example of content</div>
</Modal>`,
    },
  },
};

Step.args = {
  ...basicMock,
  ...actionsMock,
  ...stepMock,
};

export const Full = ModalStory.bind({});

Full.args = {
  ...basicMock,
  ...typeMock,
  ...actionsMock,
  ...otherMock,
  ...stepMock,
};

export default {
  title: 'Manager UI Kit/Components/Modal',
  component: Modal,
  tags: ['autodocs'],
};
