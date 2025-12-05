declare const base: unique symbol;

declare const brand: unique symbol;

declare type Opaque<BaseType, BrandType = unknown> = BaseType & {
  readonly [base]: BaseType;
  readonly [brand]: BrandType;
};

declare type BrandType<OpaqueType extends Opaque<unknown>> = OpaqueType[typeof brand];

declare type BaseType<OpaqueType extends Opaque<unknown>> = OpaqueType[typeof Symbols.base];
