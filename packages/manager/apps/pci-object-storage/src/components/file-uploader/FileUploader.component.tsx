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
  RadioGroup,
  RadioGroupItem,
  Label,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@datatr-ux/uxlib';
import {
  ExternalLink,
  File,
  FilePlus,
  HelpCircle,
  Upload,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import RouteModal from '@/components/route-modal/RouteModal';
import { useFileUploarderForm } from './file-uploader-form/useFileUploaderForm.hook';
import { octetConverter } from '@/lib/bytesHelper';
import storages from '@/types/Storages';
import A from '../links/A.component';
import { GUIDES, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';

interface FileUploaderProps {
  title: string;
  multipleFileImport: boolean;
  onFileSelect: (
    files: File[],
    pref?: string,
    storageClass?: storages.StorageClassEnum,
  ) => void;
  pending: boolean;
  jsonFile?: boolean;
  description?: string;
  isS3?: boolean;
}

const FileUploaderForm = React.forwardRef<HTMLInputElement, FileUploaderProps>(
  (
    {
      title,
      multipleFileImport,
      onFileSelect,
      pending,
      jsonFile,
      description,
      isS3 = false,
    },
    ref,
  ) => {
    const { form } = useFileUploarderForm({
      allowMultipleFile: multipleFileImport,
      jsonFile,
    });
    const { t } = useTranslation('components/file-uploader');
    const locale = useLocale();
    const { t: tObj } = useTranslation(
      'pci-object-storage/storages/s3/object-class',
    );
    const [isDragging, setIsDragging] = useState(false);
    const [storageClass, setStorageClass] = useState<storages.StorageClassEnum>(
      storages.StorageClassEnum.STANDARD,
    );
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
      onFileSelect(formValues.files, formValues.prefix, storageClass);
    });
    return (
      <RouteModal>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-auto max-h-[80vh]">
            {!!description && <p className="mb-4">{description}</p>}
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
                {isS3 && (
                  <div className="my-4 space-y-2">
                    <div className="flex flex-row items-center gap-2">
                      <FormLabel>{t('storageClassLabel')}</FormLabel>
                      <Popover>
                        <PopoverTrigger>
                          <HelpCircle className="size-4" />
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="text-sm">
                            <p>{t('popOverDesc1')}</p>
                            <div className="flex flex-col px-2">
                              <A
                                href={getGuideUrl(
                                  GUIDES.OBJ_STO_CLASSES,
                                  locale,
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <div className="inline-flex items-center gap-2">
                                  <span className="text-primary-500">
                                    {t('popOverDesc2')}
                                  </span>
                                  <ExternalLink className="size-3" />
                                </div>
                              </A>
                              <A
                                href={getGuideUrl(
                                  GUIDES.OBJ_STO_PRICES,
                                  locale,
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <div className="inline-flex items-center gap-2">
                                  <span className="text-primary-500">
                                    {t('popOverDesc3')}
                                  </span>
                                  <ExternalLink className="size-3" />
                                </div>
                              </A>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <RadioGroup
                      className="px-2"
                      aria-labelledby="storage-class-radio"
                      value={storageClass}
                      onValueChange={(newValue: storages.StorageClassEnum) => {
                        setStorageClass(newValue);
                      }}
                    >
                      {Object.values(storages.StorageClassEnum)
                        .filter(
                          (st) => st !== storages.StorageClassEnum.DEEP_ARCHIVE,
                        )
                        .map((storeClass: storages.StorageClassEnum) => (
                          <div className="flex items-center gap-3">
                            <RadioGroupItem
                              value={storeClass}
                              id={storeClass}
                            />
                            <Label htmlFor={storeClass}>
                              {tObj(`objectClass_${storeClass}`)}
                            </Label>
                          </div>
                        ))}
                    </RadioGroup>
                  </div>
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
