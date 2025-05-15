export const useTagsFilter = ({
  tags,
  displayInternalTags,
}: {
  tags: { [key: string]: string };
  displayInternalTags: boolean;
}) => {
  return Object.keys(tags)
    .filter((key) => displayInternalTags || key !== 'ovh')
    .map((key) => `${key}:${tags[key]}`);
};
