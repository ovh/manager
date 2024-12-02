export type TParam<T> = {
  fn: () => Promise<T>;
  ruleFn: (value: T) => boolean;
  maxTries?: number;
  interval?: number;
  onSuccess?: ({ value, iteration }: { value: T; iteration: number }) => void;
  onFail?: (iteration: number, cause: Error) => void;
};

export const poll = async <T>(param: TParam<T>, iteration = 0) => {
  const [maxTries, interval] = [param.maxTries || 10, param.interval || 5000];
  if (iteration < maxTries) {
    const value: T = await param.fn();
    try {
      if (param.ruleFn(value)) {
        param?.onSuccess({ value, iteration });
      } else {
        setTimeout(() => poll(param, iteration + 1), interval);
      }
    } catch (e) {
      param?.onFail(iteration, e);
    }
  } else {
    param?.onFail(iteration, null);
  }
};

export const downloadContent = ({
  fileContent,
  fileName,
  downloadType,
}: {
  fileContent: string;
  fileName: string;
  downloadType: string;
}) => {
  const blob = new Blob([fileContent], { type: downloadType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};
