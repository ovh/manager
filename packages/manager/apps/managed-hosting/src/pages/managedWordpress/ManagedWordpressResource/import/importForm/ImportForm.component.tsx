import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Message, SPINNER_SIZE, Spinner, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { useNotifications } from '@ovh-ux/muk';

import {
  postManagedCmsResourceWebsite,
  putManagedCmsResourceWebsiteTasks,
} from '@/data/api/managedWordpress';
import { useManagedWordpressWebsiteDetails } from '@/data/hooks/managedWordpress/managedWordpressWebsiteDetails/useManagedWordpressWebsiteDetails';
import { CmsType } from '@/data/types/product/managedWordpress/cms';
import { PostImportTaskPayload } from '@/data/types/product/managedWordpress/tasks';
import { useGenerateUrl } from '@/hooks/generateUrl/useGenerateUrl';
import { zForm } from '@/utils/formSchemas.utils';

import Step1, { Step1FormValues } from './ImportFormSteps/Step1';
import Step2 from './ImportFormSteps/Step2';
import { Step2FormValues } from './ImportFormSteps/types';

interface ImportFormLocationState {
  websiteId?: string;
  step?: number;
}
export default function ImportForm() {
  const { t } = useTranslation([NAMESPACES.FORM, NAMESPACES.ERROR, 'common', 'managedWordpress']);
  const { serviceName } = useParams();
  const { state } = useLocation() as {
    state: ImportFormLocationState;
  };
  const [websiteId, setWebsiteId] = useState<string | null>(state?.websiteId ?? null);
  const [step, setStep] = useState<number>(state?.step ?? 1);
  const { addError, addSuccess } = useNotifications();

  // form control for step 1
  const {
    control,
    handleSubmit,
    formState: { isValid, errors, isDirty },
  } = useForm<Step1FormValues>({
    defaultValues: {
      adminLogin: '',
      adminPassword: '',
      adminURL: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(zForm(t).ADD_SITE_FORM_SCHEMA),
  });

  const { data, refetch } = useManagedWordpressWebsiteDetails(serviceName, websiteId);
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = useCallback(() => navigate(goBackUrl), [navigate, goBackUrl]);
  useEffect(() => {
    if (!websiteId || step === 2) return;

    let attempts = 0;
    const maxAttempts = 6;

    const interval = setInterval(() => {
      attempts += 1;

      void (async () => {
        const { data: refreshed } = await refetch();
        const hasImportData = !!refreshed?.currentState.import;
        if (hasImportData) {
          clearInterval(interval);
          setStep(2);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          addError(
            <Text>{t('managedWordpress:web_hosting_managed_wordpress_import_timeout')}</Text>,
            true,
          );
          onClose();
        }
      })();
    }, 5000);

    return () => clearInterval(interval);
  }, [websiteId, step, refetch, addError, onClose, t]);

  const { mutate: createWebsite, isPending: isSubmittingStep1 } = useMutation({
    mutationFn: async ({
      adminLogin,
      adminPassword,
      adminURL,
    }: {
      adminLogin: string;
      adminPassword: string;
      adminURL: string;
    }) => {
      return postManagedCmsResourceWebsite(serviceName, {
        targetSpec: {
          import: {
            adminLogin,
            adminPassword,
            adminURL,
            cms: CmsType.WORDPRESS,
          },
        },
      });
    },
    onSuccess: (response: { id?: string } | void) => {
      if (response && typeof response === 'object' && 'id' in response && response.id) {
        setWebsiteId(response.id);
      }
    },

    onError: (error: ApiError) => {
      addError(
        <Text>
          {t(`${NAMESPACES.ERROR}:error_message`, {
            message: error?.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
  });

  const onStep1Submit: SubmitHandler<Step1FormValues> = ({
    adminLogin,
    adminPassword,
    adminURL,
  }) => {
    createWebsite({ adminLogin, adminPassword, adminURL });
  };

  // form control for step 2
  const defaultValuesStep2 = useMemo<Step2FormValues | null>(() => {
    const wordpressData = data?.currentState?.import?.checkResult?.cmsSpecific?.wordpress;

    if (!wordpressData) {
      return null;
    }

    const plugins = wordpressData.plugins.map((plugin) => ({
      name: plugin.name,
      version: plugin.version,
      enabled: true,
    }));
    const themes = wordpressData.themes.map((theme) => ({
      name: theme.name,
      version: theme.version,
      active: true,
    }));
    return {
      plugins,
      themes,
      media: false,
      wholeDatabase: true,
      posts: false,
      pages: false,
      comments: false,
      tags: false,
      users: false,
    };
  }, [data]);

  const step2Form = useForm<Step2FormValues>({
    defaultValues: defaultValuesStep2 ?? {
      plugins: [],
      themes: [],
      media: true,
      wholeDatabase: true,
      posts: false,
      pages: false,
      comments: false,
      tags: false,
      users: false,
    },
    mode: 'onChange',
  });

  const taskId = data?.currentTasks?.[0]?.id;

  useEffect(() => {
    const wordpressData = data?.currentState?.import?.checkResult?.cmsSpecific?.wordpress;

    if (wordpressData) {
      step2Form.reset({
        plugins: wordpressData.plugins.map((plugin) => ({
          name: plugin.name,
          version: plugin.version,
          enabled: true,
        })),
        themes: wordpressData.themes.map((theme) => ({
          name: theme.name,
          version: theme.version,
          active: true,
        })),
        media: true,
        wholeDatabase: true,
        posts: false,
        pages: false,
        comments: false,
        tags: false,
        users: false,
      });
    }
  }, [data, step2Form]);
  const {
    handleSubmit: handleSubmitStep2,
    formState: { isValid: isValidStep2 },
  } = step2Form;

  const { mutate: launchImport, isPending: isSubmittingStep2 } = useMutation({
    mutationFn: async (values: Step2FormValues) => {
      const inputs: PostImportTaskPayload = {
        inputs: {
          'import.cmsSpecific.wordpress.selection': {
            plugins: values.plugins,
            themes: values.themes,
            wholeDatabase: values.wholeDatabase,
            media: values.media,
            posts: values.posts,
            pages: values.pages,
            comments: values.comments,
            tags: values.tags,
            users: values.users,
          },
        },
      };
      return putManagedCmsResourceWebsiteTasks(serviceName, inputs, taskId);
    },
    onSuccess: () => {
      addSuccess(
        <div>
          <span className="block font-bold">
            {t('managedWordpress:web_hosting_managed_wordpress_import_success_message_part_1')}
          </span>
          <Text preset={TEXT_PRESET.paragraph} className="block">
            {t('managedWordpress:web_hosting_managed_wordpress_import_success_message_part_2')}
          </Text>
        </div>,
        true,
      );
      queryClient
        .invalidateQueries({
          queryKey: ['managedWordpressWebsiteDetails', serviceName, websiteId],
        })
        .catch(console.error);
    },
    onError: (error: ApiError) => {
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t(`${NAMESPACES.ERROR}:error_message`, {
            message: error?.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
    onSettled: () => {
      onClose();
    },
  });
  const onStep2Submit: SubmitHandler<Step2FormValues> = (values) => {
    launchImport(values);
  };
  return (
    <>
      {step === 1 && !websiteId && (
        <Step1
          t={t}
          control={control}
          errors={errors}
          isDirty={isDirty}
          isValid={isValid}
          isSubmitting={isSubmittingStep1}
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit(onStep1Submit)(e);
          }}
        />
      )}

      {websiteId && step === 1 && (
        <>
          <Message dismissible={false} className="w-full">
            {t('managedWordpress:web_hosting_managed_wordpress_import_before_select_element')}
            <Spinner size={SPINNER_SIZE.sm} className="ml-auto inline-block" />
          </Message>
        </>
      )}
      {step === 2 && websiteId && (
        <Step2
          t={t}
          step2Form={step2Form}
          data={data}
          isValid={isValidStep2}
          isSubmitting={isSubmittingStep2}
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmitStep2(onStep2Submit)(e);
          }}
        />
      )}
    </>
  );
}
