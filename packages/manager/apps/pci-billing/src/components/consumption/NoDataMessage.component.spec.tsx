import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import NoDataMessage from './NoDataMessage.component';

describe('NoDataMessageComponent', () => {
  it('renders the message correctly', () => {
    const testMessage = 'Aucune donnée disponible';

    render(<NoDataMessage message={testMessage} />);

    const textElement = screen.getByText(testMessage);
    expect(textElement).toBeInTheDocument();
  });

  it('applies correct OsdsText props', () => {
    const testMessage = 'Test message';

    render(<NoDataMessage message={testMessage} />);

    const textElement = screen.getByText(testMessage);

    expect(textElement).toHaveAttribute('size', ODS_TEXT_SIZE._400.toString());
    expect(textElement).toHaveAttribute(
      'level',
      ODS_TEXT_LEVEL.body.toString(),
    );
    expect(textElement).toHaveAttribute(
      'color',
      ODS_THEME_COLOR_INTENT.text.toString(),
    );
  });

  it('renders with correct className', () => {
    const testMessage = 'Classe test';

    render(<NoDataMessage message={testMessage} />);

    const containerDiv = screen.getByText(testMessage).closest('div');
    expect(containerDiv).toHaveClass('my-3');

    const textElement = screen.getByText(testMessage);
    expect(textElement).toHaveClass('mb-5');
  });
});
