export const useTagsFilter = ({
  tags,
  displayInternalTags,
}: {
  tags: { [key: string]: string };
  displayInternalTags: boolean;
}) => {
  return Object.keys(tags)
    .filter((key) => displayInternalTags || key.indexOf('ovh:') !== 0)
    .map((key) => `${key}:${tags[key]}`);
};
