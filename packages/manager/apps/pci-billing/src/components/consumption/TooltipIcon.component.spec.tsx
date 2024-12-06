import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TooltipIcon from './TooltipIcon.component';

describe('TooltipIcon', () => {
  const mockIcon = ODS_ICON_NAME.INFO;
  const mockContent = 'Information tooltips';

  it('renders tooltip content correctly', () => {
    render(<TooltipIcon icon={mockIcon} content={mockContent} />);

    const tooltipContent = screen.getByText(mockContent);
    expect(tooltipContent).toBeInTheDocument();
  });

  it('applies correct tooltip text props', () => {
    render(<TooltipIcon icon={mockIcon} content={mockContent} />);

    const tooltipTextElement = screen.getByText(mockContent);

    expect(tooltipTextElement).toHaveAttribute(
      'size',
      ODS_TEXT_SIZE._100.toString(),
    );
    expect(tooltipTextElement).toHaveAttribute(
      'level',
      ODS_TEXT_LEVEL.body.toString(),
    );
    expect(tooltipTextElement).toHaveAttribute(
      'color',
      ODS_THEME_COLOR_INTENT.text.toString(),
    );
    expect(tooltipTextElement).toHaveClass('break-normal');
  });
});
