declare type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object | undefined // eslint-disable-line @typescript-eslint/ban-types
    ? RecursivePartial<T[P]>
    : T[P];
};
