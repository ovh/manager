export const filterTags = ({
  tags,
  displayInternalTags,
}: {
  tags: { [key: string]: string };
  displayInternalTags: boolean;
}): string[] =>
  Object.keys(tags).reduce((accumulator: string[], key: string) => {
    if (displayInternalTags || !key.startsWith('ovh:')) {
      accumulator.push(`${key}:${tags[key]}`);
    }
    return accumulator;
  }, []);
