export const validateOrganizationName = (name: string) =>
  /^.{1,128}$/.test(name);

export const validateDescription = (description: string) =>
  /^.{1,256}$/.test(description);

export const validateQuantity = ({
  quantity,
  min,
  max,
}: {
  quantity: number;
  min: number;
  max: number;
}) => quantity >= min && quantity <= max;
