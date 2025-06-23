import React from 'react';
import { screen } from '@testing-library/react';
import { Links } from '../Links.component';
import { LinkType } from '../Links.props';
import { render } from '../../../utils/test.provider';

describe('Link component', () => {
  it('renders a simple link correctly', () => {
    const props = {
      children: 'test link',
      href: 'https://www.example.com',
    };
    const { asFragment } = render(<Links {...props} />);
    const linkElement = screen.getByText('test link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://www.example.com');
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a back link correctly', () => {
    const props = {
      children: 'Back to the list',
      href: 'https://www.example.com',
      type: LinkType.back,
    };
    const { asFragment } = render(<Links {...props} />);
    const linkElement = screen.getByText('Back to the list');
    expect(linkElement).toBeInTheDocument();

    const iconElement = linkElement
      .closest('a')
      ?.querySelector('[class*="arrow-left"]');
    expect(iconElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://www.example.com');
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a next link correctly', () => {
    const props = {
      children: 'Next Page',
      href: 'https://www.example.com',
      type: LinkType.next,
    };
    const { asFragment } = render(<Links {...props} />);
    const linkElement = screen.getByText('Next Page');
    expect(linkElement).toBeInTheDocument();

    const iconElement = linkElement
      .closest('a')
      ?.querySelector('[class*="arrow-right"]');
    expect(iconElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://www.example.com');
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a external link correctly with label as prop', () => {
    const props = {
      href: 'https://www.ovhcloud.com/',
      target: '_blank',
      children: 'External Page',
      type: LinkType.external,
    };

    const { asFragment } = render(<Links {...props} />);
    const linkElement = screen.getByText('External Page');
    expect(linkElement).toBeInTheDocument();

    const iconElement = linkElement
      .closest('a')
      ?.querySelector('[class*="external-link"]');
    expect(iconElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://www.ovhcloud.com/');
    expect(asFragment()).toMatchSnapshot();
  });
});
