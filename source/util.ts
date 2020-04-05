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

export const maybeAndThen = <T, U>(
  maybe: data.Maybe<T>,
  func: (t: T) => data.Maybe<U>
): data.Maybe<U> => {
  switch (maybe._) {
    case "Just":
      return func(maybe.value);
    case "Nothing":
      return data.maybeNothing();
  }
};

export const resultMap = <InputOk, InputError, OutputOk, OutputError>(
  result: data.Result<InputOk, InputError>,
  okFunc: (input: InputOk) => OutputOk,
  errorFunc: (input: InputError) => OutputError
): data.Result<OutputOk, OutputError> => {
  switch (result._) {
    case "Ok":
      return data.resultOk(okFunc(result.ok));
    case "Error":
      return data.resultError(errorFunc(result.error));
  }
};

export const resultMapOk = <InputOk, OutputOk, Error>(
  result: data.Result<InputOk, Error>,
  func: (input: InputOk) => OutputOk
): data.Result<OutputOk, Error> => {
  switch (result._) {
    case "Ok":
      return data.resultOk(func(result.ok));
    case "Error":
      return result;
  }
};

export const resultMapError = <Ok, InputError, OutputError>(
  result: data.Result<Ok, InputError>,
  func: (input: InputError) => OutputError
): data.Result<Ok, OutputError> => {
  switch (result._) {
    case "Ok":
      return result;
    case "Error":
      return data.resultError(func(result.error));
  }
};

export const resultWithDefault = <Ok, Error>(
  result: data.Result<Ok, Error>,
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
  result: data.Result<Ok, Error>
): data.Maybe<Ok> => {
  switch (result._) {
    case "Ok":
      return data.maybeJust(result.ok);
    case "Error":
      return data.maybeNothing();
  }
};

export const resultFromMaybe = <Ok, Error>(
  maybe: data.Maybe<Ok>,
  error: Error
): data.Result<Ok, Error> => {
  switch (maybe._) {
    case "Just":
      return data.resultOk(maybe.value);
    case "Nothing":
      return data.resultError(error);
  }
};

export const dateTimeToDate = (dateTime: data.DateTime): Date =>
  new Date(
    Date.UTC(
      dateTime.year - 10000,
      dateTime.month - 1,
      dateTime.day,
      dateTime.hour,
      dateTime.minute,
      dateTime.second
    )
  );

export const dateTimeFromDate = (date: Date): data.DateTime => ({
  year: 10000 + date.getUTCFullYear(),
  month: 1 + date.getUTCMonth(),
  day: date.getUTCDate(),
  hour: date.getUTCHours(),
  minute: date.getUTCMinutes(),
  second: date.getUTCSeconds(),
});
