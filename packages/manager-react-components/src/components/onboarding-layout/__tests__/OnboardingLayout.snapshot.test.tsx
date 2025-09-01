import { vitest } from 'vitest';
import type { MockInstance } from 'vitest';
import { render } from '../../../utils/test.provider';
import { OnboardingLayout } from '../OnboardingLayout.component';
import { LinkCard } from '../../link-card/LinkCard.component';
import { useAuthorizationIam } from '../../../hooks/iam';

vitest.mock('../../../hooks/iam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  }),
}));

const mockedHook = useAuthorizationIam as unknown as MockInstance;

describe('OnboardingLayout Snapshot Tests', () => {
  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('Basic OnboardingLayout States', () => {
    it('should render basic onboarding layout with title and description', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <OnboardingLayout
          title="Welcome to OVHcloud"
          description="Get started with your cloud journey"
        />,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render onboarding layout with image', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <OnboardingLayout
          title="Welcome to OVHcloud"
          description="Get started with your cloud journey"
          img={{
            src: 'https://example.com/image.png',
            alt: 'Welcome image',
            className: 'custom-image',
          }}
        />,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render onboarding layout with buttons', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <OnboardingLayout
          title="Welcome to OVHcloud"
          description="Get started with your cloud journey"
          orderButtonLabel="Get Started"
          orderHref="https://ovhcloud.com"
          moreInfoButtonLabel="Learn More"
          moreInfoHref="https://docs.ovhcloud.com"
        />,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render onboarding layout with hidden heading section', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <OnboardingLayout
          title="Welcome to OVHcloud"
          description="Get started with your cloud journey"
          hideHeadingSection={true}
        />,
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe('OnboardingLayout with LinkCard Children', () => {
    it('should render onboarding layout with single LinkCard', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <OnboardingLayout
          title="Welcome to OVHcloud"
          description="Get started with your cloud journey"
        >
          <LinkCard
            href="https://ovhcloud.com/instances"
            texts={{
              title: 'Virtual Machines',
              description: 'Deploy and manage your virtual machines',
              category: 'Compute',
            }}
            hrefLabel="Learn more"
          />
        </OnboardingLayout>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render onboarding layout with multiple LinkCards', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <OnboardingLayout
          title="Welcome to OVHcloud"
          description={<p>Get started with your cloud journey</p>}
        >
          <LinkCard
            href="https://ovhcloud.com/instances"
            texts={{
              title: 'Virtual Machines',
              description: 'Deploy and manage your virtual machines',
              category: 'Compute',
            }}
            hrefLabel="Learn more"
            badges={[{ text: 'Popular' }]}
          />
          <LinkCard
            href="https://ovhcloud.com/storage"
            externalHref={true}
            texts={{
              title: 'Object Storage',
              description: 'Store and retrieve your data',
              category: 'Storage',
            }}
            hrefLabel="View docs"
            img={{
              src: 'https://example.com/storage-icon.png',
              alt: 'Storage icon',
            }}
          />
          <LinkCard
            href="https://ovhcloud.com/network"
            texts={{
              title: 'Network Services',
              description: 'Connect your resources securely',
              category: 'Network',
            }}
            hrefLabel="Explore"
            badges={[{ text: 'New' }, { text: 'Beta' }]}
          />
        </OnboardingLayout>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render onboarding layout with LinkCards and buttons', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <OnboardingLayout
          title="Welcome to OVHcloud"
          description={<p>Get started with your cloud journey</p>}
          orderButtonLabel="Get Started"
          orderHref="https://ovhcloud.com"
          moreInfoButtonLabel="Learn More"
          moreInfoHref="https://docs.ovhcloud.com"
        >
          <LinkCard
            href="https://ovhcloud.com/instances"
            texts={{
              title: 'Virtual Machines',
              description: 'Deploy and manage your virtual machines',
              category: 'Compute',
            }}
            hrefLabel="Learn more"
          />
          <LinkCard
            href="https://ovhcloud.com/storage"
            externalHref={true}
            texts={{
              title: 'Object Storage',
              description: 'Store and retrieve your data',
              category: 'Storage',
            }}
            hrefLabel="View docs"
          />
        </OnboardingLayout>,
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe('OnboardingLayout with Complex LinkCard Configurations', () => {
    it('should render onboarding layout with LinkCards having images and badges', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <OnboardingLayout
          title="Welcome to OVHcloud"
          description="Get started with your cloud journey"
        >
          <LinkCard
            href="https://ovhcloud.com/instances"
            texts={{
              title: 'Virtual Machines',
              description:
                'Deploy and manage your virtual machines with full control over your infrastructure',
              category: 'Compute',
            }}
            hrefLabel="Learn more"
            badges={[{ text: 'Popular' }, { text: 'Recommended' }]}
            img={{
              src: 'https://example.com/vm-icon.png',
              alt: 'Virtual machine icon',
            }}
            trackingLabel="onboarding-vm-card"
          />
          <LinkCard
            href="https://ovhcloud.com/kubernetes"
            externalHref={true}
            texts={{
              title: 'Kubernetes',
              description:
                'Orchestrate your containers with managed Kubernetes',
              category: 'Container',
            }}
            hrefLabel="View docs"
            badges={[{ text: 'New' }]}
            img={{
              src: 'https://example.com/k8s-icon.png',
              alt: 'Kubernetes icon',
            }}
            trackingLabel="onboarding-k8s-card"
          />
        </OnboardingLayout>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render onboarding layout with LinkCards and custom onClick handlers', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const mockOnClick = vitest.fn();

      const { container } = render(
        <OnboardingLayout
          title="Welcome to OVHcloud"
          description="Get started with your cloud journey"
        >
          <LinkCard
            href="https://ovhcloud.com/instances"
            texts={{
              title: 'Virtual Machines',
              description: 'Deploy and manage your virtual machines',
              category: 'Compute',
            }}
            hrefLabel="Learn more"
            onClick={mockOnClick}
          />
          <LinkCard
            href="https://ovhcloud.com/storage"
            texts={{
              title: 'Object Storage',
              description: 'Store and retrieve your data',
              category: 'Storage',
            }}
            hrefLabel="View docs"
            onClick={mockOnClick}
          />
        </OnboardingLayout>,
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe('Edge Cases', () => {
    it('should render onboarding layout with empty children', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <OnboardingLayout
          title="Welcome to OVHcloud"
          description="Get started with your cloud journey"
        >
          {null}
        </OnboardingLayout>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render onboarding layout with mixed children types', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <OnboardingLayout
          title="Welcome to OVHcloud"
          description="Get started with your cloud journey"
        >
          <LinkCard
            href="https://ovhcloud.com/instances"
            texts={{
              title: 'Virtual Machines',
              description: 'Deploy and manage your virtual machines',
              category: 'Compute',
            }}
            hrefLabel="Learn more"
          />
          <div>Custom content</div>
          <LinkCard
            href="https://ovhcloud.com/storage"
            texts={{
              title: 'Object Storage',
              description: 'Store and retrieve your data',
              category: 'Storage',
            }}
            hrefLabel="View docs"
          />
        </OnboardingLayout>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render onboarding layout with disabled buttons', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <OnboardingLayout
          title="Welcome to OVHcloud"
          description="Get started with your cloud journey"
          orderButtonLabel="Get Started"
          orderHref="https://ovhcloud.com"
          isActionDisabled={true}
          moreInfoButtonLabel="Learn More"
          moreInfoHref="https://docs.ovhcloud.com"
          isMoreInfoButtonDisabled={true}
        >
          <LinkCard
            href="https://ovhcloud.com/instances"
            texts={{
              title: 'Virtual Machines',
              description: 'Deploy and manage your virtual machines',
              category: 'Compute',
            }}
            hrefLabel="Learn more"
          />
        </OnboardingLayout>,
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe('Responsive Layout Tests', () => {
    it('should render onboarding layout with many LinkCards for grid testing', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      const { container } = render(
        <OnboardingLayout
          title="Welcome to OVHcloud"
          description="Get started with your cloud journey"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <LinkCard
              key={index}
              href={`https://ovhcloud.com/service-${index}`}
              texts={{
                title: `Service ${index + 1}`,
                description: `Description for service ${index + 1}`,
                category: `Category ${index + 1}`,
              }}
              hrefLabel="Learn more"
              badges={index % 2 === 0 ? [{ text: 'Popular' }] : undefined}
            />
          ))}
        </OnboardingLayout>,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
