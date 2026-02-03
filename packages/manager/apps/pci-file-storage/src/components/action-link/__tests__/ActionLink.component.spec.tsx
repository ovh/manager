import React, { ComponentProps } from 'react';

import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ActionLink } from '@/components/action-link/ActionLink.component';

vi.mock('@ovhcloud/ods-react', () => {
  const Link = ({
    children,
    href,
    className,
    target,
    ...props
  }: ComponentProps<'a'>): JSX.Element => (
    <a href={href} className={className} target={target} {...props}>
      {children}
    </a>
  );
  const Icon = ({ name }: { name: string }): JSX.Element => <span aria-hidden>{name}</span>;
  return { Icon, Link };
});

describe('ActionLink component', () => {
  it('renders label and uses internal href when isExternal is false', () => {
    render(
      <MemoryRouter>
        <ActionLink path="/internal/path" label="Internal link" />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: /internal link/i });
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', '/internal/path');
    expect(link).toHaveTextContent('Internal link');
  });

  it('uses path as href and shows external icon when isExternal is true', () => {
    render(
      <MemoryRouter>
        <ActionLink path="https://example.com" label="External" isExternal />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: /external/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveTextContent('External');
    expect(screen.getByText('external-link')).toBeVisible();
  });

  it('applies className', () => {
    render(
      <MemoryRouter>
        <ActionLink path="/" label="Link" className="custom-class" />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: /link/i });
    expect(link).toHaveClass('custom-class');
  });

  it('sets target _blank when isTargetBlank is true', () => {
    render(
      <MemoryRouter>
        <ActionLink path="https://example.com" label="Open in new tab" isExternal isTargetBlank />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: /open in new tab/i });
    expect(link).toHaveAttribute('target', '_blank');
  });
});
