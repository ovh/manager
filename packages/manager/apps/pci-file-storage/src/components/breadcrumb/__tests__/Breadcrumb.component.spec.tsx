import React, { ComponentProps } from 'react';

import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BreadcrumbItemProp } from '@ovhcloud/ods-react';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';

vi.mock('@ovhcloud/ods-react', () => {
  const Breadcrumb = ({ children }: ComponentProps<'div'>): JSX.Element => <div>{children}</div>;

  const BreadcrumbItem = ({ children }: BreadcrumbItemProp): JSX.Element => <div>{children}</div>;

  const BreadcrumbLink = ({ children, ...props }: ComponentProps<'a'>): JSX.Element => (
    <a {...props}>{children}</a>
  );

  return { BreadcrumbItem, BreadcrumbLink, Breadcrumb };
});

vi.mock('@/hooks/useGetProject', () => ({
  useGetProject: () => ({
    id: 'projectId',
    name: 'projectName',
    url: 'http://project',
  }),
}));

describe('Breadcrumb component', () => {
  it('should render base items plus added items', () => {
    render(
      <MemoryRouter>
        <Breadcrumb items={[{ label: 'File', href: '/file' }]} />
      </MemoryRouter>,
    );

    const projectElement = screen.getByText('projectName');
    expect(projectElement).toBeVisible();
    expect(projectElement).toHaveAttribute('href', 'http://project');

    const appElement = screen.getByText('File Storage');
    expect(appElement).toBeVisible();
    expect(appElement).toHaveAttribute('href', '/');

    const itemElement = screen.getByText('File');
    expect(itemElement).toBeVisible();
    expect(itemElement).toHaveAttribute('href', '/file');
  });
});
