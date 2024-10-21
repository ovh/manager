import React, { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CONFIGURATION_CONFIG } from './configuration.constants';
import { SshKey } from '@/types/cloud/sshkey';
import { OrderSshKey } from '@/types/orderFunnel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  UseAddSshKey,
  useAddSshKey,
} from '@/hooks/api/sshkey/useAddSshKey.hook';
import { useToast } from '@/components/ui/use-toast';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import * as sshkey from '@/types/cloud/sshkey';

interface SshKeyFormProps {
  configuredSshKeys: SshKey[];
  sshKeyList: OrderSshKey[];
  onChange: (newSshKeyList: OrderSshKey[]) => void;
  disabled?: boolean;
}

const SshKeyForm = React.forwardRef<HTMLInputElement, SshKeyFormProps>(
  ({ configuredSshKeys, sshKeyList, onChange, disabled }, ref) => {
    const { t } = useTranslation('pci-ai-notebooks/components/configuration');
    const { projectId } = useParams();
    const [selectedSSH, setSelectedSSH] = useState('-');
    const sshKeysSelectList: SshKey[] = useMemo(() => {
      const emptySshKey: SshKey[] = [
        {
          name: '-',
        },
      ];

      return emptySshKey.concat(configuredSshKeys);
    }, [configuredSshKeys]);

    const toast = useToast();

    const sshKeySchema = z.object({
      name: z
        .string()
        .min(1)
        .max(15)
        .refine(
          (newKeyName) =>
            !sshKeyList.some(
              (existingSSHKey) => existingSSHKey.name === newKeyName,
            ),
          {
            message: t('duplicateKeyError'),
          },
        ),
      sshKey: z.string().min(1),
    });

    const form = useForm({
      resolver: zodResolver(sshKeySchema),
    });

    const sshKeyMutationConfig: UseAddSshKey = {
      onError(err) {
        toast.toast({
          title: t(`addSshKeyToastErrorTitle`),
          variant: 'destructive',
          description: getAIApiErrorMessage(err),
        });
      },
      onSuccess(sshKey) {
        form.reset();
        toast.toast({
          title: t('formConnectionPoolToastSuccessTitle'),
          description: t(`addSshKeySuccessDescription`, {
            name: sshKey.name,
          }),
        });
        const newSshKey: OrderSshKey = {
          name: sshKey.name,
          sshKey: sshKey.publicKey,
        };
        const newSSHKeys = [...sshKeyList, newSshKey];
        onChange(newSSHKeys);
        setSelectedSSH('-');
      },
    };

    const { addSSHKey, isPending } = useAddSshKey(sshKeyMutationConfig);

    const onSubmit: SubmitHandler<OrderSshKey> = (data: OrderSshKey) => {
      if (selectedSSH === '-') {
        const sshKey: sshkey.SshKey = {
          name: data.name,
          publicKey: data.sshKey,
        };
        addSSHKey({
          projectId,
          sshKey,
        });
      } else {
        const newSSHKeys = [...sshKeyList, data];
        onChange(newSSHKeys);
        form.reset();
        setSelectedSSH('-');
      }
    };

    const removeSSHKey = (indexToRemove: number) => {
      const newSSHKeys = sshKeyList.filter(
        (_, index) => index !== indexToRemove,
      );
      onChange(newSSHKeys);
    };

    return (
      <Form {...form}>
        <div className="flex flex-row gap-2">
          {sshKeysSelectList.length > 1 && (
            <div className="w-full">
              <FormItem>
                <FormLabel data-testid="ssh-key-select-label">
                  {t('configuredKeyFieldLabel')}
                </FormLabel>
                <Select
                  value={selectedSSH}
                  onValueChange={(value) => {
                    setSelectedSSH(value);
                    if (value === '-') {
                      form.setValue('name', '');
                    } else {
                      form.setValue('name', value);
                    }
                    form.setValue(
                      'sshKey',
                      sshKeysSelectList.find((sshKey) => sshKey.name === value)
                        .publicKey,
                    );
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(sshKeysSelectList).map((sshKey) => (
                      <SelectItem key={sshKey.name} value={sshKey.name}>
                        {sshKey.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </div>
          )}
          <div className="w-full">
            <FormField
              control={form.control}
              name="name"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel data-testid="ssh-key-name-field-label">
                    {t('sshKeyFieldLabel')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={selectedSSH !== '-'}
                      data-testid="ssh-key-input-field"
                      {...field}
                      ref={ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="w-full">
            <FormField
              control={form.control}
              name="sshKey"
              defaultValue=""
              render={({ field }) => (
                <FormItem data-testid="ssh-key-value-field-label">
                  <FormLabel>{t('sskKeyValueFieldLabel')}</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="ssh-rsa AAAAB3..."
                      disabled={selectedSSH !== '-'}
                      className="w-full flex h-40 resize-none rounded-md border border-gray-100 bg-background px-3 py-2 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      data-testid="ssh-key-value-input-field"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            data-testid="ssh-key-label-add-button"
            variant={'ghost'}
            onClick={form.handleSubmit(onSubmit)}
            disabled={
              disabled ||
              isPending ||
              sshKeyList.length >= CONFIGURATION_CONFIG.maxSshKeyNumber
            }
            className="mt-[1.875rem] text-primary rounded-full p-2 ml-2 hover:text-primary"
          >
            <PlusCircle />
          </Button>
        </div>
        <ul>
          {sshKeyList.map((sshKey, index) => (
            <li key={sshKey.name} className="flex items-center">
              <Button
                data-testid={`ssh-key-label-remove-button-${index}`}
                className="text-red-500 rounded-full p-2 ml-2 hover:text-red-500 h-8 w-8"
                variant={'ghost'}
                type="button"
                onClick={() => removeSSHKey(index)}
                disabled={disabled}
              >
                <MinusCircle />
              </Button>
              <span>{sshKey.name}</span>
            </li>
          ))}
        </ul>
        <p data-testid="ssh-key-configured-labels">
          {t('numberOfConfiguredKeys', {
            count: sshKeyList.length,
            max: CONFIGURATION_CONFIG.maxSshKeyNumber,
            context: `${sshKeyList.length}`,
          })}
        </p>
      </Form>
    );
  },
);

SshKeyForm.displayName = 'SshKeysForm';

export default SshKeyForm;
