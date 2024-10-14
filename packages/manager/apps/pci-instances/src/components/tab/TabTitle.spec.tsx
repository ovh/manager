import { render, screen } from '@testing-library/react';
import { describe } from 'vitest';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { TabTitle } from './TabTitle.component';

type Data = {
  label: string;
  isSelected: boolean;
  isNew?: boolean;
};

describe('TabTitle component', () => {
  test.each`
    label     | isSelected | isNew
    ${'foo'}  | ${false}   | ${false}
    ${'bar'}  | ${true}    | ${true}
    ${'fooz'} | ${false}   | ${undefined}
  `(
    'Should render correctly the tab title with a label <$label>, isSelected option <$isSelected> and optional isNew <$isNew> props',
    ({ label, isSelected, isNew }: Data) => {
      render(<TabTitle label={label} isSelected={isSelected} isNew={isNew} />);
      const titleElt = screen.getByText(label);
      expect(titleElt).toBeInTheDocument();
      expect(titleElt).toHaveClass('whitespace-nowrap text-lg');
      if (isSelected) {
        expect(titleElt).toHaveClass('font-bold');
        expect(titleElt).toHaveStyle(`color: ${ODS_THEME_COLOR_INTENT.text}`);
      }
      expect(titleElt).toHaveStyle(`color: ${ODS_THEME_COLOR_INTENT.text}`);
      if (isNew) {
        const isNewElt = screen.getByText('pci_instances_common_new');
        expect(isNewElt).toBeInTheDocument();
      }
    },
  );
});
