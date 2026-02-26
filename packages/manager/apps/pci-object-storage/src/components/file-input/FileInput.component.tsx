import * as React from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@datatr-ux/uxlib';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import FileIcon from '../file-icon/FileIcon.component';
import { useLocaleBytesConverter } from '@/hooks/useLocaleByteConverter.hook';

interface FileInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'type'
  > {
  value?: File[];
  onChange?: (files: File[]) => void;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ value = [], onChange, multiple = false, className, ...props }, ref) => {
    const localeBytesConverter = useLocaleBytesConverter();
    const { t } = useTranslation('components/file-uploader');
    const [isDragging, setIsDragging] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // merge external ref
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleFiles = (files: FileList | null) => {
      if (!files) return;
      const newFiles = Array.from(files);
      const merged = multiple ? [...value, ...newFiles] : newFiles;
      onChange?.(merged);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      e.target.value = ''; // allow selecting the same file again
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    };

    const removeFile = (fileToRemove: File) => {
      onChange?.(value.filter((f) => f !== fileToRemove));
    };

    return (
      <div className="space-y-3">
        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={clsx(
            'flex flex-col items-center justify-center border-2 rounded-md cursor-pointer transition-colors text-center p-6 min-h-[10rem] w-full',
            isDragging
              ? 'border-blue-700 bg-blue-50'
              : 'border-blue-500 border-dashed',
            className,
          )}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            multiple={multiple}
            onChange={handleInputChange}
            data-testid="file-input"
            {...props}
          />
          <Upload className="w-10 h-10 text-gray-500 mb-2" />
          <p className="text-gray-600 mb-4">{t('importFileLabel')}</p>
          <Button type="button" mode="ghost" size="sm" className="font-bold">
            <Upload className="size-4" />
            {t('importFileButton')}
          </Button>

          {/* File list */}
          {value?.length > 0 && (
            <div className="mt-2 px-4 w-full max-h-48 overflow-auto">
              {value.map((file, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 items-center border-b border-gray-200"
                >
                  <div className="flex flex-row items-center gap-4">
                    <FileIcon className="size-4" fileName={file.name} />
                    <p
                      className="font-semibold max-w-60 truncate"
                      title={file.name}
                    >
                      {file.name}
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-end gap-4">
                    <p>{localeBytesConverter(file.size)}</p>
                    <Button
                      type="button"
                      mode="ghost"
                      className="h-4 w-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file);
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);

FileInput.displayName = 'FileInput';
