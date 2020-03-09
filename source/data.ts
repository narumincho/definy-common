import * as a from "util";
/**
 * Maybe
 */
export type Maybe<T> = { _: "Just"; value: T } | { _: "Nothing" };

/**
 * Result
 */
export type Result<ok, error> =
  | { _: "Ok"; ok: ok }
  | { _: "Error"; error: error };

/**
 * デバッグの状態と, デバッグ時ならアクセスしているポート番号
 */
export type ClientMode = { _: "DebugMode"; int32: number } | { _: "Release" };

/**
 * ログインのURLを発行するために必要なデータ
 */
export type RequestLogInUrlRequestData = {
  openIdConnectProvider: OpenIdConnectProvider;
  urlData: UrlData;
};

/**
 * プロバイダー (例: LINE, Google, GitHub)
 */
export type OpenIdConnectProvider = "Google" | "GitHub" | "Line";

/**
 * デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語のを入れて,言語ごとに別のURLである必要がある. デバッグ時には http://localhost:2520 のオリジンになってしまう
 */
export type UrlData = {
  clientMode: ClientMode;
  location: Location;
  language: Language;
  accessToken: Maybe<AccessToken>;
};

/**
 * 英語,日本語,エスペラント語などの言語
 */
export type Language = "Japanese" | "English" | "Esperanto";

/**
 * DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる
 */
export type Location =
  | { _: "Home" }
  | { _: "User"; userId: UserId }
  | { _: "Project"; projectId: ProjectId };

export type AccessToken = string & { _accessToken: never };

export type UserId = string & { _userId: never };

export type ProjectId = string & { _projectId: never };

/**
 *
 *
 */
export const maybeJust = <T>(value: T): Maybe<T> => ({
  _: "Just",
  value: value
});

/**
 *
 *
 */
export const maybeNothing = <T>(): Maybe<T> => ({ _: "Nothing" });

/**
 *
 *
 */
export const resultOk = <ok, error>(ok: ok): Result<ok, error> => ({
  _: "Ok",
  ok: ok
});

/**
 *
 *
 */
export const resultError = <ok, error>(error: error): Result<ok, error> => ({
  _: "Error",
  error: error
});

/**
 * デバッグモード. ポート番号を保持する. オリジンは http://localhost:2520 のようなもの
 *
 */
export const clientModeDebugMode = (int32: number): ClientMode => ({
  _: "DebugMode",
  int32: int32
});

/**
 * リリースモード. https://definy.app
 */
export const clientModeRelease: ClientMode = { _: "Release" };

/**
 * 最初のページ
 */
export const locationHome: Location = { _: "Home" };

/**
 * ユーザーの詳細ページ
 *
 */
export const locationUser = (userId: UserId): Location => ({
  _: "User",
  userId: userId
});

/**
 * プロジェクトの詳細ページ
 *
 */
export const locationProject = (projectId: ProjectId): Location => ({
  _: "Project",
  projectId: projectId
});

/**
 * numberの32bit符号あり整数をSigned Leb128のバイナリに変換する
 *
 */
export const encodeInt32 = (value: number): ReadonlyArray<number> => {
  value |= 0;
  const result: Array<number> = [];
  while (true) {
    const byte: number = value & 127;
    value >>= 7;
    if (
      (value === 0 && (byte & 64) === 0) ||
      (value === -1 && (byte & 4) !== 0)
    ) {
      result.push(byte);
      return result;
    }
    result.push(byte | 128);
  }
};

/**
 * stringからバイナリに変換する.
 *
 */
export const encodeString = (text: string): ReadonlyArray<number> =>
  Array["from"](
    new (process === undefined || process.title === "browser"
      ? TextEncoder
      : a.TextEncoder)().encode(text)
  );

/**
 * boolからバイナリに変換する
 *
 */
export const encodeBool = (value: boolean): ReadonlyArray<number> => [
  value ? 1 : 0
];

/**
 *
 *
 */
export const encodeList = <T>(
  encodeFunction: (a: T) => ReadonlyArray<number>
): ((a: ReadonlyArray<T>) => ReadonlyArray<number>) => (
  list: ReadonlyArray<T>
): ReadonlyArray<number> => {
  let result: Array<number> = [];
  for (const element of list) {
    result = result.concat(encodeFunction(element));
  }
  return result;
};

/**
 *
 *
 */
export const encodeMaybe = <T>(
  encodeFunction: (a: T) => ReadonlyArray<number>
): ((a: Maybe<T>) => ReadonlyArray<number>) => (
  maybe: Maybe<T>
): ReadonlyArray<number> => {
  switch (maybe._) {
    case "Just": {
      return [0].concat(encodeFunction(maybe.value));
    }
    case "Nothing": {
      return [1];
    }
  }
};

/**
 *
 *
 */
export const encodeResult = <ok, error>(
  okEncodeFunction: (a: ok) => ReadonlyArray<number>,
  errorEncodeFunction: (a: error) => ReadonlyArray<number>
): ((a: Result<ok, error>) => ReadonlyArray<number>) => (
  result: Result<ok, error>
): ReadonlyArray<number> => {
  switch (result._) {
    case "Ok": {
      return [0].concat(okEncodeFunction(result.ok));
    }
    case "Error": {
      return [1].concat(errorEncodeFunction(result.error));
    }
  }
};

/**
 *
 *
 */
export const encodeId = (id: string): ReadonlyArray<number> => {
  const result: Array<number> = [];
  for (let i = 0; i < 16; i += 1) {
    result[i] = Number.parseInt(id.slice(i * 2, i * 2 + 2), 16);
  }
  return result;
};

/**
 *
 *
 */
export const encodeHashOrAccessToken = (id: string): ReadonlyArray<number> => {
  const result: Array<number> = [];
  for (let i = 0; i < 32; i += 1) {
    result[i] = Number.parseInt(id.slice(i * 2, i * 2 + 2), 16);
  }
  return result;
};

/**
 *
 *
 */
export const encodeClientMode = (
  clientMode: ClientMode
): ReadonlyArray<number> => {
  switch (clientMode._) {
    case "DebugMode": {
      return [0].concat(encodeInt32(clientMode.int32));
    }
    case "Release": {
      return [1];
    }
  }
};

/**
 *
 *
 */
export const encodeRequestLogInUrlRequestData = (
  requestLogInUrlRequestData: RequestLogInUrlRequestData
): ReadonlyArray<number> =>
  encodeOpenIdConnectProvider(
    requestLogInUrlRequestData.openIdConnectProvider
  ).concat(encodeUrlData(requestLogInUrlRequestData.urlData));

/**
 *
 *
 */
export const encodeOpenIdConnectProvider = (
  openIdConnectProvider: OpenIdConnectProvider
): ReadonlyArray<number> => {
  switch (openIdConnectProvider) {
    case "Google": {
      return [0];
    }
    case "GitHub": {
      return [1];
    }
    case "Line": {
      return [2];
    }
  }
};

/**
 *
 *
 */
export const encodeUrlData = (urlData: UrlData): ReadonlyArray<number> =>
  encodeClientMode(urlData.clientMode)
    .concat(encodeLocation(urlData.location))
    .concat(encodeLanguage(urlData.language))
    .concat(encodeMaybe(encodeHashOrAccessToken)(urlData.accessToken));

/**
 *
 *
 */
export const encodeLanguage = (language: Language): ReadonlyArray<number> => {
  switch (language) {
    case "Japanese": {
      return [0];
    }
    case "English": {
      return [1];
    }
    case "Esperanto": {
      return [2];
    }
  }
};

/**
 *
 *
 */
export const encodeLocation = (location: Location): ReadonlyArray<number> => {
  switch (location._) {
    case "Home": {
      return [0];
    }
    case "User": {
      return [1].concat(encodeId(location.userId));
    }
    case "Project": {
      return [2].concat(encodeId(location.projectId));
    }
  }
};

/**
 * SignedLeb128で表現されたバイナリをnumberのビット演算ができる32bit符号付き整数の範囲の数値に変換するコード
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 *
 */
export const decodeInt = (
  index: number,
  binary: Uint8Array
): { result: number; nextIndex: number } => {
  let result: number = 0;
  let offset: number = 0;
  while (true) {
    const byte: number = binary[index + offset];
    result |= (byte & 127) << (offset * 7);
    offset += 1;
    if ((128 & byte) === 0) {
      if (offset * 7 < 32 && (byte & 64) !== 0) {
        return {
          result: result | (~0 << (offset * 7)),
          nextIndex: index + offset
        };
      }
      return { result: result, nextIndex: index + offset };
    }
  }
};

/**
 * バイナリからstringに変換する.
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 *
 */
export const decodeString = (
  index: number,
  binary: Uint8Array
): { result: string; nextIndex: number } => {
  const length: { result: number; nextIndex: number } = decodeInt(
    index,
    binary
  );
  const nextIndex: number = index + length.nextIndex + length.result;
  const textBinary: Uint8Array = binary.slice(
    index + length.nextIndex,
    nextIndex
  );
  const isBrowser: boolean =
    process === undefined || process.title === "browser";
  if (isBrowser) {
    return {
      result: new TextDecoder().decode(textBinary),
      nextIndex: nextIndex
    };
  }
  return {
    result: new a.TextDecoder().decode(textBinary),
    nextIndex: nextIndex
  };
};

/**
 *
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 *
 */
export const decodeBool = (
  index: number,
  binary: Uint8Array
): { result: boolean; nextIndex: number } => ({
  result: binary[index] !== 0,
  nextIndex: index + 1
});

/**
 *
 *
 */
export const decodeList = <T>(
  decodeFunction: (a: number, b: Uint8Array) => { result: T; nextIndex: number }
): ((
  a: number,
  b: Uint8Array
) => { result: ReadonlyArray<T>; nextIndex: number }) => (
  index: number,
  binary: Uint8Array
): { result: ReadonlyArray<T>; nextIndex: number } => {
  const length: number = binary[index];
  const result: Array<T> = [];
  for (let i = 0; i < length; i += 1) {
    const resultAndNextIndex: { result: T; nextIndex: number } = decodeFunction(
      index,
      binary
    );
    result.push(resultAndNextIndex.result);
    index = resultAndNextIndex.nextIndex;
  }
  return { result: result, nextIndex: index };
};

/**
 *
 *
 */
export const decodeMaybe = <T>(
  decodeFunction: (a: number, b: Uint8Array) => { result: T; nextIndex: number }
): ((a: number, b: Uint8Array) => { result: Maybe<T>; nextIndex: number }) => (
  index: number,
  binary: Uint8Array
): { result: Maybe<T>; nextIndex: number } => {
  const patternIndexAndNextIndex: {
    result: number;
    nextIndex: number;
  } = decodeInt(index, binary);
  if (patternIndexAndNextIndex.result === 0) {
    const valueAndNextIndex: { result: T; nextIndex: number } = decodeFunction(
      patternIndexAndNextIndex.nextIndex,
      binary
    );
    return {
      result: maybeJust(valueAndNextIndex.result),
      nextIndex: valueAndNextIndex.nextIndex
    };
  }
  if (patternIndexAndNextIndex.result === 1) {
    return {
      result: maybeNothing(),
      nextIndex: patternIndexAndNextIndex.nextIndex
    };
  }
  throw new Error(
    "存在しないMaybeのパターンを受け取った. 型情報を更新してください"
  );
};

/**
 *
 *
 */
export const decodeResult = <ok, error>(
  okDecodeFunction: (
    a: number,
    b: Uint8Array
  ) => { result: ok; nextIndex: number },
  errorDecodeFunction: (
    a: number,
    b: Uint8Array
  ) => { result: error; nextIndex: number }
): ((
  a: number,
  b: Uint8Array
) => { result: Result<ok, error>; nextIndex: number }) => (
  index: number,
  binary: Uint8Array
): { result: Result<ok, error>; nextIndex: number } => {
  const patternIndexAndNextIndex: {
    result: number;
    nextIndex: number;
  } = decodeInt(index, binary);
  if (patternIndexAndNextIndex.result === 0) {
    const okAndNextIndex: { result: ok; nextIndex: number } = okDecodeFunction(
      patternIndexAndNextIndex.nextIndex,
      binary
    );
    return {
      result: resultOk(okAndNextIndex.result),
      nextIndex: okAndNextIndex.nextIndex
    };
  }
  if (patternIndexAndNextIndex.result === 1) {
    const errorAndNextIndex: {
      result: error;
      nextIndex: number;
    } = errorDecodeFunction(patternIndexAndNextIndex.nextIndex, binary);
    return {
      result: resultError(errorAndNextIndex.result),
      nextIndex: errorAndNextIndex.nextIndex
    };
  }
  throw new Error(
    "存在しないResultのパターンを受け取った. 型情報を更新してください"
  );
};

/**
 *
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 *
 */
export const decodeId = (
  index: number,
  binary: Uint8Array
): { result: string; nextIndex: number } => ({
  result: Array["from"](binary.slice(index, index + 16))
    .map((n: number): string => n.toString(16).padStart(2, "0"))
    .join(""),
  nextIndex: index + 16
});

/**
 *
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 *
 */
export const decodeHashOrAccessToken = (
  index: number,
  binary: Uint8Array
): { result: string; nextIndex: number } => ({
  result: Array["from"](binary.slice(index, index + 32))
    .map((n: number): string => n.toString(16).padStart(2, "0"))
    .join(""),
  nextIndex: index + 32
});

/**
 *
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 *
 */
export const decodeClientMode = (
  index: number,
  binary: Uint8Array
): { result: ClientMode; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: { result: number; nextIndex: number } = decodeInt(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: clientModeDebugMode(result.result),
      nextIndex: result.nextIndex
    };
  }
  if (patternIndex.result === 1) {
    return { result: clientModeRelease, nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 *
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 *
 */
export const decodeRequestLogInUrlRequestData = (
  index: number,
  binary: Uint8Array
): { result: RequestLogInUrlRequestData; nextIndex: number } => {
  const openIdConnectProviderAndNextIndex: {
    result: OpenIdConnectProvider;
    nextIndex: number;
  } = decodeOpenIdConnectProvider(index, binary);
  const urlDataAndNextIndex: {
    result: UrlData;
    nextIndex: number;
  } = decodeUrlData(openIdConnectProviderAndNextIndex.nextIndex, binary);
  return {
    result: {
      openIdConnectProvider: openIdConnectProviderAndNextIndex.result,
      urlData: urlDataAndNextIndex.result
    },
    nextIndex: urlDataAndNextIndex.nextIndex
  };
};

/**
 *
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 *
 */
export const decodeOpenIdConnectProvider = (
  index: number,
  binary: Uint8Array
): { result: OpenIdConnectProvider; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return { result: "Google", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: "GitHub", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    return { result: "Line", nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 *
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 *
 */
export const decodeUrlData = (
  index: number,
  binary: Uint8Array
): { result: UrlData; nextIndex: number } => {
  const clientModeAndNextIndex: {
    result: ClientMode;
    nextIndex: number;
  } = decodeClientMode(index, binary);
  const locationAndNextIndex: {
    result: Location;
    nextIndex: number;
  } = decodeLocation(clientModeAndNextIndex.nextIndex, binary);
  const languageAndNextIndex: {
    result: Language;
    nextIndex: number;
  } = decodeLanguage(locationAndNextIndex.nextIndex, binary);
  const accessTokenAndNextIndex: {
    result: Maybe<AccessToken>;
    nextIndex: number;
  } = decodeMaybe(
    decodeHashOrAccessToken as (
      a: number,
      b: Uint8Array
    ) => { result: AccessToken; nextIndex: number }
  )(languageAndNextIndex.nextIndex, binary);
  return {
    result: {
      clientMode: clientModeAndNextIndex.result,
      location: locationAndNextIndex.result,
      language: languageAndNextIndex.result,
      accessToken: accessTokenAndNextIndex.result
    },
    nextIndex: accessTokenAndNextIndex.nextIndex
  };
};

/**
 *
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 *
 */
export const decodeLanguage = (
  index: number,
  binary: Uint8Array
): { result: Language; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return { result: "Japanese", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: "English", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    return { result: "Esperanto", nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 *
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 *
 */
export const decodeLocation = (
  index: number,
  binary: Uint8Array
): { result: Location; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return { result: locationHome, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    const result: { result: UserId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: UserId; nextIndex: number })(patternIndex.nextIndex, binary);
    return { result: locationUser(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 2) {
    const result: { result: ProjectId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: ProjectId; nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: locationProject(result.result),
      nextIndex: result.nextIndex
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};
