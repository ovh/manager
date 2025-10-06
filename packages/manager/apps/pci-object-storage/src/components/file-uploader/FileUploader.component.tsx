import { useTranslation } from 'react-i18next';
import React, { useRef, useState } from 'react';
import {
  Button,
  Input,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  ScrollArea,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@datatr-ux/uxlib';
import { File, FilePlus, Upload, X } from 'lucide-react';
import clsx from 'clsx';
import RouteModal from '@/components/route-modal/RouteModal';
import { useFileUploarderForm } from './file-uploader-form/useFileUploaderForm.hook';
import { octetConverter } from '@/lib/bytesHelper';

interface FileUploaderProps {
  title: string;
  multipleFileImport: boolean;
  onFileSelect: (pref: string, files: File[]) => void;
  pending: boolean;
}

const FileUploaderForm = React.forwardRef<HTMLInputElement, FileUploaderProps>(
  ({ title, multipleFileImport, onFileSelect, pending }, ref) => {
    const { form } = useFileUploarderForm({
      allowMultipleFile: multipleFileImport,
    });
    const { t } = useTranslation('components/file-uploader');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files ?? []);
      const currentFiles = form.getValues('files') ?? [];
      form.setValue('files', [...currentFiles, ...newFiles], {
        shouldValidate: true,
      });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files ?? []);
      const currentFiles = form.getValues('files') ?? [];
      form.setValue('files', [...currentFiles, ...droppedFiles], {
        shouldValidate: true,
      });
    };

    const removeFile = (fileToRemove: File) => {
      const currentFiles = form.getValues('files');
      form.setValue(
        'files',
        currentFiles.filter((file) => file !== fileToRemove),
      );
    };

    const onSubmit = form.handleSubmit((formValues) => {
      onFileSelect(formValues.prefix, formValues.files);
    });
    return (
      <RouteModal>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-auto max-h-[80vh]">
            <Form {...form}>
              <form onSubmit={onSubmit} className="flex flex-col gap-2">
                {multipleFileImport && (
                  <FormField
                    control={form.control}
                    name="prefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('prefixFieldLabel')}</FormLabel>
                        <Input placeholder="/" {...field} ref={ref} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="files"
                  render={() => (
                    <FormItem>
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={clsx(
                          'flex flex-col items-center justify-center border-2 rounded-md cursor-pointer transition-colors text-center p-6 min-h-[10rem] w-full',
                          isDragging
                            ? 'border-blue-700 bg-blue-50'
                            : 'border-blue-500 border-dashed',
                        )}
                      >
                        <Input
                          type="file"
                          multiple
                          ref={fileInputRef}
                          onChange={handleChange}
                          className="hidden"
                        />

                        <FilePlus className="w-10 h-10 text-gray-500 mb-2" />
                        <p className="text-gray-600 mb-4">
                          {t('importFileLabel')}
                        </p>
                        <Button
                          type="button"
                          mode="ghost"
                          size="sm"
                          className="font-bold"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="size-4 mr-2" />
                          {t('importFileButton')}
                        </Button>
                        <div className="mt-2 px-4">
                          {form.getValues('files')?.length > 0 && (
                            <Table>
                              <TableBody>
                                {form.getValues('files').map((file, index) => (
                                  <TableRow key={index} className="text-sm">
                                    <TableCell>
                                      <File className="size-4" />
                                    </TableCell>
                                    <TableCell>{file.name}</TableCell>
                                    <TableCell>
                                      {octetConverter(file.size)}
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        type="button"
                                        className="text-text p-0 bg-transparent hover:bg-primary-100 hover:text-primary-700 hover:font-semibold h-4 w-4 mt-1"
                                        onClick={() => removeFile(file)}
                                      >
                                        <X className="size-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="flex justify-end">
                  <DialogClose asChild>
                    <Button type="button" mode="outline">
                      {t('fileUploaderButtonCancel')}
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={pending}>
                    {t('fileUploaderButtonConfirm')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </RouteModal>
    );
  },
);

export default FileUploaderForm;
