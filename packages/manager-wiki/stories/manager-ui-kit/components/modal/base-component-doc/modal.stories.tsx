import { type Meta, type StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Icon,
  ICON_NAME,
  Modal,
  MODAL_COLOR,
  MODAL_COLORS,
  ModalBody,
  ModalContent,
  type ModalContentProp,
  type ModalOpenChangeDetail,
  type ModalProp,
  ModalTrigger,
  Select,
  SelectContent,
  SelectControl,
  Text,
  TEXT_PRESET,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';
import docgenMap from '../../../base-documents/constants/ods-docgen-map.json';

type Story = StoryObj<ModalProp>;

(Modal as any).__docgenInfo = docgenMap.modal;
(ModalBody as any).__docgenInfo = docgenMap.modalBody;
(ModalContent as any).__docgenInfo = docgenMap.modalContent;
(ModalTrigger as any).__docgenInfo = docgenMap.modalTrigger;

type DemoArg = Partial<ModalProp> & Partial<ModalContentProp> & {
  content?: string,
};

const meta: Meta<ModalProp> = {
  argTypes: excludeFromDemoControls(['defaultOpen', 'i18n', 'initialFocusedElement', 'locale', 'onOpenChange', 'open']),
  component: Modal,
  subcomponents: { ModalBody, ModalContent, ModalTrigger },
  title: 'Manager UI Kit/Components/Modal/Base',
};

export default meta;

export const Demo: StoryObj = {
  render: (arg: DemoArg) => (
    <Modal
      closeOnEscape={ arg.closeOnEscape }
      closeOnInteractOutside={ arg.closeOnInteractOutside }>
      <ModalTrigger asChild>
        <Button>
          Trigger Modal
        </Button>
      </ModalTrigger>

      <ModalContent
        color={ arg.color }
        dismissible={ arg.dismissible }>
        <ModalBody>
          { arg.content }
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
  argTypes: orderControls({
    closeOnEscape: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: { type: 'boolean' },
    },
    closeOnInteractOutside: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: { type: 'boolean' },
    },
    color: {
      table: {
        category: CONTROL_CATEGORY.design,
        defaultValue: { summary: MODAL_COLOR.information },
        type: { summary: 'MODAL_COLOR' },
      },
      control: { type: 'select' },
      options: MODAL_COLORS,
    },
    content: {
      table: {
        category: CONTROL_CATEGORY.slot,
      },
      control: 'text',
    },
    dismissible: {
      table: {
        category: CONTROL_CATEGORY.general,
        defaultValue: { summary: true },
        type: { summary: 'boolean' },
      },
      control: { type: 'boolean' },
    },
  }),
  args: {
    content: 'My modal content',
  },
};

export const AccessibilityActions: Story = {
  globals: {
    imports: `import { BUTTON_COLOR, BUTTON_VARIANT, MODAL_COLOR, Button, Modal, ModalBody, ModalContent, ModalTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Modal>
      <ModalTrigger asChild>
        <Button>
          Trigger Modal
        </Button>
      </ModalTrigger>

      <ModalContent color={ MODAL_COLOR.critical }>
        <ModalBody>
          <h2 id="modal-title">
            Delete item
          </h2>

          <p id="modal-content">
            Are you sure you want to delete this item?
          </p>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'end' }}>
            <Button variant={ BUTTON_VARIANT.ghost }>
              Cancel
            </Button>

            <Button color={ BUTTON_COLOR.critical }>
              Delete
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
};

export const AccessibilityAriaLabelledBy: Story = {
  globals: {
    imports: `import { Button, Modal, ModalBody, ModalContent, ModalTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Modal>
      <ModalTrigger asChild>
        <Button>
          Trigger Modal
        </Button>
      </ModalTrigger>

      <ModalContent
        aria-describedby="modal-content"
        aria-labelledby="modal-title">
        <ModalBody>
          <h2 id="modal-title">
            Delete item
          </h2>

          <p id="modal-content">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
};

export const AccessibilityAriaLabel: Story = {
  globals: {
    imports: `import { Button, Modal, ModalBody, ModalContent, ModalTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Modal>
      <ModalTrigger asChild>
        <Button>
          Trigger Modal
        </Button>
      </ModalTrigger>

      <ModalContent
        aria-describedby="modal-content"
        aria-label="Modal Content">
        <ModalBody id="modal-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
};

export const AccessibilityBadPracticesAria: Story = {
  globals: {
    imports: `import { Button, Modal, ModalBody, ModalContent, ModalTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Modal>
      <ModalTrigger asChild>
        <Button>
          Trigger Modal
        </Button>
      </ModalTrigger>

      <ModalContent>
        <ModalBody>
          <h2 id="modal-title">
            Delete item
          </h2>

          <p id="modal-content">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
};

export const Actions: Story = {
  globals: {
    imports: `import { BUTTON_VARIANT, TEXT_PRESET, Button, Modal, ModalBody, ModalContent, ModalTrigger, Text } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Modal>
      <ModalTrigger asChild>
        <Button>
          Trigger Modal
        </Button>
      </ModalTrigger>

      <ModalContent>
        <ModalBody style={{ display: 'flex', flexDirection: 'column', rowGap: '16px' }}>
          <Text preset={ TEXT_PRESET.heading4 }>
            Hosting removal
          </Text>

          <Text>
            You're about to remove the hosting "1 vCore 2,4 GHz, 2 Go RAM".
          </Text>

          <div style={{ display: 'flex', alignSelf: 'flex-end', columnGap: '8px' }}>
            <Button>
              Confirm
            </Button>

            <Button variant={ BUTTON_VARIANT.outline }>
              Cancel
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
};

export const Colors: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'row', gap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { BUTTON_COLOR, MODAL_COLOR, Button, Modal, ModalBody, ModalContent, ModalTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Modal>
        <ModalTrigger asChild>
          <Button color={ BUTTON_COLOR.critical }>
            Critical
          </Button>
        </ModalTrigger>

        <ModalContent color={ MODAL_COLOR.critical }>
          <ModalBody>
            Critical
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal>
        <ModalTrigger asChild>
          <Button color={ BUTTON_COLOR.information }>
            Information
          </Button>
        </ModalTrigger>

        <ModalContent color={ MODAL_COLOR.information }>
          <ModalBody>
            Information
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal>
        <ModalTrigger asChild>
          <Button color={ BUTTON_COLOR.neutral }>
            Neutral
          </Button>
        </ModalTrigger>

        <ModalContent color={ MODAL_COLOR.neutral }>
          <ModalBody>
            Neutral
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal>
        <ModalTrigger asChild>
          <Button color={ BUTTON_COLOR.primary }>
            Primary
          </Button>
        </ModalTrigger>

        <ModalContent color={ MODAL_COLOR.primary }>
          <ModalBody>
            Primary
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal>
        <ModalTrigger asChild>
          <Button color={ BUTTON_COLOR.success }>
            Success
          </Button>
        </ModalTrigger>

        <ModalContent color={ MODAL_COLOR.success }>
          <ModalBody>
            Success
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal>
        <ModalTrigger asChild>
          <Button color={ BUTTON_COLOR.warning }>
            Warning
          </Button>
        </ModalTrigger>

        <ModalContent color={ MODAL_COLOR.warning }>
          <ModalBody>
            Warning
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  ),
};

export const Controlled: Story = {
  globals: {
    imports: `import { Button, Modal, ModalBody, ModalContent } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const [isOpen, setIsOpen] = useState(false);

    function onOpenChange({ open }: ModalOpenChangeDetail) {
      setIsOpen(open);
    }

    function openModal() {
      setIsOpen(true);
    }

    return (
      <>
        <Button onClick={ openModal }>
          Trigger Modal
        </Button>

        <Modal
          onOpenChange={ onOpenChange }
          open={ isOpen }>
          <ModalContent>
            <ModalBody>
              Content
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  },
};

export const Default: Story = {
  globals: {
    imports: `import { Modal, ModalBody, ModalContent, ModalTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Modal>
      <ModalTrigger>
        Trigger Modal
      </ModalTrigger>

      <ModalContent>
        <ModalBody>
          My modal content
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
};

export const NonDismissible: Story = {
  globals: {
    imports: `import { Button, Modal, ModalBody, ModalContent, ModalTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Modal>
      <ModalTrigger asChild>
        <Button>
          Trigger Modal
        </Button>
      </ModalTrigger>

      <ModalContent dismissible={ false }>
        <ModalBody>
          My modal content
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
};

export const NonEscapable: Story = {
  globals: {
    imports: `import { Button, Modal, ModalBody, ModalContent, ModalTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Modal
      closeOnEscape={ false }
      closeOnInteractOutside={ false }>
      <ModalTrigger asChild>
        <Button>
          Trigger Modal
        </Button>
      </ModalTrigger>

      <ModalContent>
        <ModalBody>
          My modal content
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
};

export const OverlayElements: Story = {
  globals: {
    imports: `import { ICON_NAME, Button, Icon, Modal, ModalBody, ModalContent, ModalTrigger, Select, SelectContent, SelectControl, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Modal>
      <ModalTrigger asChild>
        <Button>
          Trigger Modal
        </Button>
      </ModalTrigger>

      <ModalContent>
        <ModalBody style={{ display: 'grid', columnGap: '8px', alignItems: 'center', gridTemplateColumns: '1fr max-content' }}>
          <Select items={[
            { label: 'Dog', value:'dog' },
            { label: 'Cat', value:'cat' },
            { label: 'Hamster', value:'hamster' },
            { label: 'Parrot', value:'parrot' },
            { label: 'Spider', value:'spider' },
            { label: 'Goldfish', value:'goldfish' },
          ]}>
            <SelectControl />

            <SelectContent createPortal={ false } />
          </Select>

          <Tooltip>
            <TooltipTrigger asChild>
              <Icon
                name={ ICON_NAME.circleQuestion }
                style={{ fontSize: '24px' }} />
            </TooltipTrigger>

            <TooltipContent createPortal={ false }>
              This is the tooltip content
            </TooltipContent>
          </Tooltip>
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant={ BUTTON_VARIANT.outline }>
          Trigger Modal
        </Button>
      </ModalTrigger>

      <ModalContent>
        <ModalBody>
          <Text preset={ TEXT_PRESET.heading4 }>
            Overview
          </Text>

          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
};
