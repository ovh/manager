import { vitest } from 'vitest';

import { TEXT_PRESET } from '@ovhcloud/ods-react';

import { render } from '@/setupTest';

import { Text } from '../../text/Text.component';
import { Drawer } from '../index';
import './drawer.mocks';

describe('Drawer Snapshot Tests', () => {
  const mockOnDismiss = vitest.fn();

  afterEach(() => {
    vitest.clearAllMocks();
  });

  describe('Drawer.Root', () => {
    it('should render basic drawer with header and content', () => {
      const { container } = render(
        <Drawer.Root isOpen={true} onDismiss={mockOnDismiss}>
          <Drawer.Header title="Basic Drawer" />
          <Drawer.Content>
            <Text preset={TEXT_PRESET.heading3}>Basic Drawer</Text>
            <p>This is the drawer content</p>
          </Drawer.Content>
        </Drawer.Root>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render drawer with header, content and footer', () => {
      const { container } = render(
        <Drawer.Root isOpen={true} onDismiss={mockOnDismiss}>
          <Drawer.Header title="Complete Drawer" />
          <Drawer.Content>
            <Text preset={TEXT_PRESET.heading3}>Drawer with all components</Text>
            <p>Drawer with all components</p>
          </Drawer.Content>
          <Drawer.Footer
            primaryButton={{
              label: 'Confirm',
              onClick: vitest.fn(),
            }}
            secondaryButton={{
              label: 'Cancel',
              onClick: vitest.fn(),
            }}
          />
        </Drawer.Root>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render closed drawer', () => {
      const { container } = render(
        <Drawer.Root isOpen={false} onDismiss={mockOnDismiss}>
          <Drawer.Header title="Closed Drawer" />
          <Drawer.Content>
            <Text preset={TEXT_PRESET.heading3}>Closed Drawer</Text>
            <p>This drawer is closed</p>
          </Drawer.Content>
        </Drawer.Root>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render drawer without createPortal', () => {
      const { container } = render(
        <Drawer.Root isOpen={true} onDismiss={mockOnDismiss} createPortal={false}>
          <Drawer.Header title="No Portal Drawer" />
          <Drawer.Content>
            <Text preset={TEXT_PRESET.heading3}>Rendered without portal</Text>
            <p>Rendered without portal</p>
          </Drawer.Content>
        </Drawer.Root>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render drawer with trigger element', () => {
      const { container } = render(
        <Drawer.Root isOpen={true} onDismiss={mockOnDismiss} trigger={<button>Open Drawer</button>}>
          <Drawer.Header title="Drawer with Trigger" />
          <Drawer.Content>
            <Text preset={TEXT_PRESET.heading3}>Drawer with trigger button</Text>
            <p>Drawer with trigger button</p>
          </Drawer.Content>
        </Drawer.Root>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render drawer with complex content', () => {
      const { container } = render(
        <Drawer.Root isOpen={true} onDismiss={mockOnDismiss}>
          <Drawer.Header title="Complex Content Drawer" />
          <Drawer.Content>
            <Text preset={TEXT_PRESET.heading3}>Complex Content Drawer</Text>
            <p>Some text content</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </Drawer.Content>
          <Drawer.Footer
            primaryButton={{
              label: 'Save',
              onClick: vitest.fn(),
            }}
          />
        </Drawer.Root>,
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe('Drawer.RootCollapsible', () => {
    it('should render basic collapsible drawer', () => {
      const { container } = render(
        <Drawer.RootCollapsible isOpen={true} onDismiss={mockOnDismiss}>
          <Drawer.Header title="Collapsible Drawer" />
          <Drawer.Content>
            <Text preset={TEXT_PRESET.heading3}>Collapsible Drawer</Text>
            <p>This is a collapsible drawer</p>
          </Drawer.Content>
        </Drawer.RootCollapsible>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render collapsible drawer with all components', () => {
      const { container } = render(
        <Drawer.RootCollapsible isOpen={true} onDismiss={mockOnDismiss}>
          <Drawer.Header title="Full Collapsible Drawer" />
          <Drawer.Content>
            <Text preset={TEXT_PRESET.heading3}>Complete Collapsible Drawer</Text>
            <p>Complete collapsible drawer</p>
          </Drawer.Content>
          <Drawer.Footer
            primaryButton={{
              label: 'Apply',
              onClick: vitest.fn(),
            }}
            secondaryButton={{
              label: 'Reset',
              onClick: vitest.fn(),
            }}
          />
        </Drawer.RootCollapsible>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render closed collapsible drawer', () => {
      const { container } = render(
        <Drawer.RootCollapsible isOpen={false} onDismiss={mockOnDismiss}>
          <Drawer.Header title="Closed Collapsible" />
          <Drawer.Content>
            <Text preset={TEXT_PRESET.heading3}>Closed Collapsible Drawer</Text>
            <p>This collapsible drawer is closed</p>
          </Drawer.Content>
        </Drawer.RootCollapsible>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render collapsible drawer with complex content', () => {
      const { container } = render(
        <Drawer.RootCollapsible isOpen={true} onDismiss={mockOnDismiss}>
          <Drawer.Header title="Complex Collapsible" />
          <Drawer.Content>
            <Text preset={TEXT_PRESET.heading3}>Complex Collapsible Drawer</Text>
            <form>
              <label htmlFor="setting1">Setting 1</label>
              <input id="setting1" type="text" defaultValue="value1" />
              <label htmlFor="setting2">Setting 2</label>
              <input id="setting2" type="checkbox" />
            </form>
          </Drawer.Content>
          <Drawer.Footer
            primaryButton={{
              label: 'Save Settings',
              onClick: vitest.fn(),
            }}
            secondaryButton={{
              label: 'Cancel',
              onClick: vitest.fn(),
            }}
          />
        </Drawer.RootCollapsible>,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
