import { vitest } from 'vitest';
import { render } from '../../../utils/test.provider';
import { Button, ButtonProps } from '../index';
import { useAuthorizationIam } from '../../../hooks/iam';
import { TOOLTIP_POSITION } from '@ovhcloud/ods-react';

vitest.mock('../../../hooks/iam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  }),
}));

const mockedHook = useAuthorizationIam as unknown as jest.Mock;

const renderComponent = (props: ButtonProps) => {
  return render(<Button {...props} />);
};

describe('Button Snapshot Tests', () => {
  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('Authorized Button States', () => {
    it('should render basic button when authorized', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = renderComponent({
        children: 'Click me',
      });

      expect(container).toMatchSnapshot();
    });

    it('should render button with IAM props when authorized', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = renderComponent({
        children: 'Authorized Button',
        iamActions: ['test:action'],
        urn: 'urn:test:resource',
        displayTooltip: true,
        isIamTrigger: true,
      });

      expect(container).toMatchSnapshot();
    });

    it('should render button with ODS button props when authorized', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = renderComponent({
        children: 'Full Featured Button',
        iamActions: ['test:action'],
        urn: 'urn:test:resource',
        displayTooltip: true,
        isIamTrigger: true,
      });

      expect(container).toMatchSnapshot();
    });
  });

  describe('Unauthorized Button States', () => {
    it('should render disabled button with tooltip when unauthorized', () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: false,
        isFetched: true,
      });

      const { container } = renderComponent({
        children: 'Unauthorized Button',
        iamActions: ['test:action'],
        urn: 'urn:test:resource',
        displayTooltip: true,
        tooltipPosition: TOOLTIP_POSITION.bottom,
      });

      expect(container).toMatchSnapshot();
    });

    it('should render disabled button without tooltip when unauthorized', () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: false,
        isFetched: true,
      });

      const { container } = renderComponent({
        children: 'Unauthorized Button No Tooltip',
        iamActions: ['test:action'],
        urn: 'urn:test:resource',
        displayTooltip: false,
      });

      expect(container).toMatchSnapshot();
    });

    it('should render disabled button with custom tooltip position', () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: false,
        isFetched: true,
      });

      const { container } = renderComponent({
        children: 'Unauthorized Button Top Tooltip',
        iamActions: ['test:action'],
        urn: 'urn:test:resource',
        displayTooltip: true,
        tooltipPosition: TOOLTIP_POSITION.top,
      });

      expect(container).toMatchSnapshot();
    });

    it('should render disabled button with all ODS props when unauthorized', () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: false,
        isFetched: true,
      });

      const { container } = renderComponent({
        children: 'Unauthorized Full Featured Button',
        iamActions: ['test:action'],
        urn: 'urn:test:resource',
        displayTooltip: true,
        tooltipPosition: TOOLTIP_POSITION.right,
      });

      expect(container).toMatchSnapshot();
    });
  });

  describe('Edge Cases', () => {
    it('should render button when no IAM props provided', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = renderComponent({
        children: 'No IAM Button',
      });

      expect(container).toMatchSnapshot();
    });

    it('should render button when only iamActions provided', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = renderComponent({
        children: 'IAM Actions Only Button',
        iamActions: ['test:action'],
      });

      expect(container).toMatchSnapshot();
    });

    it('should render button when only urn provided', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = renderComponent({
        children: 'URN Only Button',
        urn: 'urn:test:resource',
      });

      expect(container).toMatchSnapshot();
    });

    it('should render button with JSX children', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = renderComponent({
        children: <span>JSX Children Button</span>,
        iamActions: ['test:action'],
        urn: 'urn:test:resource',
      });

      expect(container).toMatchSnapshot();
    });

    it('should render button with isIamTrigger set to false', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = renderComponent({
        children: 'Non-IAM Trigger Button',
        iamActions: ['test:action'],
        urn: 'urn:test:resource',
        isIamTrigger: false,
      });

      expect(container).toMatchSnapshot();
    });
  });

  describe('Loading States', () => {
    it('should render button when IAM is loading', () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: true,
        isFetched: false,
      });

      const { container } = renderComponent({
        children: 'Loading IAM Button',
        iamActions: ['test:action'],
        urn: 'urn:test:resource',
      });

      expect(container).toMatchSnapshot();
    });

    it('should render button when IAM is loading and authorized', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: true,
        isFetched: false,
      });

      const { container } = renderComponent({
        children: 'Loading Authorized Button',
        iamActions: ['test:action'],
        urn: 'urn:test:resource',
      });

      expect(container).toMatchSnapshot();
    });
  });
});
