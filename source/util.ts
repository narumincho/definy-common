import * as data from "./data";

export const maybeMap = <Input, Output>(
  maybe: data.Maybe<Input>,
  func: (input: Input) => Output
): data.Maybe<Output> => {
  switch (maybe._) {
    case "Just":
      return data.maybeJust(func(maybe.value));
    case "Nothing":
      return data.maybeNothing();
  }
};

export const maybeWithDefault = <T>(
  maybe: data.Maybe<T>,
  defaultValue: T
): T => {
  switch (maybe._) {
    case "Just":
      return maybe.value;
    case "Nothing":
      return defaultValue;
  }
};

export const maybeUnwrap = <T, U>(
  maybe: data.Maybe<T>,
  func: (t: T) => U,
  defaultValue: U
): U => {
  switch (maybe._) {
    case "Just":
      return func(maybe.value);
    case "Nothing":
      return defaultValue;
  }
};
