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

import * as binary from "./kernel/binary";
import * as bool from "./kernel/bool";
import * as data from "../data";
import * as int32 from "./kernel/int32";
import * as kernelString from "./kernel/string";
import * as list from "./kernel/list";
import * as maybe from "./kernel/maybe";
import * as result from "./kernel/result";
import * as ts from "js-ts-code-generator/distribution/newData";
import * as url from "./kernel/url";
import { identifer } from "js-ts-code-generator";

export const typeToTypeScriptType = (type_: data.Type): ts.Type => {
  switch (type_._) {
    case "Int32":
      return int32.type;

    case "String":
      return kernelString.type;

    case "Bool":
      return bool.type;

    case "Binary":
      return binary.type;

    case "Url":
      return url.type;

    case "List":
      return list.type(typeToTypeScriptType(type_.nType));

    case "Maybe":
      return maybe.type(typeToTypeScriptType(type_.nType));

    case "Result":
      return result.type(
        typeToTypeScriptType(type_.nOkAndErrorType.error),
        typeToTypeScriptType(type_.nOkAndErrorType.ok)
      );

    case "Id":
    case "Token":
      return ts.Type.ScopeInFile(identifer.fromString(type_.string));

    case "Custom": {
      if (type_.nNameAndTypeParameterList.parameterList.length === 0) {
        return ts.Type.ScopeInFile(
          identifer.fromString(type_.nNameAndTypeParameterList.name)
        );
      }
      return ts.Type.WithTypeParameter({
        type: ts.Type.ScopeInFile(
          identifer.fromString(type_.nNameAndTypeParameterList.name)
        ),
        typeParameterList: type_.nNameAndTypeParameterList.parameterList.map(
          typeToTypeScriptType
        ),
      });
    }

    case "Parameter":
      return ts.Type.ScopeInFile(identifer.fromString(type_.string));
  }
};

export const typeToMemberOrParameterName = (type_: data.Type): string => {
  return firstLowerCase(toTypeName(type_));
};

export const codecPropertyName = "codec";
export const encodePropertyName = "encode";
export const decodePropertyName = "decode";
export const resultProperty = "result";
export const nextIndexProperty = "nextIndex";

export const toTypeName = (type_: data.Type): string => {
  switch (type_._) {
    case "Int32":
      return "Int32";
    case "String":
      return "String";
    case "Bool":
      return "Bool";
    case "Binary":
      return "Binary";
    case "Url":
      return "Url";
    case "List":
      return toTypeName(type_.nType) + "List";
    case "Maybe":
      return toTypeName(type_.nType) + "Maybe";
    case "Result":
      return (
        toTypeName(type_.nOkAndErrorType.error) +
        toTypeName(type_.nOkAndErrorType.ok) +
        "Result"
      );
    case "Id":
    case "Token":
      return type_.string;
    case "Custom":
      return type_.nNameAndTypeParameterList.name;
    case "Parameter":
      return type_.string;
  }
};

export const isTagTypeAllNoParameter = (
  tagNameAndParameterArray: ReadonlyArray<data.NPattern>
): boolean =>
  tagNameAndParameterArray.every(
    (tagNameAndParameter) => tagNameAndParameter.parameter._ === "Nothing"
  );

export type IdAndTokenNameSet = {
  id: ReadonlySet<string>;
  token: ReadonlySet<string>;
};

export const collectIdOrTokenTypeNameSet = (
  typePartList: ReadonlyArray<data.TypePart>
): IdAndTokenNameSet =>
  flatIdAndTokenNameSetList(
    typePartList.map(collectIdOrTokenTypeNameSetInCustomType)
  );

const collectIdOrTokenTypeNameSetInCustomType = (
  typePart: data.TypePart
): IdAndTokenNameSet => {
  switch (typePart.body._) {
    case "Product":
      return flatIdAndTokenNameSetList(
        typePart.body.memberList.map((memberNameAndType) =>
          getIdAndTokenTypeNameInType(memberNameAndType.type)
        )
      );
    case "Sum":
      return collectIdOrTokenTypeNameSetInSum(typePart.body.patternList);
  }
};

const collectIdOrTokenTypeNameSetInSum = (
  tagNameAndParameterList: ReadonlyArray<data.Pattern>
): IdAndTokenNameSet => {
  const idSet: Set<string> = new Set();
  const tokenSet: Set<string> = new Set();
  for (const memberNameAndType of tagNameAndParameterList) {
    switch (memberNameAndType.parameter._) {
      case "Just": {
        const idAndTokenNameSet = getIdAndTokenTypeNameInType(
          memberNameAndType.parameter.value
        );
        for (const id of idAndTokenNameSet.id) {
          idSet.add(id);
        }
        for (const token of idAndTokenNameSet.token) {
          tokenSet.add(token);
        }
      }
    }
  }
  return {
    id: idSet,
    token: tokenSet,
  };
};

const getIdAndTokenTypeNameInType = (type_: data.Type): IdAndTokenNameSet => {
  switch (type_._) {
    case "Int32":
    case "String":
    case "Bool":
    case "Binary":
    case "Url":
    case "Parameter":
      return { id: new Set(), token: new Set() };
    case "Id":
      return { id: new Set([type_.string]), token: new Set() };
    case "Token":
      return { id: new Set(), token: new Set([type_.string]) };
    case "List":
    case "Maybe":
      return getIdAndTokenTypeNameInType(type_.nType);
    case "Result":
      return flatIdAndTokenNameSetList([
        getIdAndTokenTypeNameInType(type_.nOkAndErrorType.ok),
        getIdAndTokenTypeNameInType(type_.nOkAndErrorType.error),
      ]);
    case "Custom":
      return flatIdAndTokenNameSetList(
        type_.nNameAndTypeParameterList.parameterList.map(
          getIdAndTokenTypeNameInType
        )
      );
  }
};

const flatIdAndTokenNameSetList = (
  IdAndTokenNameSetList: ReadonlyArray<IdAndTokenNameSet>
): IdAndTokenNameSet => {
  const idSet: Set<string> = new Set();
  const tokenSet: Set<string> = new Set();
  for (const idAndToken of IdAndTokenNameSetList) {
    for (const id of idAndToken.id) {
      idSet.add(id);
    }
    for (const name of idAndToken.token) {
      tokenSet.add(name);
    }
  }
  return {
    id: idSet,
    token: tokenSet,
  };
};

export const firstUpperCase = (text: string): string =>
  text.substring(0, 1).toUpperCase() + text.substring(1);

export const firstLowerCase = (text: string): string =>
  text.substring(0, 1).toLowerCase() + text.substring(1);

export const isFirstUpperCaseName = (text: string): boolean => {
  if (text === "") {
    return false;
  }
  if (!"ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(text[0])) {
    return false;
  }
  for (const char of text.slice(1)) {
    if (
      !"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".includes(
        char
      )
    ) {
      return false;
    }
  }
  return true;
};

export const isFirstLowerCaseName = (text: string): boolean => {
  if (text === "") {
    return false;
  }
  if (!"abcdefghijklmnopqrstuvwxyz".includes(text[0])) {
    return false;
  }
  for (const char of text.slice(1)) {
    if (
      !"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".includes(
        char
      )
    ) {
      return false;
    }
  }
  return true;
};

export const definyCodeProjectId = "1e4531eba1d93cd9f9f31a8bc49551a2" as data.ProjectId;

export const codeSuggestionId = "009a2b68a9239b0bf1f541d8b88582dd" as data.SuggestionId;

/** エディタ上で型の名前を作る. 先頭は小文字だがエディタ上は大文字 */
export const stringToTypePartName = (text: string): string | undefined => {
  const normalizedText = text.normalize("NFKC");
  let isBeforeSpace = false;
  let isFirstChar = true;
  let result = "";
  for (const char of normalizedText) {
    if (isFirstChar) {
      if (/^[a-zA-Z]$/u.test(char)) {
        result += char.toLowerCase();
        isFirstChar = false;
      }
    } else if (/^[a-zA-Z0-9]$/u.test(char)) {
      result += isBeforeSpace ? char.toUpperCase() : char;
      isBeforeSpace = false;
    } else {
      isBeforeSpace = true;
    }
  }
  return result.slice(0, 64);
};

/** サーバー上での型の名前のバリテーション */
export const isValidTypePartName = (text: string): boolean => {
  return /^[a-z][a-zA-Z0-9]*$/u.test(text) && text.length <= 64;
};
