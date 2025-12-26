import { useContext } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Clipboard,
  ClipboardControl,
  ClipboardTrigger,
  FormField,
  FormFieldError,
  FormFieldLabel,
  ICON_NAME,
  INPUT_TYPE,
  Input,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Link, LinkType, useNotifications } from '@ovh-ux/muk';

import {
  EXAMPLE_BRANCHES_NAMES,
  EXAMPLE_HTTPS_REPOSITORY_URL,
  EXAMPLE_SSH_REPOSITORY_URL,
  GITHUB_VCS,
  GIT_ASSOCIATION_GUIDE_LINK,
  GIT_WEBHOOK_GUIDE_LINK,
  REPOSITORY_PLACEHOLDER,
} from '@/constants';
import {
  useGetVcsWebhookUrls,
  usePostWebsiteV6,
} from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { zForm } from '@/utils/formSchemas.utils';

export default function AssociateGitPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('multisite');
  const { serviceName, path } = useParams();
  const { addSuccess, addWarning } = useNotifications();
  const { data } = useGetVcsWebhookUrls(serviceName, path, GITHUB_VCS);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const gitAssociationGuideLink =
    GIT_ASSOCIATION_GUIDE_LINK[ovhSubsidiary as keyof typeof GIT_ASSOCIATION_GUIDE_LINK] ??
    GIT_ASSOCIATION_GUIDE_LINK.DEFAULT;

  const gitWebhookGuideLink =
    GIT_WEBHOOK_GUIDE_LINK[ovhSubsidiary as keyof typeof GIT_WEBHOOK_GUIDE_LINK] ??
    GIT_WEBHOOK_GUIDE_LINK.DEFAULT;

  const {
    control,
    handleSubmit,
    formState: { isValid, errors, isDirty },
  } = useForm({
    defaultValues: {
      repositoryUrl: '',
      branch: '',
    },
    resolver: zodResolver(zForm(t).GIT_ASSOCIATION_FORM_SCHEMA),
  });

  const { postWebsiteV6 } = usePostWebsiteV6(
    serviceName,
    () => {
      addSuccess(
        <>
          <Text className="mr-3">{t('multisite_git_association_success_message')}</Text>
          <Link href={`#/${serviceName}/task`}>{t('multisite_add_website_in_progress')}</Link>
        </>,
        true,
      );
    },
    (error) => {
      addWarning(
        t('multisite_git_association_error_message', {
          error: error?.response?.data?.message,
        }),
        true,
      );
    },
  );

  const onSubmit = (formData: { repositoryUrl: string; branch: string }) => {
    void postWebsiteV6({
      path,
      vcsUrl: formData.repositoryUrl,
      vcsBranch: formData.branch,
    });
    navigate(-1);
  };

  return (
    <form className="flex flex-col space-y-6">
      <Link type={LinkType.back} onClick={() => navigate(-1)} className="mb-4">
        {t('multisite:multisite_button_go_back')}
      </Link>
      <Text preset={TEXT_PRESET.heading1}>
        {t('multisite:multisite_git_association_title', { path })}
      </Text>
      <Text preset={TEXT_PRESET.span}>
        {t('multisite:multisite_git_association_configure_description')}
      </Text>
      <Text preset={TEXT_PRESET.heading2}>
        {t('multisite:multisite_git_association_configure')}
      </Text>
      <Message color={MESSAGE_COLOR.information} dismissible={false}>
        <MessageIcon name={ICON_NAME.circleInfo} />
        <MessageBody>
          <div className="flex flex-col space-y-2">
            <Text preset={TEXT_PRESET.heading5}>
              {t('multisite:multisite_git_association_configure_info_title')}
            </Text>
            <ul className="mt-0">
              <li>
                <Text preset={TEXT_PRESET.span}>
                  {t('multisite:multisite_git_association_configure_info_description')}
                </Text>
              </li>
              <li>
                <Text preset={TEXT_PRESET.span}>
                  {t('multisite:multisite_git_association_configure_info_https')}
                </Text>
              </li>
              <li>
                <Text preset={TEXT_PRESET.span}>
                  {t('multisite:multisite_git_association_configure_info_ssh')}
                </Text>
              </li>
            </ul>
            <Text preset={TEXT_PRESET.heading6}>
              {t('multisite:multisite_git_association_configure_info_empty_repo')}
            </Text>
            <Text preset={TEXT_PRESET.span}>
              {t('multisite:multisite_git_association_configure_info_not_empty_repo')}
            </Text>
            <Text preset={TEXT_PRESET.heading6}>
              {t('multisite:multisite_git_association_configure_info_add_in_parameters')}
            </Text>
          </div>
        </MessageBody>
      </Message>
      <div className="w-1/3">
        <Controller
          name="repositoryUrl"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormField className="mb-4 w-full" invalid={!!error && invalid}>
              <FormFieldLabel>{t('multisite:multisite_git_association_repository')}</FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                invalid={!!errors.repositoryUrl || !!error}
                className="w-full"
                name="repository"
                {...field}
                placeholder={REPOSITORY_PLACEHOLDER}
              />
              <FormFieldError>{errors?.repositoryUrl?.message}</FormFieldError>
            </FormField>
          )}
        />
        <Text preset={TEXT_PRESET.caption}>
          {t('multisite:multisite_git_association_ssh_url_repo_help', {
            httpsRepo: EXAMPLE_HTTPS_REPOSITORY_URL,
            sshRepo: EXAMPLE_SSH_REPOSITORY_URL,
          })}
        </Text>
      </div>

      <div className="w-1/3">
        <Controller
          name="branch"
          control={control}
          render={({ field }) => (
            <FormField className="mb-4 w-full">
              <FormFieldLabel>{t('multisite:multisite_git_association_branch')}</FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                className="w-full"
                name="branch"
                {...field}
                placeholder={t('multisite:multisite_git_association_branch')}
              />
            </FormField>
          )}
        />
        <Text preset={TEXT_PRESET.caption}>
          {t('multisite:multisite_git_association_ssh_branches_names', {
            branchesNames: EXAMPLE_BRANCHES_NAMES,
          })}
        </Text>
      </div>

      <Text preset={TEXT_PRESET.heading2}>
        {t('multisite:multisite_git_association_configure_auto')}
      </Text>
      <Text preset={TEXT_PRESET.span}>
        {t('multisite:multisite_git_association_webhook_description')}
      </Text>
      <div className="w-1/3">
        <FormField className="mb-4 w-full">
          <FormFieldLabel>{t('multisite:multisite_git_association_webhook_url')}</FormFieldLabel>
          <Clipboard value={data?.push || ''} className="w-full">
            <ClipboardControl />
            <ClipboardTrigger />
          </Clipboard>
        </FormField>
      </div>
      <div className="flex flex-col">
        <Link href={gitWebhookGuideLink} target="_blank" type={LinkType.external}>
          {t('multisite:multisite_git_association_guide_configure_webhook')}
        </Link>
        <Link href={gitAssociationGuideLink} target="_blank" type={LinkType.external}>
          {t('multisite:multisite_git_association_guide_configure_tutorial')}
        </Link>
      </div>
      <div className="pt-5">
        <Button onClick={() => void handleSubmit(onSubmit)()} disabled={!isDirty || !isValid}>
          {t('multisite:multisite_git_association_apply_configuration')}
        </Button>
      </div>
    </form>
  );
}
