import { describe, expect } from 'vitest';

import actionsCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { render } from '@/utils/test.provider';

import { ExportCsv } from './ExportCsv.component';

describe('ExportCsv Component', () => {
  test('renders Export CSV button', () => {
    const { getByTestId } = render(<ExportCsv />);
    expect(getByTestId('export-csv')).toHaveTextContent(
      actionsCommonTranslation.export_as.replace('{{ format }}', 'CSV'),
    );
  });
});
