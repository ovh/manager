import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Copy, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import * as ai from '@/types/cloud/project/ai';
import { useTokenForm } from './tokensForm/useTokenForm.hook';
import {
  AddRenewMutateTokenProps,
  useAddToken,
} from '@/hooks/api/ai/token/useAddToken.hook';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useGetRegions } from '@/hooks/api/ai/capabilities/useGetRegions.hook';
import RouteModal from '@/components/route-modal/RouteModal';

const AddToken = () => {
  const [newTokenValue, setNewTokenValue] = useState<string>();
  const { projectId } = useParams();
  const regionsQuery = useGetRegions(projectId);
  const { form } = useTokenForm();
  const navigate = useNavigate();
  const { t } = useTranslation('pci-ai-dashboard/tokens');
  const { t: tRegions } = useTranslation('regions');
  const toast = useToast();

  const AddTokenMutationProps: AddRenewMutateTokenProps = {
    onError(err) {
      toast.toast({
        title: t(`formTokenToastErrorTitle`),
        variant: 'destructive',
        description: err.response.data.message,
      });
    },
    onAddEditSuccess(newToken) {
      form.reset();
      toast.toast({
        title: t('formTokenToastSuccessTitle'),
        description: t(`formTokenToastSuccessDescription`, {
          description: newToken.spec.name,
        }),
      });
      form.reset();
      setNewTokenValue(newToken.status.value);
    },
  };
  const { addToken, isPending } = useAddToken(AddTokenMutationProps);

  const onSubmit = form.handleSubmit((formValues) => {
    const tokenCreation: ai.token.TokenSpec = {
      name: formValues.name,
      region: formValues.region,
      role: formValues.role,
      labelSelector: formValues.label,
    };
    addToken({
      projectId,
      token: tokenCreation,
    });
  });

  const handleCopyPass = () => {
    navigator.clipboard.writeText(newTokenValue);
    toast.toast({
      title: t('formTokenCopy'),
    });
  };

  const handleClose = () => {
    setNewTokenValue(undefined);
    navigate('../');
  };

  return (
    <RouteModal backUrl="../" isLoading={!regionsQuery.isSuccess}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle data-testid="add-token-modal">
            {t(`formAddTokenTitle`)}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription />
        {newTokenValue ? (
          <div>
            <Alert variant="success">
              <p>{t('formTokenSuccess')}</p>
              <div className="relative my-2 rounded bg-gray-100">
                <Button
                  data-testid="token-copy-button"
                  onClick={() => handleCopyPass()}
                  className="absolute top-0 right-0 m-2 p-2 text-sm bg-primary-500 text-white rounded hover:bg-primary-700 transition duration-300"
                >
                  <Copy className="size-4" />
                  <span className="sr-only">copy</span>
                </Button>
                <pre className="p-4 bg-gray-100 rounded max-w-md overflow-auto">
                  <code>{newTokenValue}</code>
                </pre>
              </div>
            </Alert>
            <DialogFooter className="flex justify-end mt-4">
              <DialogClose asChild onClick={() => handleClose()}>
                <Button
                  data-testid="token-close-button"
                  type="button"
                  variant="outline"
                >
                  {t('formAddTokenButtonClose')}
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formAddTokenFieldNameLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="token-name-input"
                        placeholder={t('formAddTokenFieldNamePlaceholder')}
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-sm mt-2">
                <p>{t('formAddTokenFieldLabelDescription')}</p>
                <div className="flex flex-row gap-2 mt-2">
                  <p>{t('formAddTokenFieldLabelSample')}</p>
                  <Badge>{t('formAddTokenLabelBadge1')}</Badge>
                  <Badge>{t('formAddTokenLabelBadge2')}</Badge>
                  <Badge>{t('formAddTokenLabelBadge3')}</Badge>
                </div>
                <div className="flex flex-row gap-2 mt-2">
                  <p>{t('formAddTokenDefaultLabelsDescription')}</p>
                  <Badge>{t('formAddTokenDefaultLabelBadge1')}</Badge>
                  <Badge>{t('formAddTokenDefaultLabelBadge2')}</Badge>
                </div>
              </div>
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formAddTokenFieldLabelLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="token-label-input"
                        placeholder={t('formAddTokenFieldLabelPlaceholder')}
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center space-x-2">
                      <FormLabel>{t('formAddTokenFieldRoleLabel')}</FormLabel>
                      <Popover>
                        <PopoverTrigger>
                          <HelpCircle className="size-4" />
                        </PopoverTrigger>
                        <PopoverContent>
                          <p>{t('formAddTokenFieldRoleInfo')}</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(ai.TokenRoleEnum).map((option) => (
                            <SelectItem key={option} value={option}>
                              {t(option)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center space-x-2">
                      <FormLabel>{t('formAddTokenFieldRegionLabel')}</FormLabel>
                      <Popover>
                        <PopoverTrigger>
                          <HelpCircle className="size-4" />
                        </PopoverTrigger>
                        <PopoverContent>
                          <p>{t('formAddTokenFieldRegionInfo')}</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger data-testid="select-region-trigger">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {regionsQuery.data?.map((region) => (
                            <SelectItem key={region.id} value={region.id}>
                              {tRegions(`region_${region.id}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex justify-end mt-4">
                <DialogClose asChild>
                  <Button
                    data-testid="add-token-cancel-button"
                    type="button"
                    variant="outline"
                  >
                    {t('formAddTokenButtonCancel')}
                  </Button>
                </DialogClose>
                <Button
                  data-testid="add-token-submit-button"
                  type="submit"
                  disabled={isPending}
                >
                  {t(`formAddTokenButtonConfirm`)}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </RouteModal>
  );
};

export default AddToken;
