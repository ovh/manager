import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { logMessagesMock } from '../../data/mocks/logMessage.mock';
import { renderTest } from '../../test-utils';

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

const getDOMRect = (width: number, height: number) => ({
  width,
  height,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  toJSON: () => {},
});

beforeEach(() => {
  Element.prototype.getBoundingClientRect = vi.fn(function test(this: Element) {
    if (this.getAttribute('data-testid') === 'logTail-listContainer') {
      return getDOMRect(1000, 800);
    }
    return getDOMRect(500, 20);
  });
});

afterEach(() => {
  Element.prototype.getBoundingClientRect = vi.fn(function test() {
    return getDOMRect(0, 0);
  });
});

describe('LogTail test suite', () => {
  it('should display an error if /log/url api is KO', async () => {
    await renderTest({ isLogTailUrlKO: true });

    await waitFor(() => expect(screen.getByTestId('logTail-error')).toBeVisible(), {
      timeout: 10_000,
    });
  });

  it('should render a loading state when the api request is pending', async () => {
    await renderTest();

    await waitFor(() => expect(screen.getByTestId('logTail-spinner')).toBeVisible(), {
      timeout: 10_000,
    });

    await waitFor(() => expect(screen.getByTestId('logTail-searchInput')).toBeVisible(), {
      timeout: 10_000,
    });
  });

  it('should render LogMessage component', async () => {
    await renderTest();

    await waitFor(() => expect(screen.getByTestId('logTail-searchInput')).toBeVisible(), {
      timeout: 10_000,
    });
    expect(screen.getByTestId('logTail-togglePolling')).toBeVisible();
    expect(screen.getByTestId('logTail-clearSession')).toBeVisible();
  });

  it('should display messages', async () => {
    await renderTest();

    await waitFor(
      () => expect(screen.getByText(logMessagesMock?.[0]?.message ?? '')).toBeVisible(),
      {
        timeout: 10_000,
      },
    );

    expect(screen.queryAllByTestId('logTail-item')).toHaveLength(logMessagesMock.length);
  });

  it('should display waiting message on polling', async () => {
    const user = userEvent.setup();
    await renderTest();

    await waitFor(
      () => expect(screen.getByText(logMessagesMock?.[0]?.message ?? '')).toBeVisible(),
      {
        timeout: 10_000,
      },
    );

    expect(screen.getByTestId('logTail-polling')).toBeVisible();

    await act(() => user.click(screen.getByTestId('logTail-togglePolling')));

    expect(screen.queryAllByTestId('logTail-polling')).toHaveLength(0);
  });

  it('should display error message on API error', async () => {
    await renderTest({ isLogMessagesKO: true });

    await waitFor(() => expect(screen.getByTestId('logTail-message-error')).toBeVisible(), {
      timeout: 10_000,
    });
  });

  it('should clear the list on click on clear session', async () => {
    const user = userEvent.setup();
    await renderTest();

    await waitFor(
      () => expect(screen.getByText(logMessagesMock?.[0]?.message ?? '')).toBeVisible(),
      {
        timeout: 10_000,
      },
    );

    await act(() => user.click(screen.getByTestId('logTail-togglePolling')));
    await act(() => user.click(screen.getByTestId('logTail-clearSession')));

    await waitFor(() => expect(screen.queryAllByTestId('logTail-item')).toHaveLength(0), {
      timeout: 10_000,
    });
  });
});
