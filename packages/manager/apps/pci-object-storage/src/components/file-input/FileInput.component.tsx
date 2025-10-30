import * as React from 'react';
import { Upload, File as FileIcon, X } from 'lucide-react';
import {
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@datatr-ux/uxlib';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { octetConverter } from '@/lib/bytesHelper';

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
            {...props}
          />
          <Upload className="w-10 h-10 text-gray-500 mb-2" />
          <p className="text-gray-600 mb-4">{t('importFileLabel')}</p>
          <Button type="button" mode="ghost" size="sm" className="font-bold">
            <Upload className="size-4 mr-2" />
            {t('importFileButton')}
          </Button>

          {/* File list */}
          {value?.length > 0 && (
            <div className="mt-2 px-4">
              <Table>
                <TableBody>
                  {value.map((file, index) => (
                    <TableRow key={index} className="text-sm">
                      <TableCell>
                        <FileIcon className="size-4" />
                      </TableCell>
                      <TableCell className="w-[250px] truncate text-left">
                        {file.name}
                      </TableCell>
                      <TableCell>{octetConverter(file.size)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          className="text-text p-0 bg-transparent hover:bg-primary-100 hover:text-primary-700 hover:font-semibold h-4 w-4 mt-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file);
                          }}
                        >
                          <X className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    );
  },
);

FileInput.displayName = 'FileInput';
