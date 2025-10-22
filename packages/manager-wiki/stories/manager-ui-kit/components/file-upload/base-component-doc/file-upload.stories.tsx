import {
  FILE_UPLOAD_I18N,
  FileUpload,
  type FileUploadAcceptDetail,
  FileUploadItem,
  FileUploadList,
  type FileUploadProp,
  type FileUploadRejectDetail,
  FormField,
  FormFieldLabel,
} from '@ovhcloud/ods-react';
import { type Meta, type StoryObj } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';

type Story = StoryObj<FileUploadProp>;

const meta: Meta<FileUploadProp> = {
  argTypes: excludeFromDemoControls(['accept', 'locale', 'name', 'onFileAccept', 'onFileReject', 'required']),
  component: FileUpload,
  subcomponents: { FileUploadItem, FileUploadList },
  title: 'Manager UI Kit/Components/File Upload/Base',
};

export default meta;

export const Demo: Story = {
  render: (arg) => {
    const [error, setError] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);

    function onAccept({ files }: FileUploadAcceptDetail): void {
      setFiles(files);
      setError('');
    }

    function onReject({ files }: FileUploadRejectDetail): void {
      setError(files.length ? 'File(s) rejected' : '');
    }

    return (
      <FileUpload
        { ...arg }
        error={ arg.error || error }
        onFileAccept={ onAccept }
        onFileReject={ onReject }>
        <FileUploadList>
          {
            files.map((file: File, idx) => (
              <FileUploadItem
                file={ file }
                key={ idx } />
            ))
          }
        </FileUploadList>
      </FileUpload>
    );
  },
  argTypes: orderControls({
    acceptedFileLabel: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'text',
    },
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    dropzoneLabel: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'text',
    },
    error: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'text',
    },
    invalid: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    maxFile: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'number',
    },
    maxFileLabel: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'text',
    },
    maxSize: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'number',
    },
    maxSizeLabel: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'text',
    },
    triggerLabel: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'text',
    },
  }),
};

export const Accept: Story = {
  globals: {
    imports: `import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const [error, setError] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);

    function onAccept({ files }: FileUploadAcceptDetail): void {
      setFiles(files);
      setError('');
    }

    function onReject({ files }: FileUploadRejectDetail): void {
      setError(files.length ? 'File(s) not of the expected format' : '');
    }

    return (
      <FileUpload
        accept="image/png"
        acceptedFileLabel="Png files only"
        error={ error }
        onFileAccept={ onAccept }
        onFileReject={ onReject }>
        <FileUploadList>
          {
            files.map((file: File, idx) => (
              <FileUploadItem
                file={ file }
                key={ idx } />
            ))
          }
        </FileUploadList>
      </FileUpload>
    );
  },
};

export const AccessibilityFileButton: Story = {
  globals: {
    imports: `import { FILE_UPLOAD_I18N, FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const [files, setFiles] = useState<File[]>([]);

    return (
      <FileUpload onFileAccept={ ({ files }) => setFiles(files) }>
        <FileUploadList>
          {
            files.map((file: File, idx) => (
              <FileUploadItem
                file={ file }
                i18n={{
                  [FILE_UPLOAD_I18N.cancelButton]: `Cancel uploading ${file.name}`,
                  [FILE_UPLOAD_I18N.deleteButton]: `Remove ${file.name}`,
                  [FILE_UPLOAD_I18N.progressBar]: `Uploading ${file.name}`,
                }}
                key={ idx } />
            ))
          }
        </FileUploadList>
      </FileUpload>
    );
  },
};

export const CustomLabels: Story = {
  globals: {
    imports: `import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const [files, setFiles] = useState<File[]>([]);

    return (
      <FileUpload
        acceptedFileLabel="Formats acceptés : images"
        dropzoneLabel="Glisser-déposer des fichiers"
        maxFile={ 3 }
        maxFileLabel="Nombre maximal de fichiers :"
        maxSize={ 524288000 }
        maxSizeLabel="Taille de fichier max :"
        onFileAccept={ ({ files }) => setFiles(files) }
        triggerLabel="Parcourir les fichiers">
        <FileUploadList>
          {
            files.map((file: File, idx) => (
              <FileUploadItem
                file={ file }
                key={ idx }
                progress={ 100 }
                uploadSuccessLabel="Fichier uploadé" />
            ))
          }
        </FileUploadList>
      </FileUpload>
    );
  },
};

export const Default: Story = {
  globals: {
    imports: `import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const [files, setFiles] = useState<File[]>([]);

    return (
      <FileUpload onFileAccept={ ({ files }) => setFiles(files) }>
        <FileUploadList>
          {
            files.map((file: File, idx) => (
              <FileUploadItem
                file={ file }
                key={ idx } />
            ))
          }
        </FileUploadList>
      </FileUpload>
    );
  },
};

export const Disabled: Story = {
  globals: {
    imports: `import { FileUpload, FileUploadList } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <FileUpload disabled>
      <FileUploadList />
    </FileUpload>
  ),
};

export const MaxFile: Story = {
  globals: {
    imports: `import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const [error, setError] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);

    function onAccept({ files }: FileUploadAcceptDetail): void {
      setFiles(files);
      setError('');
    }

    function onReject({ files }: FileUploadRejectDetail): void {
      setError(files.length ? 'Too many files' : '');
    }

    return (
      <FileUpload
        error={ error }
        maxFile={ 3 }
        maxFileLabel="Maximum file allowed:"
        onFileAccept={ onAccept }
        onFileReject={ onReject }>
        <FileUploadList>
          {
            files.map((file: File, idx) => (
              <FileUploadItem
                file={ file }
                key={ idx } />
            ))
          }
        </FileUploadList>
      </FileUpload>
    );
  },
};

export const MaxSize: Story = {
  globals: {
    imports: `import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const [error, setError] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);

    function onAccept({ files }: FileUploadAcceptDetail): void {
      setFiles(files);
      setError('');
    }

    function onReject({ files }: FileUploadRejectDetail): void {
      setError(files.length ? 'File(s) too large' : '');
    }

    return (
      <FileUpload
        error={ error }
        maxSize={ 1000000 }
        maxSizeLabel="No file larger than:"
        onFileAccept={ onAccept }
        onFileReject={ onReject }>
        <FileUploadList>
          {
            files.map((file: File, idx) => (
              <FileUploadItem
                file={ file }
                key={ idx } />
            ))
          }
        </FileUploadList>
      </FileUpload>
    );
  },
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const [files, setFiles] = useState<File[]>([]);

    return (
      <FileUpload onFileAccept={ ({ files }) => setFiles(files) }>
        <FileUploadList>
          {
            files.map((file: File, idx) => (
              <FileUploadItem
                file={ file }
                key={ idx } />
            ))
          }
        </FileUploadList>
      </FileUpload>
    );
  },
};

export const Upload: Story = {
  globals: {
    imports: `import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useEffect, useState } from 'react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    type MyFile = File & {
      error?: string,
      progress?: number,
    }

    const [files, setFiles] = useState<MyFile[]>([]);

    useEffect(() => {
      files.forEach((file) => {
        if (!file.progress) {
          uploadFile(file);
        }
      });
    }, [files]);

    function uploadFile(file: MyFile): void {
      const intervalId = setInterval(() => {
        setFiles((files) => files.map((f) => {
          if (f.name === file.name) {
            f.progress = (f.progress || 0) + Math.floor(Math.random() * 10 + 1);

            if (f.progress >= 100) {
              clearInterval(intervalId);
            }
          }
          return f;
        }));
      }, 100);
    }

    return (
      <FileUpload onFileAccept={ ({ files }) => setFiles(files) }>
        <FileUploadList>
          {
            files.map((file, idx) => (
              <FileUploadItem
                error={ file.error }
                file={ file }
                key={ idx }
                progress={ file.progress } />
            ))
          }
        </FileUploadList>
      </FileUpload>
    );
  },
};

export const InFormField: Story = {
  globals: {
    imports: `import { FileUpload, FileUploadItem, FileUploadList, FormField, FormFieldLabel } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const [files, setFiles] = useState<File[]>([]);

    return (
        <FormField>
          <FormFieldLabel>
            Files:
          </FormFieldLabel>

          <FileUpload onFileAccept={ ({ files }) => setFiles(files) }>
            <FileUploadList>
              {
                files.map((file: File, idx) => (
                  <FileUploadItem
                    file={ file }
                    key={ idx } />
                ))
              }
            </FileUploadList>
          </FileUpload>
        </FormField>
    );
  },
};

export const AccessibilityFormField: Story = {
  globals: {
    imports: `import { FileUpload, FileUploadItem, FileUploadList, FormField, FormFieldLabel } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const [files, setFiles] = useState<File[]>([]);

    return (
      <FormField>
        <FormFieldLabel>
          Files:
        </FormFieldLabel>

        <FileUpload onFileAccept={ ({ files }) => setFiles(files) }>
          <FileUploadList>
            {
              files.map((file: File, idx) => (
                <FileUploadItem
                  file={ file }
                  key={ idx } />
              ))
            }
          </FileUploadList>
        </FileUpload>
      </FormField>
    );
  },
};
