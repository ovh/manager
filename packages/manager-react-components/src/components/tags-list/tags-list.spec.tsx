import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import { TagsList } from './tags-list.component';

describe('TagsList', () => {
  const tags = {
    tag1: 'value1',
    tag2: 'value2',
    tag3: 'value3',
    tag4: 'value4',
    tag5: 'value5',
  };
  let resizeCallback: ResizeObserverCallback;
  let originalOffsetWidth: any;
  let originalOffsetHeight: any;
  let originBoundingClientRect: any;

  beforeAll(() => {
    originalOffsetWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'offsetWidth',
    );
    originalOffsetHeight = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'offsetHeight',
    );

    originBoundingClientRect = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'getBoundingClientRect',
    );

    global.ResizeObserver = class {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback;
      }

      // eslint-disable-next-line class-methods-use-this
      observe() {}

      // eslint-disable-next-line class-methods-use-this
      unobserve() {}

      // eslint-disable-next-line class-methods-use-this
      disconnect() {}
    } as any;
  });

  afterEach(() => {
    if (originalOffsetWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        'offsetWidth',
        originalOffsetWidth,
      );
    }
    if (originalOffsetHeight) {
      Object.defineProperty(
        HTMLElement.prototype,
        'offsetHeight',
        originalOffsetHeight,
      );
    }
    if (originBoundingClientRect) {
      Object.defineProperty(
        HTMLElement.prototype,
        'getBoundingClientRect',
        originalOffsetHeight,
      );
    }
  });

  it('renders all badges when container is large enough (no truncate)', () => {
    const { container } = render(<TagsList tags={tags} lineNumber={1} />);

    act(() => {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        configurable: true,
        value: 900,
      });
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        configurable: true,
        value: 30,
      });
      Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({ width: 20 }) as DOMRect,
      });

      resizeCallback([], {} as ResizeObserver);
    });

    const badges = container.querySelectorAll('ods-badge');

    expect(badges.length).toBe(5);
    expect(badges[4].getAttribute('label')).toBe('tag5:value5');
  });

  it('renders truncated badge when container is too small', () => {
    const { container } = render(<TagsList tags={tags} lineNumber={1} />);

    act(() => {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        configurable: true,
        value: 10,
      });
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        configurable: true,
        value: 10,
      });
      Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({ width: 20 }) as DOMRect,
      });
      resizeCallback([], {} as ResizeObserver);
    });

    const badges = container.querySelectorAll('ods-badge');

    expect(badges.length).toBe(1);
    expect(badges[0].getAttribute('label')).toBe('...');
  });

  it('render all badge when have multi-line', () => {
    const { container } = render(<TagsList tags={tags} />);

    act(() => {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        configurable: true,
        value: 30,
      });
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        configurable: true,
        value: 10,
      });
      Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({ width: 20 }) as DOMRect,
      });
    });

    const badges = container.querySelectorAll('ods-badge');

    expect(badges.length).toBe(5);
  });
});
