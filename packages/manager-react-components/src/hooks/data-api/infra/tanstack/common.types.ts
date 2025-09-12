export type CommonResult<TData = Record<string, string>, TError = Error> = {
  data: TData;
  error: TError | null;
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  status: string;
};

export type TRefetchInterval = number | false;
