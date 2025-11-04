import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderBaseLayout } from '@/commons/tests-utils/Render.utils';
import { guideMenuItems } from '@/commons/tests-utils/StaticData.constants';
import { GuideMenu } from '@/components';

describe('BaseLayout component', () => {
  it('renders with header and GuideMenu', () => {
    const header = {
      title: 'Test Header',
      guideMenu: <GuideMenu items={guideMenuItems} />,
    };

    renderBaseLayout({ header });

    const title = screen.getByText('Test Header');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H1');
    expect(screen.getByText('Guide Menu Item Label')).toBeInTheDocument();
  });

  it('renders with breadcrumb', () => {
    renderBaseLayout({ breadcrumb: <div data-testid="breadcrumb" /> });
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('renders with description', () => {
    const description = 'Test Description';
    renderBaseLayout({ description });
    const element = screen.getByText(description);
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('SPAN');
  });

  it('renders with message', () => {
    renderBaseLayout({ message: <div data-testid="messages" /> });
    expect(screen.getByTestId('messages')).toBeInTheDocument();
  });

  it('renders with subtitle', () => {
    const subtitle = 'Test Subtitle';
    renderBaseLayout({ subtitle });
    const element = screen.getByText(subtitle);
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('H3');
  });

  it('renders with tabs', () => {
    renderBaseLayout({ tabs: <div data-testid="tabs" /> });
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
  });

  it('renders children content', () => {
    renderBaseLayout({ children: <div data-testid="children" /> });
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  it('renders clickable back link', () => {
    const onClick = vi.fn();
    const backLink = { label: 'Back Link Label', onClick };

    renderBaseLayout({ backLink });

    const link = screen.getByTestId('manager-back-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent(backLink.label);

    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders back link with previousPageLink', () => {
    const backLink = {
      label: 'Back Link Label',
      previousPageLink: 'https://ovhcloud.com/',
    };

    renderBaseLayout({ backLink });

    const link = screen.getByTestId('manager-back-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent(backLink.label);
    expect(link).toHaveAttribute('href', backLink.previousPageLink);
  });

  it('does not render backLink when missing onClick or previousPageLink', () => {
    renderBaseLayout({ backLink: { label: 'Back Link Label' } });
    expect(screen.queryByText(/Back Link Label/i)).not.toBeInTheDocument();
  });
});
