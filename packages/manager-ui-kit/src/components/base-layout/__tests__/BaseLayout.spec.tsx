import React from 'react';
import { vitest } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { IamAuthorizationResponse } from '../../../hooks/iam/iam.interface';
import { BaseLayout } from '..';
import { GuideMenu, GuideMenuItem } from '../../guide-menu';

vitest.mock('../../../hooks/iam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  } as IamAuthorizationResponse),
}));

describe('BaseLayout component', () => {
  it('renders with header', () => {
    const header = {
      title: 'Test Header',
      guideMenu: (
        <GuideMenu
          items={
            [
              {
                id: 1,
                href: 'https://www.ovh.com',
                target: '_blank',
                label: 'ovh.com',
              },
            ] as GuideMenuItem[]
          }
        />
      ),
    };
    render(<BaseLayout header={header} />);
    const titleElement = screen.getByText('Test Header');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe('H1');
  });

  it('renders with breadcrumb', () => {
    const breadcrumb = <div data-testid="breadcrumb"></div>;
    render(<BaseLayout breadcrumb={breadcrumb} />);
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('renders with description', () => {
    const description = 'Test Description';
    render(<BaseLayout description={description} />);
    const descriptionElement = screen.getByText(description);
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement.tagName).toBe('SPAN');
  });

  it('renders with message', () => {
    const message = <div data-testid="messages"></div>;
    render(<BaseLayout message={message} />);
    expect(screen.getByTestId('messages')).toBeInTheDocument();
  });

  it('renders with sub-title', () => {
    const subtitle = 'Test Sub-title';
    render(<BaseLayout subtitle={subtitle} />);
    const subtitleElement = screen.getByText(subtitle);
    expect(subtitleElement).toBeInTheDocument();
    expect(subtitleElement.tagName).toBe('H3');
  });

  it('renders with tabs', () => {
    const tabs = <div data-testid="tabs"></div>;
    render(<BaseLayout tabs={tabs} />);
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <BaseLayout>
        <div data-testid="children"></div>
      </BaseLayout>,
    );
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  it('renders back link', () => {
    const backLink = {
      label: 'Back Link Label',
      onClick: vitest.fn(),
    };
    render(<BaseLayout backLink={backLink} />);
    const linkElement = screen.getByTestId('manager-back-link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.textContent).toBe(backLink.label);

    fireEvent.click(linkElement);
    expect(backLink.onClick).toHaveBeenCalled();
  });

  it('renders back link with previous page href', () => {
    const backLink = {
      label: 'Back Link Label',
      previousPageLink: 'https://ovhcloud.com/',
    };
    render(<BaseLayout backLink={backLink} />);
    const linkElement = screen.getByTestId('manager-back-link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.textContent).toBe(backLink.label);
  });

  it('does not render backLink when "onClick" or previousPageLink is not provided', () => {
    render(<BaseLayout backLink={{ label: 'Back Link Label' }} />);
    expect(screen.queryByText(/Back Link Label/i)).not.toBeInTheDocument();
  });
});
