import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import DataStreamSubscriptionsLink from '@/components/data-streams/DataStreamSubscriptionsLink.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
  }),
}));

describe('DataStreamSubscriptionsLink', () => {
  const shellContext = {
    shell: {
      navigation: {
        getURL: vi.fn().mockResolvedValue('mocked-url'),
      },
    },
  };

  const props = {
    nbSubscription: 5,
    serviceName: 'testService',
    streamId: 'testStreamId',
  };

  it('renders a link with correct nbSubscription count', async () => {
    render(
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <DataStreamSubscriptionsLink {...props} />
      </ShellContext.Provider>,
    );

    await waitFor(() => {
      const linkElement = screen.getByTestId('link-testStream');
      expect(linkElement).toBeInTheDocument();
    });
  });

  it('enables the link if this is not a substream (parentStreamId is not provided)', async () => {
    render(
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <DataStreamSubscriptionsLink {...props} />
      </ShellContext.Provider>,
    );

    await waitFor(() => {
      const linkElement = screen.getByTestId('link-testStream');
      expect(linkElement).not.toHaveAttribute('aria-disabled');
    });
  });

  it('disables the link if this is a substream (parentStreamId is provided)', async () => {
    render(
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <DataStreamSubscriptionsLink
          {...props}
          parentStreamId="testParentStreamId"
        />
      </ShellContext.Provider>,
    );

    await waitFor(() => {
      const linkElement = screen.getByTestId('link-testStream');
      expect(linkElement).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('does not renders tooltip if this is not a substream (parentStreamId is not provided)', async () => {
    render(
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <DataStreamSubscriptionsLink {...props} />
      </ShellContext.Provider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId('popover-testStream'),
      ).not.toBeInTheDocument();
    });
  });

  it('render tooltip if this is a substream (parentStreamId is provided)', async () => {
    render(
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <DataStreamSubscriptionsLink
          {...props}
          parentStreamId="testParentStreamId"
        />
      </ShellContext.Provider>,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('popover-testStream')).toBeInTheDocument();
    });
  });
});
