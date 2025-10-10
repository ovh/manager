import { vitest } from 'vitest';
import type { MockInstance } from 'vitest';
import { TOOLTIP_POSITION } from '@ovhcloud/ods-react';
import { render } from '@/setupTest';
import { Button } from '../index';
import { useAuthorizationIam } from '../../../hooks/iam';

vitest.mock('../../../hooks/iam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  }),
}));

const mockedHook = useAuthorizationIam as unknown as MockInstance;

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

      const { container } = render(<Button>Click me</Button>);

      expect(container).toMatchSnapshot();
    });

    it('should render button with IAM props when authorized', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <Button
          iamActions={['test:action']}
          urn="urn:test:resource"
          displayTooltip={true}
          isIamTrigger={true}
        >
          Authorized Button
        </Button>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render button with ODS button props when authorized', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <Button
          iamActions={['test:action']}
          urn="urn:test:resource"
          displayTooltip={true}
          isIamTrigger={true}
        >
          Full Featured Button
        </Button>,
      );

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

      const { container } = render(
        <Button
          iamActions={['test:action']}
          urn="urn:test:resource"
          displayTooltip={true}
          tooltipPosition={TOOLTIP_POSITION.bottom}
        >
          Unauthorized Button
        </Button>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render disabled button without tooltip when unauthorized', () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <Button
          iamActions={['test:action']}
          urn="urn:test:resource"
          displayTooltip={false}
        >
          Unauthorized Button No Tooltip
        </Button>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render disabled button with custom tooltip position', () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <Button
          iamActions={['test:action']}
          urn="urn:test:resource"
          displayTooltip={true}
          tooltipPosition={TOOLTIP_POSITION.top}
        >
          Unauthorized Button Top Tooltip
        </Button>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render disabled button with all ODS props when unauthorized', () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <Button
          iamActions={['test:action']}
          urn="urn:test:resource"
          displayTooltip={true}
          tooltipPosition={TOOLTIP_POSITION.right}
        >
          Unauthorized Full Featured Button
        </Button>,
      );

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

      const { container } = render(<Button>No IAM Button</Button>);

      expect(container).toMatchSnapshot();
    });

    it('should render button when only iamActions provided', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <Button iamActions={['test:action']}>IAM Actions Only Button</Button>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render button when only urn provided', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <Button urn="urn:test:resource">URN Only Button</Button>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render button with JSX children', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <Button iamActions={['test:action']} urn="urn:test:resource">
          <span>JSX Children Button</span>
        </Button>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render button with isIamTrigger set to false', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <Button
          iamActions={['test:action']}
          urn="urn:test:resource"
          isIamTrigger={false}
        >
          Non-IAM Trigger Button
        </Button>,
      );

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

      const { container } = render(
        <Button iamActions={['test:action']} urn="urn:test:resource">
          Loading IAM Button
        </Button>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render button when IAM is loading and authorized', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: true,
        isFetched: false,
      });

      const { container } = render(
        <Button iamActions={['test:action']} urn="urn:test:resource">
          Loading Authorized Button
        </Button>,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
