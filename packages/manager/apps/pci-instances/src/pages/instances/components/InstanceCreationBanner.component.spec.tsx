import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InstanceCreationBanner } from './InstanceCreationBanner.component';
import { TBannerProps } from '@/components/banner/Banner.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/components/banner/Banner.component', () => ({
  default: ({ children, color, dismissible, onRemove }: TBannerProps) => (
    <div data-testid={`banner-${color}`} data-dismissible={dismissible}>
      {children}
      {dismissible && onRemove && (
        <button data-testid={`dismiss-${color}`} onClick={onRemove}>
          Dismiss
        </button>
      )}
    </div>
  ),
}));

describe('InstanceCreationBanner', () => {
  describe('when no operations and no error', () => {
    it('should not render any banner', () => {
      render(
        <InstanceCreationBanner instancesCreationsCount={0} hasError={false} />,
      );

      expect(
        screen.queryByTestId('banner-information'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('banner-critical')).not.toBeInTheDocument();
    });
  });

  describe('when operations are in progress', () => {
    it('should render info banner with singular message when instancesCreationsCount is 1', () => {
      render(
        <InstanceCreationBanner instancesCreationsCount={1} hasError={false} />,
      );

      const infoBanner = screen.getByTestId('banner-information');
      expect(infoBanner).toBeInTheDocument();
      expect(infoBanner).toHaveTextContent('pci_instance_creation_in_progress');
    });

    it('should render info banner with plural message when instancesCreationsCount is greater than 1', () => {
      render(
        <InstanceCreationBanner instancesCreationsCount={3} hasError={false} />,
      );

      const infoBanner = screen.getByTestId('banner-information');
      expect(infoBanner).toBeInTheDocument();
      expect(infoBanner).toHaveTextContent(
        'pci_instances_creations_in_progress',
      );
    });

    it('should render dismissible info banner', () => {
      render(
        <InstanceCreationBanner instancesCreationsCount={1} hasError={false} />,
      );

      const infoBanner = screen.getByTestId('banner-information');
      expect(infoBanner).toHaveAttribute('data-dismissible', 'true');
    });
  });

  describe('when error is present', () => {
    it('should render error banner when hasError is true', () => {
      render(
        <InstanceCreationBanner instancesCreationsCount={0} hasError={true} />,
      );

      const errorBanner = screen.getByTestId('banner-critical');
      expect(errorBanner).toBeInTheDocument();
      expect(errorBanner).toHaveTextContent('pci_instance_creation_error');
    });

    it('should render dismissible error banner', () => {
      render(
        <InstanceCreationBanner instancesCreationsCount={0} hasError={true} />,
      );

      const errorBanner = screen.getByTestId('banner-critical');
      expect(errorBanner).toHaveAttribute('data-dismissible', 'true');
    });
  });

  describe('when both operations and error are present', () => {
    it('should render both info and error banners', () => {
      render(
        <InstanceCreationBanner instancesCreationsCount={2} hasError={true} />,
      );

      expect(screen.getByTestId('banner-information')).toBeInTheDocument();
      expect(screen.getByTestId('banner-critical')).toBeInTheDocument();
    });
  });

  describe('dismissible behavior', () => {
    it('should hide info banner when dismissed', async () => {
      const user = userEvent.setup();
      const { queryByTestId } = render(
        <InstanceCreationBanner instancesCreationsCount={1} hasError={false} />,
      );

      expect(screen.getByTestId('banner-information')).toBeInTheDocument();

      const dismissButton = screen.getByTestId('dismiss-information');
      await user.click(dismissButton);

      expect(queryByTestId('banner-information')).not.toBeInTheDocument();
    });

    it('should hide error banner when dismissed', async () => {
      const user = userEvent.setup();
      const { queryByTestId } = render(
        <InstanceCreationBanner instancesCreationsCount={0} hasError={true} />,
      );

      expect(screen.getByTestId('banner-critical')).toBeInTheDocument();

      const dismissButton = screen.getByTestId('dismiss-critical');
      await user.click(dismissButton);

      expect(queryByTestId('banner-critical')).not.toBeInTheDocument();
    });

    it('should hide info banner without affecting error banner', async () => {
      const user = userEvent.setup();
      const { queryByTestId } = render(
        <InstanceCreationBanner instancesCreationsCount={2} hasError={true} />,
      );

      expect(screen.getByTestId('banner-information')).toBeInTheDocument();
      expect(screen.getByTestId('banner-critical')).toBeInTheDocument();

      const dismissInfoButton = screen.getByTestId('dismiss-information');
      await user.click(dismissInfoButton);

      expect(queryByTestId('banner-information')).not.toBeInTheDocument();
      expect(screen.getByTestId('banner-critical')).toBeInTheDocument();
    });

    it('should hide error banner without affecting info banner', async () => {
      const user = userEvent.setup();
      const { queryByTestId } = render(
        <InstanceCreationBanner instancesCreationsCount={1} hasError={true} />,
      );

      expect(screen.getByTestId('banner-information')).toBeInTheDocument();
      expect(screen.getByTestId('banner-critical')).toBeInTheDocument();

      const dismissErrorButton = screen.getByTestId('dismiss-critical');
      await user.click(dismissErrorButton);

      expect(queryByTestId('banner-critical')).not.toBeInTheDocument();
      expect(screen.getByTestId('banner-information')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should not render info banner when instancesCreationsCount is 0', () => {
      render(
        <InstanceCreationBanner instancesCreationsCount={0} hasError={false} />,
      );

      expect(
        screen.queryByTestId('banner-information'),
      ).not.toBeInTheDocument();
    });

    it('should not render error banner when hasError is false', () => {
      render(
        <InstanceCreationBanner instancesCreationsCount={1} hasError={false} />,
      );

      expect(screen.queryByTestId('banner-critical')).not.toBeInTheDocument();
    });

    it('should handle large instancesCreationsCount', () => {
      render(
        <InstanceCreationBanner
          instancesCreationsCount={999}
          hasError={false}
        />,
      );

      const infoBanner = screen.getByTestId('banner-information');
      expect(infoBanner).toBeInTheDocument();
      expect(infoBanner).toHaveTextContent(
        'pci_instances_creations_in_progress',
      );
    });
  });

  describe('operations state transitions', () => {
    it('should hide info banner when instancesCreationsCount goes from 1 to 0', () => {
      const { rerender, queryByTestId } = render(
        <InstanceCreationBanner instancesCreationsCount={1} hasError={false} />,
      );

      expect(screen.getByTestId('banner-information')).toBeInTheDocument();

      rerender(
        <InstanceCreationBanner instancesCreationsCount={0} hasError={false} />,
      );

      expect(queryByTestId('banner-information')).not.toBeInTheDocument();
    });

    it('should hide info banner when instancesCreationsCount goes from multiple to 0', () => {
      const { rerender, queryByTestId } = render(
        <InstanceCreationBanner instancesCreationsCount={3} hasError={false} />,
      );

      expect(screen.getByTestId('banner-information')).toBeInTheDocument();
      expect(screen.getByTestId('banner-information')).toHaveTextContent(
        'pci_instances_creations_in_progress',
      );

      rerender(
        <InstanceCreationBanner instancesCreationsCount={0} hasError={false} />,
      );

      expect(queryByTestId('banner-information')).not.toBeInTheDocument();
    });

    it('should update banner message when instancesCreationsCount goes from 1 to multiple', () => {
      const { rerender } = render(
        <InstanceCreationBanner instancesCreationsCount={1} hasError={false} />,
      );

      expect(screen.getByTestId('banner-information')).toHaveTextContent(
        'pci_instance_creation_in_progress',
      );

      rerender(
        <InstanceCreationBanner instancesCreationsCount={3} hasError={false} />,
      );

      expect(screen.getByTestId('banner-information')).toHaveTextContent(
        'pci_instances_creations_in_progress',
      );
    });

    it('should not re-show banner if it was dismissed and instancesCreationsCount changes', async () => {
      const user = userEvent.setup();
      const { rerender, queryByTestId } = render(
        <InstanceCreationBanner instancesCreationsCount={1} hasError={false} />,
      );

      expect(screen.getByTestId('banner-information')).toBeInTheDocument();

      const dismissButton = screen.getByTestId('dismiss-information');
      await user.click(dismissButton);

      expect(queryByTestId('banner-information')).not.toBeInTheDocument();

      rerender(
        <InstanceCreationBanner instancesCreationsCount={3} hasError={false} />,
      );

      expect(queryByTestId('banner-information')).not.toBeInTheDocument();
    });

    it('should hide info banner but keep error banner when instancesCreationsCount goes to 0', () => {
      const { rerender, queryByTestId } = render(
        <InstanceCreationBanner instancesCreationsCount={2} hasError={true} />,
      );

      expect(screen.getByTestId('banner-information')).toBeInTheDocument();
      expect(screen.getByTestId('banner-critical')).toBeInTheDocument();

      rerender(
        <InstanceCreationBanner instancesCreationsCount={0} hasError={true} />,
      );

      expect(queryByTestId('banner-information')).not.toBeInTheDocument();
      expect(screen.getByTestId('banner-critical')).toBeInTheDocument();
    });
  });
});
