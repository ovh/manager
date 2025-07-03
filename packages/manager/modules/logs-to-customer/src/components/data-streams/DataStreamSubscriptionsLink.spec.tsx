import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { i18n } from 'i18next';
import DataStreamSubscriptionsLink from './DataStreamSubscriptionsLink.component';

let i18nForTests: i18n;

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
      <I18nextProvider i18n={i18nForTests}>
        <ShellContext.Provider
          value={(shellContext as unknown) as ShellContextType}
        >
          <DataStreamSubscriptionsLink {...props} />
        </ShellContext.Provider>
      </I18nextProvider>,
    );

    await waitFor(() => {
      const linkElement = screen.getByTestId('link-testStream');
      expect(linkElement).toBeInTheDocument();
    });
  });

  it('enables the link if this is not a substream (parentStreamId is not provided)', async () => {
    render(
      <I18nextProvider i18n={i18nForTests}>
        <ShellContext.Provider
          value={(shellContext as unknown) as ShellContextType}
        >
          <DataStreamSubscriptionsLink {...props} />
        </ShellContext.Provider>
      </I18nextProvider>,
    );

    await waitFor(() => {
      const linkElement = screen.getByTestId('link-testStream');
      expect(linkElement).toHaveAttribute('is-disabled', 'false');
    });
  });

  it('disables the link if this is a substream (parentStreamId is provided)', async () => {
    render(
      <I18nextProvider i18n={i18nForTests}>
        <ShellContext.Provider
          value={(shellContext as unknown) as ShellContextType}
        >
          <DataStreamSubscriptionsLink
            {...props}
            parentStreamId="testParentStreamId"
          />
        </ShellContext.Provider>
      </I18nextProvider>,
    );

    await waitFor(() => {
      const linkElement = screen.getByTestId('link-testStream');
      expect(linkElement).toHaveAttribute('is-disabled', 'true');
    });
  });

  it('does not renders tooltip if this is not a substream (parentStreamId is not provided)', async () => {
    render(
      <I18nextProvider i18n={i18nForTests}>
        <ShellContext.Provider
          value={(shellContext as unknown) as ShellContextType}
        >
          <DataStreamSubscriptionsLink {...props} />
        </ShellContext.Provider>
      </I18nextProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId('popover-testStream'),
      ).not.toBeInTheDocument();
    });
  });

  it('render tooltip if this is a substream (parentStreamId is provided)', async () => {
    render(
      <I18nextProvider i18n={i18nForTests}>
        <ShellContext.Provider
          value={(shellContext as unknown) as ShellContextType}
        >
          <DataStreamSubscriptionsLink
            {...props}
            parentStreamId="testParentStreamId"
          />
        </ShellContext.Provider>
      </I18nextProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('popover-testStream')).toBeInTheDocument();
    });
  });
});
