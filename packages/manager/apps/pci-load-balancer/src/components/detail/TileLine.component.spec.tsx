import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import TileLine from './TileLine.component';

describe('TileLine', () => {
  it('renders title with correct text', () => {
    const { getByText } = render(
      <TileLine title="Test Title" value={<div />} />,
    );
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('renders value element', () => {
    const { getByText } = render(
      <TileLine title="Test Title" value={<div>Test Value</div>} />,
    );
    expect(getByText('Test Value')).toBeInTheDocument();
  });

  it('renders divider', () => {
    const { container } = render(
      <TileLine title="Test Title" value={<div />} />,
    );
    expect(container.querySelector('osds-divider')).toBeInTheDocument();
  });

  it('applies correct class to title', () => {
    const { getByText } = render(
      <TileLine title="Test Title" value={<div />} />,
    );
    expect(getByText('Test Title')).toHaveClass('mb-2');
  });

  it('applies correct size to title', () => {
    const { getByText } = render(
      <TileLine title="Test Title" value={<div />} />,
    );
    expect(getByText('Test Title')).toHaveAttribute('size', ODS_TEXT_SIZE._200);
  });

  it('applies correct level to title', () => {
    const { getByText } = render(
      <TileLine title="Test Title" value={<div />} />,
    );
    expect(getByText('Test Title')).toHaveAttribute(
      'level',
      ODS_TEXT_LEVEL.heading,
    );
  });

  it('applies correct color to title', () => {
    const { getByText } = render(
      <TileLine title="Test Title" value={<div />} />,
    );
    expect(getByText('Test Title')).toHaveAttribute(
      'color',
      ODS_THEME_COLOR_INTENT.text,
    );
  });
});
