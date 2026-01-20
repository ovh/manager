import React from 'react';
import { screen } from '@testing-library/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { Links, LinkType } from './links.component';
import { render } from '../../../utils/test.provider';

describe('Links component', () => {
  it('renders a back link correctly', () => {
    const props = {
      label: 'Back to the list',
      href: 'https://www.example.com',
      type: LinkType.back,
    };

    render(<Links {...props} />);

    const linkElement = screen.getByText('Back to the list');

    expect(linkElement).toBeInTheDocument();
  });

  it('renders a next link correctly', () => {
    const props = {
      label: 'Next Page',
      href: 'https://www.example.com',
      type: LinkType.next,
    };

    render(<Links {...props} />);
    const linkElement = screen.getByText('Next Page');

    expect(linkElement).toBeInTheDocument();
  });
  it('renders a external link correctly', () => {
    const props = {
      href: 'https://www.ovhcloud.com/',
      target: OdsHTMLAnchorElementTarget._blank,
      label: 'External Page',
      type: LinkType.external,
    };

    render(<Links {...props} />);
    const linkElement = screen.getByText('External Page');

    expect(linkElement).toBeInTheDocument();
  });

  it('renders a survey link correctly', () => {
    const props = {
      surveyLink: {
        applicationKey: 'COM',
        email: 'test@example.com',
      },
      type: LinkType.survey,
    };

    const { container } = render(<Links {...props} />);
    const linkElement = container.querySelector('[label="link_survey_preset_label"]');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://s.elq.fr/ovhsat/COM_evaluation_survey?email=test%40example.com');
    expect(linkElement).toHaveAttribute('target', OdsHTMLAnchorElementTarget._blank);
    expect(linkElement).toHaveAttribute('rel', 'noopener');

    const iconElement = container.querySelector('[name="smiley-happy-concept"]');
    expect(iconElement).toBeInTheDocument();
  });
});
