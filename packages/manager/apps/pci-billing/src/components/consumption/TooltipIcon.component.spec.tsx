import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TooltipIcon from './TooltipIcon.component';

describe('TooltipIcon', () => {
  const mockIcon = ODS_ICON_NAME.INFO;
  const mockContent = 'Information tooltips';

  it('matches snapshot', () => {
    const { asFragment } = render(
      <TooltipIcon icon={mockIcon} content={mockContent} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
