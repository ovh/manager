import { useIamResource } from '@/data/hooks/iam/useIamResource.hook';

export const useIamResourceTags = (
  resourceURN: string,
  tagKeys: string[],
) => {
  const { data, isLoading, isFetching, error, isSuccess } = useIamResource(
    resourceURN,
  );

  const resource = data?.[0];

  const tags = tagKeys.reduce<Record<string, string | undefined>>(
    (acc, key) => {
      acc[key] = resource?.tags?.[key];
      return acc;
    },
    {},
  );

  const allTagsMissing =
    isSuccess && tagKeys.every((key) => tags[key] === undefined);

  return {
    data: tags,
    resource,
    isLoading: isLoading || isFetching,
    isSuccess: isSuccess && !allTagsMissing,
    isError: !!error || allTagsMissing,
    error:
      error ??
      (allTagsMissing
        ? new Error(
            `Tags "${tagKeys.join(
              ', ',
            )}" not found in IAM resource tags for URN "${resourceURN}".`,
          )
        : null),
  };
};

