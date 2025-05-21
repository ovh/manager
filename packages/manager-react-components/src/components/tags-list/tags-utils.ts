export const calculateAuthorizedTags = (
  tagRefs: HTMLOdsBadgeElement[],
  containerRef: HTMLDivElement,
  lineNumber: number,
): number => {
  if (!containerRef) return undefined;
  const containerWidth = containerRef.offsetWidth;
  const containerHeight = containerRef.offsetHeight;
  const tagHeight = tagRefs[0] ? tagRefs[0].offsetHeight + 4 : 30;
  const maxLine = lineNumber || Math.ceil(containerHeight / tagHeight);
  const maxCounter = maxLine * containerWidth;
  let usedWidth = 0;
  let count = 0;

  tagRefs.forEach((tag) => {
    if (!tag) return;
    const tagWidth = tag.getBoundingClientRect().width;
    if (usedWidth + tagWidth > maxCounter - 50) return;
    usedWidth += tagWidth;
    count += 1;
  });
  return count;
};

export const truncateTag = (
  container: HTMLDivElement,
  firstTag: HTMLOdsBadgeElement,
  tagText: string,
): string => {
  const containerWidth = container.offsetWidth;
  const availableSpace = Math.ceil(
    ((containerWidth - 50) * 100) / firstTag.getBoundingClientRect().width,
  );
  const length = Math.floor(tagText.length * (availableSpace / 100));
  return tagText.slice(0, length) + (length < tagText.length ? '...' : '');
};

export const filterTags = ({
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
