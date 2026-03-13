import '@/common/setupTests';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import { RecordPreviewBox } from '@/zone/pages/zone/components/RecordPreviewBox';

describe('RecordPreviewBox', () => {
  it('renders the label', () => {
    render(<RecordPreviewBox label="Aperçu de l'enregistrement" record="example.com. IN A 1.2.3.4" />, { wrapper });
    expect(screen.getByText("Aperçu de l'enregistrement")).toBeInTheDocument();
  });

  it('renders the record value in a textarea', () => {
    render(<RecordPreviewBox label="Preview" record="example.com. IN A 1.2.3.4" />, { wrapper });
    expect(screen.getByDisplayValue('example.com. IN A 1.2.3.4')).toBeInTheDocument();
  });

  it('renders the textarea as disabled', () => {
    render(<RecordPreviewBox label="Preview" record="example.com. IN MX 10 mail.example.com." />, { wrapper });
    expect(screen.getByDisplayValue(/IN MX/)).toBeDisabled();
  });
});
