import { Maybe, Result, Time } from "./data";

export const maybeMap = <Input, Output>(
  maybe: Maybe<Input>,
  func: (input: Input) => Output
): Maybe<Output> => {
  switch (maybe._) {
    case "Just":
      return Maybe.Just(func(maybe.value));
    case "Nothing":
      return Maybe.Nothing();
  }
};

export const maybeWithDefault = <T>(maybe: Maybe<T>, defaultValue: T): T => {
  switch (maybe._) {
    case "Just":
      return maybe.value;
    case "Nothing":
      return defaultValue;
  }
};

export const maybeUnwrap = <T, U>(
  maybe: Maybe<T>,
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

export const maybeAndThen = <T, U>(
  maybe: Maybe<T>,
  func: (t: T) => Maybe<U>
): Maybe<U> => {
  switch (maybe._) {
    case "Just":
      return func(maybe.value);
    case "Nothing":
      return Maybe.Nothing();
  }
};

export const resultMap = <InputOk, InputError, OutputOk, OutputError>(
  result: Result<InputOk, InputError>,
  okFunc: (input: InputOk) => OutputOk,
  errorFunc: (input: InputError) => OutputError
): Result<OutputOk, OutputError> => {
  switch (result._) {
    case "Ok":
      return Result.Ok(okFunc(result.ok));
    case "Error":
      return Result.Error(errorFunc(result.error));
  }
};

export const resultMapOk = <InputOk, OutputOk, Error>(
  result: Result<InputOk, Error>,
  func: (input: InputOk) => OutputOk
): Result<OutputOk, Error> => {
  switch (result._) {
    case "Ok":
      return Result.Ok(func(result.ok));
    case "Error":
      return result;
  }
};

export const resultMapError = <Ok, InputError, OutputError>(
  result: Result<Ok, InputError>,
  func: (input: InputError) => OutputError
): Result<Ok, OutputError> => {
  switch (result._) {
    case "Ok":
      return result;
    case "Error":
      return Result.Error(func(result.error));
  }
};

export const resultWithDefault = <Ok, Error>(
  result: Result<Ok, Error>,
  defaultValue: Ok
): Ok => {
  switch (result._) {
    case "Ok":
      return result.ok;
    case "Error":
      return defaultValue;
  }
};

export const resultToMaybe = <Ok, Error>(
  result: Result<Ok, Error>
): Maybe<Ok> => {
  switch (result._) {
    case "Ok":
      return Maybe.Just(result.ok);
    case "Error":
      return Maybe.Nothing();
  }
};

export const resultFromMaybe = <Ok, Error>(
  maybe: Maybe<Ok>,
  error: Error
): Result<Ok, Error> => {
  switch (maybe._) {
    case "Just":
      return Result.Ok(maybe.value);
    case "Nothing":
      return Result.Error(error);
  }
};

const millisecondInDay = 1000 * 60 * 60 * 24;

export const timeToDate = (dateTime: Time): Date =>
  new Date(dateTime.day * millisecondInDay + dateTime.millisecond);

export const timeFromDate = (date: Date): Time => {
  const millisecond = date.getTime();
  return {
    day: Math.floor(millisecond / millisecondInDay),
    millisecond: millisecond % millisecondInDay,
  };
};
