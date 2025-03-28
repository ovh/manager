import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { SubmitHandler } from 'react-hook-form';
import { InfoIcon, MinusCircle, PlusCircle } from 'lucide-react';
import {
  Input,
  Button,
  ScrollArea,
  Badge,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Alert,
  AlertDescription,
} from '@datatr-ux/uxlib';
import { UserAcl } from '@/types/cloud/project/database/opensearch';
import { useAclsSelectForm } from './useAclsSelectForm.hook';
import { USER_CONFIG } from './user.constants';

interface AclsSelectProps {
  value: UserAcl[];
  onChange: (newAcls: UserAcl[]) => void;
}

const AclsSelect = React.forwardRef<HTMLInputElement, AclsSelectProps>(
  ({ value, onChange }, ref) => {
    const { t } = useTranslation(
      'pci-databases-analytics/services/service/users',
    );
    const patternInputRef = useRef<HTMLInputElement>(null);
    const addAclBtnRef = useRef<HTMLButtonElement>(null);
    const scrollListRef = useRef<HTMLUListElement>(null);
    const { form, schema } = useAclsSelectForm({
      existingAcls: value,
    });
    type ValidationSchema = z.infer<typeof schema>;

    // Scroll to the bottom of the list when a new acl is added
    useEffect(() => {
      const scrollContainer = scrollListRef.current;
      if (scrollContainer) {
        const { lastChild } = scrollContainer;
        if (lastChild instanceof Element) {
          lastChild.scrollIntoView({ behavior: 'smooth' });
        } else {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, [value, scrollListRef]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        addAclBtnRef.current?.click();
        patternInputRef.current?.focus();
        event.preventDefault();
      }
    };
    const handleAddAcl: SubmitHandler<ValidationSchema> = (formValues) => {
      onChange([
        ...value,
        {
          pattern: formValues.pattern,
          permission: formValues.permission,
        },
      ]);
      form.reset();
      patternInputRef.current?.focus();
    };
    const handleRemoveAcl = (index: number) => {
      const updatedAcls = value.filter((_, i) => i !== index);
      onChange(updatedAcls);
    };

    const errors = useMemo(
      () =>
        Object.entries(form.formState.errors)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(([_, error]) => error?.message)
          .filter((message): message is string => Boolean(message)),
      [form.formState.errors],
    );

    return (
      <>
        <Alert variant="primary">
          <InfoIcon className="h-6 w-6" />
          <AlertDescription>
            <p>{t('formUserAclPatternAlertInfo')}</p>
          </AlertDescription>
        </Alert>
        <div className="flex items-end gap-2">
          <FormField
            control={form.control}
            name="pattern"
            render={({ field }) => (
              <FormItem ref={ref} className="w-full">
                <FormLabel>{t('formUserAclPatternInputLabel')}</FormLabel>
                <FormControl className="flex-grow">
                  <Input
                    data-testid="acl-select-pattern-input"
                    {...field}
                    onKeyDown={handleKeyDown}
                    ref={patternInputRef}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="permission"
            render={({ field }) => (
              <FormItem ref={ref} className="w-full">
                <FormLabel>{t('formUserAclPermissionInputLabel')}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger ref={field.ref}>
                      <SelectValue
                        placeholder={t('formUserAclPermissionInputPlaceholder')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {USER_CONFIG.acls.permission.values.map(
                          (permissionValue) => (
                            <SelectItem
                              value={permissionValue}
                              key={permissionValue}
                            >
                              {permissionValue}
                            </SelectItem>
                          ),
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            ref={addAclBtnRef}
            mode={'ghost'}
            type="button"
            onClick={form.handleSubmit(handleAddAcl)}
            data-testid="acl-select-submit-button"
            className="text-primary rounded-full p-2 ml-2 hover:text-primary"
          >
            <PlusCircle />
          </Button>
        </div>
        <div>
          {errors.map((error, i) => (
            <span
              key={`${error}-${i}`}
              className="text-sm font-medium text-destructive"
            >
              {error}
            </span>
          ))}
        </div>
        <div>
          <label>{t('formUserAclConfiguredAcls')}</label>
          <ScrollArea className="h-40 rounded-md border">
            <ul ref={scrollListRef}>
              {value.map((acl, index) => (
                <li
                  key={`${acl.pattern}${acl.permission}`}
                  className="flex items-center"
                  data-testid="acl-select-list-acl-item"
                >
                  <Button
                    className="text-destructive rounded-full p-2 ml-2 hover:text-destructive h-8 w-8"
                    mode={'ghost'}
                    type="button"
                    onClick={() => handleRemoveAcl(index)}
                  >
                    <MinusCircle />
                  </Button>
                  <div className="flex gap-2">
                    <span>{acl.pattern}</span>
                    <Badge variant="outline">{acl.permission}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </>
    );
  },
);
AclsSelect.displayName = 'AclsSelect';

export default AclsSelect;
