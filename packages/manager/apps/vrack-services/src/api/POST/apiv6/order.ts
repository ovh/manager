export const orderVrackServicesQueryKey = ['order-vrack-services'];

export const orderVrackServices = ({
  displayName,
  selectedZone,
}: {
  displayName: string;
  selectedZone: string;
}) => () =>
  new Promise<string>((resolve) => {
    console.log({ displayName, selectedZone });
    setTimeout(() => resolve('test'), 5000);
    // To test error
    // setTimeout(() => resolve(), 5000);
  });
