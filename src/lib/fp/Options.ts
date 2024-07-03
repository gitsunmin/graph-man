import { match } from "ts-pattern";

type None = {
  __tag: "None";
};

type Some<T> = {
  value: T;
  __tag: "Some";
};

export type Option<T> = None | Some<T>;

const PATTERN = {
  NONE: { __tag: "None" } as const,
  SOME: { __tag: "Some" } as const,
};

export const O = {
  ...PATTERN,
  Some: <T>(value: T): Option<T> => ({
    value,
    __tag: value == null ? "None" : "Some",
  }),
  None: <T>(): Option<T> => ({ __tag: "None" }),

  map: <T, R>(option: Option<T>, fn: (value: T) => R): Option<R> =>
    match(option)
      .returnType<Option<R>>()
      .with(PATTERN.NONE, O.None)
      .with(PATTERN.SOME, ({ value }) => O.Some(fn(value)))
      .exhaustive(),

  flatMap: <T, R>(option: Option<T>, fn: (value: T) => Option<R>) =>
    match(option)
      .returnType<Option<R>>()
      .with(PATTERN.NONE, O.None)
      .with(PATTERN.SOME, ({ value }) => fn(value))
      .exhaustive(),

  isSome: <T>(option: Option<T>): option is Some<T> => option.__tag === "Some",

  isNone: <T>(option: Option<T>): option is None => option.__tag === "None",

  getOrElse: <T>(option: Option<T>, defaultValue: T): T =>
    O.isSome(option) ? option.value : defaultValue,

  fold: <T, R>(
    option: Option<T>,
    ifNone: () => R,
    ifSome: (value: T) => R,
  ): R => (O.isSome(option) ? ifSome(option.value) : ifNone()),
};
