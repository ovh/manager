/**
 * Deferred object, implementing behavior similar to promises.
 * examples:
 *
 * // without initial value
 * const foo = new Deferred();
 * foo.isPending(); // true
 * foo.resolve('bar');
 * foo.isPending(); // false
 * foo.promise.then(x => ...) // x = 'bar'
 *
 * // with initial value
 * const hello = new Deferred('value');
 * hello.isPending(); // true
 * hello.resolve();
 * hello.promise.then(x => ...) // x = 'value'
 */
export type Callback = (...args: unknown[]) => unknown;
export type Resolve<T> = (value?: T | PromiseLike<T>) => Promise<T>;
export type VoidResolve<T> = (value?: T | PromiseLike<T>) => void;
export type Reject = (reason?: unknown) => void;

export interface CustomPromise<T>
  extends Omit<PromiseConstructor, 'resolve' | 'reject'> {
  promise: Promise<T>;
  isPending: () => boolean;
  resolve: Resolve<T>;
  reject: Reject;
}

export default class Deferred<T> {
  public result: T;
  public defer: CustomPromise<T>;
  isPending = false;

  constructor(result?: T) {
    this.result = result;
    this.defer = {} as CustomPromise<T>;
    this.defer.promise = this.resolver();
  }

  resolver = (): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      this.defer.resolve = (...args) => {
        this.isPending = false;
        if (this.result) {
          resolve(this.result);
        } else {
          resolve(...args);
        }
        return this.defer.promise;
      };
      this.defer.reject = (...args) => {
        this.isPending = false;
        reject.apply(...args);
        return this.defer.promise;
      };
      this.defer.isPending = () => this.isPending;
    });
}
