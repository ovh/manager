import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { TagsModal } from './tags-modal.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('TagsModal', () => {
  beforeAll(() => {
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

    global.ResizeObserver = class {
      // eslint-disable-next-line class-methods-use-this
      observe() {}

      // eslint-disable-next-line class-methods-use-this
      unobserve() {}

      // eslint-disable-next-line class-methods-use-this
      disconnect() {}
    } as any;

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function () {
        const length = this.textContent?.length || 0;
        return {
          width: Math.max(20, length * 8),
          height: 100,
          top: 0,
          left: 0,
          bottom: 100,
          right: Math.max(20, length * 8),
          x: 0,
          y: 0,
          toJSON() {},
        };
      },
    );
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  const tags = {
    tag1: 'value1',
    tag2: 'value2',
  };

  const onCancel = vi.fn();
  const onEditTags = vi.fn();

  it('renders and uses mocked getBoundingClientRect', () => {
    const { container } = render(
      <TagsModal
        isOpen={true}
        displayName="Test"
        tags={tags}
        onCancel={onCancel}
        onEditTags={onEditTags}
      />,
    );

    const modal = container.querySelector('ods-modal');
    expect(modal.getBoundingClientRect().width).toBeGreaterThan(20);

    const backButton = container.querySelector('ods-button[label="back"]');
    fireEvent.click(backButton);
    expect(onCancel).toHaveBeenCalledOnce();
    const editButton = container.querySelector('ods-button[label="edit_tags"]');
    fireEvent.click(editButton);
    expect(onEditTags).toHaveBeenCalledTimes(1);
  });

  it.skip('filters tags correctly when searching all value', async () => {
    const { container } = render(
      <TagsModal
        isOpen={true}
        displayName="My Tags"
        tags={{
          tag1: 'value1',
          tag2: 'value2',
          tag3: 'value3',
          tag4: 'value4',
        }}
        onCancel={() => {}}
        onEditTags={() => {}}
      />,
    );

    const input = screen.getByPlaceholderText('search_placeholder');
    fireEvent.change(input, { target: { value: 'tag' } });

    const searchButton = container.querySelector('ods-button[label="search"]');
    fireEvent.click(searchButton);
    await waitFor(() => {
      const badges = container.querySelectorAll('ods-badge');

      expect(badges.length).toBe(4);
      expect(badges[3].getAttribute('label')).toBe('tag4:value4');
    });
  });

  it.skip('filters tags correctly when searching and return one value', async () => {
    const { container } = render(
      <TagsModal
        isOpen={true}
        displayName="My Tags"
        tags={{
          tag1: 'value1',
          tag2: 'value2',
          tag3: 'value3',
          tag4: 'value4',
        }}
        onCancel={() => {}}
        onEditTags={() => {}}
      />,
    );

    const input = screen.getByPlaceholderText('search_placeholder');
    fireEvent.change(input, { target: { value: 'tag1' } });

    await waitFor(() => {
      const searchButton = container.querySelector(
        'ods-button[label="search"]',
      );
      fireEvent.click(searchButton);
      const badges = container.querySelectorAll('ods-badge');

      expect(badges.length).toBe(1);
      expect(badges[0].getAttribute('label')).toBe('tag1:value1');
    });
  });
});
