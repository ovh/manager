import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FileUpload, FileUploadItem, FileUploadList } from '@/components';

describe('FileUploadList', () => {
  it('renders the component with default props', () => {
    const { container } = render(
      <FileUpload maxSize={1000000} maxSizeLabel="No file larger than:">
        <FileUploadList>
          {[].map((file: File, idx) => (
            <FileUploadItem file={file} key={idx} />
          ))}
        </FileUploadList>
      </FileUpload>,
    );
    expect(container).toBeTruthy();
  });
});
