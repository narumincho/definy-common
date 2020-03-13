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
 * 日時 最小単位は秒
 */
export type DateTime = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

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
export type OpenIdConnectProvider = "Google" | "GitHub";

/**
 * デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語のを入れて,言語ごとに別のURLである必要がある. デバッグ時のホスト名は http://[::1] になる
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

/**
 * ユーザーが公開している情報
 */
export type UserPublic = {
  name: string;
  imageHash: FileHash;
  introduction: string;
  createdAt: DateTime;
  likedProjectIdList: ReadonlyArray<ProjectId>;
  developedProjectIdList: ReadonlyArray<ProjectId>;
  commentedIdeaIdList: ReadonlyArray<IdeaId>;
};

/**
 * プロジェクト
 */
export type Project = {
  name: string;
  icon: FileHash;
  image: FileHash;
  releaseBranchCommitHashList: ReadonlyArray<ProjectHash>;
  developBranchCommitHashList: ReadonlyArray<ProjectHash>;
  createdAt: DateTime;
};

/**
 * アイデア
 */
export type Idea = {
  name: string;
  createdAt: DateTime;
  commentList: ReadonlyArray<IdeaComment>;
  draftCommitIdList: ReadonlyArray<ProjectSnapshot>;
};

/**
 * アイデアのコメント
 */
export type IdeaComment =
  | { _: "CommentByMessage"; ideaCommentMessage: IdeaCommentMessage }
  | { _: "CommentByCommit"; projectSnapshot: ProjectSnapshot };

/**
 * 文章でのコメント
 */
export type IdeaCommentMessage = {
  body: string;
  createdBy: UserId;
  createdAt: DateTime;
};

/**
 * プロジェクトのスナップショット. Gitでいうコミット
 */
export type ProjectSnapshot = {
  createdAt: DateTime;
  description: string;
  projectName: string;
  projectIcon: FileHash;
  projectImage: FileHash;
  projectDescription: string;
  moduleList: ReadonlyArray<ModuleHash>;
  typeList: ReadonlyArray<TypeSnapshot>;
  partList: ReadonlyArray<PartSnapshot>;
};

/**
 * モジュールのスナップショット
 */
export type ModuleSnapshot = {
  name: string;
  description: string;
  export: boolean;
  children: ReadonlyArray<ModuleHash>;
  typeList: ReadonlyArray<TypeSnapshot>;
  partList: ReadonlyArray<PartSnapshot>;
};

/**
 * 型のスナップショット
 */
export type TypeSnapshot = {
  name: string;
  parentList: ReadonlyArray<PartHash>;
  description: string;
};

/**
 * パーツのスナップショット
 */
export type PartSnapshot = {
  name: string;
  parentList: ReadonlyArray<PartHash>;
  description: string;
};

export type AccessToken = string & { _accessToken: never };

export type UserId = string & { _userId: never };

export type ProjectId = string & { _projectId: never };

export type IdeaId = string & { _ideaId: never };

export type FileHash = string & { _fileHash: never };

export type ProjectHash = string & { _projectHash: never };

export type ModuleHash = string & { _moduleHash: never };

export type TypeHash = string & { _typeHash: never };

export type PartHash = string & { _partHash: never };

export const maybeJust = <T>(value: T): Maybe<T> => ({
  _: "Just",
  value: value
});

export const maybeNothing = <T>(): Maybe<T> => ({ _: "Nothing" });

export const resultOk = <ok, error>(ok: ok): Result<ok, error> => ({
  _: "Ok",
  ok: ok
});

export const resultError = <ok, error>(error: error): Result<ok, error> => ({
  _: "Error",
  error: error
});

/**
 * デバッグモード. ポート番号を保持する. オリジンは http://[::1]:2520 のようなもの
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
 */
export const locationUser = (userId: UserId): Location => ({
  _: "User",
  userId: userId
});

/**
 * プロジェクトの詳細ページ
 */
export const locationProject = (projectId: ProjectId): Location => ({
  _: "Project",
  projectId: projectId
});

/**
 * 文章でのコメント
 */
export const ideaCommentCommentByMessage = (
  ideaCommentMessage: IdeaCommentMessage
): IdeaComment => ({
  _: "CommentByMessage",
  ideaCommentMessage: ideaCommentMessage
});

/**
 * 編集提案をする
 */
export const ideaCommentCommentByCommit = (
  projectSnapshot: ProjectSnapshot
): IdeaComment => ({ _: "CommentByCommit", projectSnapshot: projectSnapshot });

/**
 * numberの32bit符号あり整数をSigned Leb128のバイナリに変換する
 */
export const encodeInt32 = (value: number): ReadonlyArray<number> => {
  value |= 0;
  const result: Array<number> = [];
  while (true) {
    const byte: number = value & 127;
    value >>= 7;
    if (
      (value === 0 && (byte & 64) === 0) ||
      (value === -1 && (byte & 64) !== 0)
    ) {
      result.push(byte);
      return result;
    }
    result.push(byte | 128);
  }
};

/**
 * stringからバイナリに変換する.
 */
export const encodeString = (text: string): ReadonlyArray<number> => {
  const result: ReadonlyArray<number> = Array["from"](
    new TextEncoder().encode(text)
  );
  return encodeInt32(result.length).concat(result);
};

/**
 * boolからバイナリに変換する
 */
export const encodeBool = (value: boolean): ReadonlyArray<number> => [
  value ? 1 : 0
];

export const encodeList = <T>(
  encodeFunction: (a: T) => ReadonlyArray<number>
): ((a: ReadonlyArray<T>) => ReadonlyArray<number>) => (
  list: ReadonlyArray<T>
): ReadonlyArray<number> => {
  let result: Array<number> = encodeInt32(list.length) as Array<number>;
  for (const element of list) {
    result = result.concat(encodeFunction(element));
  }
  return result;
};

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

export const encodeId = (id: string): ReadonlyArray<number> => {
  const result: Array<number> = [];
  for (let i = 0; i < 16; i += 1) {
    result[i] = Number.parseInt(id.slice(i * 2, i * 2 + 2), 16);
  }
  return result;
};

export const encodeToken = (id: string): ReadonlyArray<number> => {
  const result: Array<number> = [];
  for (let i = 0; i < 32; i += 1) {
    result[i] = Number.parseInt(id.slice(i * 2, i * 2 + 2), 16);
  }
  return result;
};

export const encodeDateTime = (dateTime: DateTime): ReadonlyArray<number> =>
  encodeInt32(dateTime.year)
    .concat(encodeInt32(dateTime.month))
    .concat(encodeInt32(dateTime.day))
    .concat(encodeInt32(dateTime.hour))
    .concat(encodeInt32(dateTime.minute))
    .concat(encodeInt32(dateTime.second));

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

export const encodeRequestLogInUrlRequestData = (
  requestLogInUrlRequestData: RequestLogInUrlRequestData
): ReadonlyArray<number> =>
  encodeOpenIdConnectProvider(
    requestLogInUrlRequestData.openIdConnectProvider
  ).concat(encodeUrlData(requestLogInUrlRequestData.urlData));

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
  }
};

export const encodeUrlData = (urlData: UrlData): ReadonlyArray<number> =>
  encodeClientMode(urlData.clientMode)
    .concat(encodeLocation(urlData.location))
    .concat(encodeLanguage(urlData.language))
    .concat(encodeMaybe(encodeToken)(urlData.accessToken));

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

export const encodeUserPublic = (
  userPublic: UserPublic
): ReadonlyArray<number> =>
  encodeString(userPublic.name)
    .concat(encodeToken(userPublic.imageHash))
    .concat(encodeString(userPublic.introduction))
    .concat(encodeDateTime(userPublic.createdAt))
    .concat(encodeList(encodeId)(userPublic.likedProjectIdList))
    .concat(encodeList(encodeId)(userPublic.developedProjectIdList))
    .concat(encodeList(encodeId)(userPublic.commentedIdeaIdList));

export const encodeProject = (project: Project): ReadonlyArray<number> =>
  encodeString(project.name)
    .concat(encodeToken(project.icon))
    .concat(encodeToken(project.image))
    .concat(encodeList(encodeToken)(project.releaseBranchCommitHashList))
    .concat(encodeList(encodeToken)(project.developBranchCommitHashList))
    .concat(encodeDateTime(project.createdAt));

export const encodeIdea = (idea: Idea): ReadonlyArray<number> =>
  encodeString(idea.name)
    .concat(encodeDateTime(idea.createdAt))
    .concat(encodeList(encodeIdeaComment)(idea.commentList))
    .concat(encodeList(encodeProjectSnapshot)(idea.draftCommitIdList));

export const encodeIdeaComment = (
  ideaComment: IdeaComment
): ReadonlyArray<number> => {
  switch (ideaComment._) {
    case "CommentByMessage": {
      return [0].concat(
        encodeIdeaCommentMessage(ideaComment.ideaCommentMessage)
      );
    }
    case "CommentByCommit": {
      return [1].concat(encodeProjectSnapshot(ideaComment.projectSnapshot));
    }
  }
};

export const encodeIdeaCommentMessage = (
  ideaCommentMessage: IdeaCommentMessage
): ReadonlyArray<number> =>
  encodeString(ideaCommentMessage.body)
    .concat(encodeId(ideaCommentMessage.createdBy))
    .concat(encodeDateTime(ideaCommentMessage.createdAt));

export const encodeProjectSnapshot = (
  projectSnapshot: ProjectSnapshot
): ReadonlyArray<number> =>
  encodeDateTime(projectSnapshot.createdAt)
    .concat(encodeString(projectSnapshot.description))
    .concat(encodeString(projectSnapshot.projectName))
    .concat(encodeToken(projectSnapshot.projectIcon))
    .concat(encodeToken(projectSnapshot.projectImage))
    .concat(encodeString(projectSnapshot.projectDescription))
    .concat(encodeList(encodeToken)(projectSnapshot.moduleList))
    .concat(encodeList(encodeToken)(projectSnapshot.typeList))
    .concat(encodeList(encodeToken)(projectSnapshot.partList));

export const encodeModuleSnapshot = (
  moduleSnapshot: ModuleSnapshot
): ReadonlyArray<number> =>
  encodeString(moduleSnapshot.name)
    .concat(encodeString(moduleSnapshot.description))
    .concat(encodeBool(moduleSnapshot["export"]))
    .concat(encodeList(encodeToken)(moduleSnapshot.children))
    .concat(encodeList(encodeToken)(moduleSnapshot.typeList))
    .concat(encodeList(encodeToken)(moduleSnapshot.partList));

export const encodeTypeSnapshot = (
  typeSnapshot: TypeSnapshot
): ReadonlyArray<number> =>
  encodeString(typeSnapshot.name)
    .concat(encodeList(encodeToken)(typeSnapshot.parentList))
    .concat(encodeString(typeSnapshot.description));

export const encodePartSnapshot = (
  partSnapshot: PartSnapshot
): ReadonlyArray<number> =>
  encodeString(partSnapshot.name)
    .concat(encodeList(encodeToken)(partSnapshot.parentList))
    .concat(encodeString(partSnapshot.description));

/**
 * SignedLeb128で表現されたバイナリをnumberのビット演算ができる32bit符号付き整数の範囲の数値に変換するコード
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeInt32 = (
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
 */
export const decodeString = (
  index: number,
  binary: Uint8Array
): { result: string; nextIndex: number } => {
  const length: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  const nextIndex: number = length.nextIndex + length.result;
  return {
    result: new TextDecoder().decode(binary.slice(length.nextIndex, nextIndex)),
    nextIndex: nextIndex
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeBool = (
  index: number,
  binary: Uint8Array
): { result: boolean; nextIndex: number } => ({
  result: binary[index] !== 0,
  nextIndex: index + 1
});

export const decodeList = <T>(
  decodeFunction: (a: number, b: Uint8Array) => { result: T; nextIndex: number }
): ((
  a: number,
  b: Uint8Array
) => { result: ReadonlyArray<T>; nextIndex: number }) => (
  index: number,
  binary: Uint8Array
): { result: ReadonlyArray<T>; nextIndex: number } => {
  const lengthResult: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  index = lengthResult.nextIndex;
  const result: Array<T> = [];
  for (let i = 0; i < lengthResult.result; i += 1) {
    const resultAndNextIndex: { result: T; nextIndex: number } = decodeFunction(
      index,
      binary
    );
    result.push(resultAndNextIndex.result);
    index = resultAndNextIndex.nextIndex;
  }
  return { result: result, nextIndex: index };
};

export const decodeMaybe = <T>(
  decodeFunction: (a: number, b: Uint8Array) => { result: T; nextIndex: number }
): ((a: number, b: Uint8Array) => { result: Maybe<T>; nextIndex: number }) => (
  index: number,
  binary: Uint8Array
): { result: Maybe<T>; nextIndex: number } => {
  const patternIndexAndNextIndex: {
    result: number;
    nextIndex: number;
  } = decodeInt32(index, binary);
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
  } = decodeInt32(index, binary);
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
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
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
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeToken = (
  index: number,
  binary: Uint8Array
): { result: string; nextIndex: number } => ({
  result: Array["from"](binary.slice(index, index + 32))
    .map((n: number): string => n.toString(16).padStart(2, "0"))
    .join(""),
  nextIndex: index + 32
});

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeDateTime = (
  index: number,
  binary: Uint8Array
): { result: DateTime; nextIndex: number } => {
  const yearAndNextIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  const monthAndNextIndex: { result: number; nextIndex: number } = decodeInt32(
    yearAndNextIndex.nextIndex,
    binary
  );
  const dayAndNextIndex: { result: number; nextIndex: number } = decodeInt32(
    monthAndNextIndex.nextIndex,
    binary
  );
  const hourAndNextIndex: { result: number; nextIndex: number } = decodeInt32(
    dayAndNextIndex.nextIndex,
    binary
  );
  const minuteAndNextIndex: { result: number; nextIndex: number } = decodeInt32(
    hourAndNextIndex.nextIndex,
    binary
  );
  const secondAndNextIndex: { result: number; nextIndex: number } = decodeInt32(
    minuteAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      year: yearAndNextIndex.result,
      month: monthAndNextIndex.result,
      day: dayAndNextIndex.result,
      hour: hourAndNextIndex.result,
      minute: minuteAndNextIndex.result,
      second: secondAndNextIndex.result
    },
    nextIndex: secondAndNextIndex.nextIndex
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeClientMode = (
  index: number,
  binary: Uint8Array
): { result: ClientMode; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: { result: number; nextIndex: number } = decodeInt32(
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
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
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
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeOpenIdConnectProvider = (
  index: number,
  binary: Uint8Array
): { result: OpenIdConnectProvider; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return { result: "Google", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: "GitHub", nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
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
    decodeToken as (
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
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeLanguage = (
  index: number,
  binary: Uint8Array
): { result: Language; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
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
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeLocation = (
  index: number,
  binary: Uint8Array
): { result: Location; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
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

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeUserPublic = (
  index: number,
  binary: Uint8Array
): { result: UserPublic; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const imageHashAndNextIndex: {
    result: FileHash;
    nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { result: FileHash; nextIndex: number })(
    nameAndNextIndex.nextIndex,
    binary
  );
  const introductionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(imageHashAndNextIndex.nextIndex, binary);
  const createdAtAndNextIndex: {
    result: DateTime;
    nextIndex: number;
  } = decodeDateTime(introductionAndNextIndex.nextIndex, binary);
  const likedProjectIdListAndNextIndex: {
    result: ReadonlyArray<ProjectId>;
    nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: ProjectId; nextIndex: number }
  )(createdAtAndNextIndex.nextIndex, binary);
  const developedProjectIdListAndNextIndex: {
    result: ReadonlyArray<ProjectId>;
    nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: ProjectId; nextIndex: number }
  )(likedProjectIdListAndNextIndex.nextIndex, binary);
  const commentedIdeaIdListAndNextIndex: {
    result: ReadonlyArray<IdeaId>;
    nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: IdeaId; nextIndex: number }
  )(developedProjectIdListAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      imageHash: imageHashAndNextIndex.result,
      introduction: introductionAndNextIndex.result,
      createdAt: createdAtAndNextIndex.result,
      likedProjectIdList: likedProjectIdListAndNextIndex.result,
      developedProjectIdList: developedProjectIdListAndNextIndex.result,
      commentedIdeaIdList: commentedIdeaIdListAndNextIndex.result
    },
    nextIndex: commentedIdeaIdListAndNextIndex.nextIndex
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeProject = (
  index: number,
  binary: Uint8Array
): { result: Project; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const iconAndNextIndex: {
    result: FileHash;
    nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { result: FileHash; nextIndex: number })(
    nameAndNextIndex.nextIndex,
    binary
  );
  const imageAndNextIndex: {
    result: FileHash;
    nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { result: FileHash; nextIndex: number })(
    iconAndNextIndex.nextIndex,
    binary
  );
  const releaseBranchCommitHashListAndNextIndex: {
    result: ReadonlyArray<ProjectHash>;
    nextIndex: number;
  } = decodeList(
    decodeToken as (
      a: number,
      b: Uint8Array
    ) => { result: ProjectHash; nextIndex: number }
  )(imageAndNextIndex.nextIndex, binary);
  const developBranchCommitHashListAndNextIndex: {
    result: ReadonlyArray<ProjectHash>;
    nextIndex: number;
  } = decodeList(
    decodeToken as (
      a: number,
      b: Uint8Array
    ) => { result: ProjectHash; nextIndex: number }
  )(releaseBranchCommitHashListAndNextIndex.nextIndex, binary);
  const createdAtAndNextIndex: {
    result: DateTime;
    nextIndex: number;
  } = decodeDateTime(developBranchCommitHashListAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      icon: iconAndNextIndex.result,
      image: imageAndNextIndex.result,
      releaseBranchCommitHashList:
        releaseBranchCommitHashListAndNextIndex.result,
      developBranchCommitHashList:
        developBranchCommitHashListAndNextIndex.result,
      createdAt: createdAtAndNextIndex.result
    },
    nextIndex: createdAtAndNextIndex.nextIndex
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeIdea = (
  index: number,
  binary: Uint8Array
): { result: Idea; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const createdAtAndNextIndex: {
    result: DateTime;
    nextIndex: number;
  } = decodeDateTime(nameAndNextIndex.nextIndex, binary);
  const commentListAndNextIndex: {
    result: ReadonlyArray<IdeaComment>;
    nextIndex: number;
  } = decodeList(decodeIdeaComment)(createdAtAndNextIndex.nextIndex, binary);
  const draftCommitIdListAndNextIndex: {
    result: ReadonlyArray<ProjectSnapshot>;
    nextIndex: number;
  } = decodeList(decodeProjectSnapshot)(
    commentListAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      name: nameAndNextIndex.result,
      createdAt: createdAtAndNextIndex.result,
      commentList: commentListAndNextIndex.result,
      draftCommitIdList: draftCommitIdListAndNextIndex.result
    },
    nextIndex: draftCommitIdListAndNextIndex.nextIndex
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeIdeaComment = (
  index: number,
  binary: Uint8Array
): { result: IdeaComment; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: {
      result: IdeaCommentMessage;
      nextIndex: number;
    } = decodeIdeaCommentMessage(patternIndex.nextIndex, binary);
    return {
      result: ideaCommentCommentByMessage(result.result),
      nextIndex: result.nextIndex
    };
  }
  if (patternIndex.result === 1) {
    const result: {
      result: ProjectSnapshot;
      nextIndex: number;
    } = decodeProjectSnapshot(patternIndex.nextIndex, binary);
    return {
      result: ideaCommentCommentByCommit(result.result),
      nextIndex: result.nextIndex
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeIdeaCommentMessage = (
  index: number,
  binary: Uint8Array
): { result: IdeaCommentMessage; nextIndex: number } => {
  const bodyAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const createdByAndNextIndex: {
    result: UserId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: UserId; nextIndex: number })(
    bodyAndNextIndex.nextIndex,
    binary
  );
  const createdAtAndNextIndex: {
    result: DateTime;
    nextIndex: number;
  } = decodeDateTime(createdByAndNextIndex.nextIndex, binary);
  return {
    result: {
      body: bodyAndNextIndex.result,
      createdBy: createdByAndNextIndex.result,
      createdAt: createdAtAndNextIndex.result
    },
    nextIndex: createdAtAndNextIndex.nextIndex
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeProjectSnapshot = (
  index: number,
  binary: Uint8Array
): { result: ProjectSnapshot; nextIndex: number } => {
  const createdAtAndNextIndex: {
    result: DateTime;
    nextIndex: number;
  } = decodeDateTime(index, binary);
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(createdAtAndNextIndex.nextIndex, binary);
  const projectNameAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(descriptionAndNextIndex.nextIndex, binary);
  const projectIconAndNextIndex: {
    result: FileHash;
    nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { result: FileHash; nextIndex: number })(
    projectNameAndNextIndex.nextIndex,
    binary
  );
  const projectImageAndNextIndex: {
    result: FileHash;
    nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { result: FileHash; nextIndex: number })(
    projectIconAndNextIndex.nextIndex,
    binary
  );
  const projectDescriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(projectImageAndNextIndex.nextIndex, binary);
  const moduleListAndNextIndex: {
    result: ReadonlyArray<ModuleHash>;
    nextIndex: number;
  } = decodeList(
    decodeToken as (
      a: number,
      b: Uint8Array
    ) => { result: ModuleHash; nextIndex: number }
  )(projectDescriptionAndNextIndex.nextIndex, binary);
  const typeListAndNextIndex: {
    result: ReadonlyArray<TypeSnapshot>;
    nextIndex: number;
  } = decodeList(
    decodeToken as (
      a: number,
      b: Uint8Array
    ) => { result: TypeSnapshot; nextIndex: number }
  )(moduleListAndNextIndex.nextIndex, binary);
  const partListAndNextIndex: {
    result: ReadonlyArray<PartSnapshot>;
    nextIndex: number;
  } = decodeList(
    decodeToken as (
      a: number,
      b: Uint8Array
    ) => { result: PartSnapshot; nextIndex: number }
  )(typeListAndNextIndex.nextIndex, binary);
  return {
    result: {
      createdAt: createdAtAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      projectName: projectNameAndNextIndex.result,
      projectIcon: projectIconAndNextIndex.result,
      projectImage: projectImageAndNextIndex.result,
      projectDescription: projectDescriptionAndNextIndex.result,
      moduleList: moduleListAndNextIndex.result,
      typeList: typeListAndNextIndex.result,
      partList: partListAndNextIndex.result
    },
    nextIndex: partListAndNextIndex.nextIndex
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeModuleSnapshot = (
  index: number,
  binary: Uint8Array
): { result: ModuleSnapshot; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const exportAndNextIndex: { result: boolean; nextIndex: number } = decodeBool(
    descriptionAndNextIndex.nextIndex,
    binary
  );
  const childrenAndNextIndex: {
    result: ReadonlyArray<ModuleHash>;
    nextIndex: number;
  } = decodeList(
    decodeToken as (
      a: number,
      b: Uint8Array
    ) => { result: ModuleHash; nextIndex: number }
  )(exportAndNextIndex.nextIndex, binary);
  const typeListAndNextIndex: {
    result: ReadonlyArray<TypeSnapshot>;
    nextIndex: number;
  } = decodeList(
    decodeToken as (
      a: number,
      b: Uint8Array
    ) => { result: TypeSnapshot; nextIndex: number }
  )(childrenAndNextIndex.nextIndex, binary);
  const partListAndNextIndex: {
    result: ReadonlyArray<PartSnapshot>;
    nextIndex: number;
  } = decodeList(
    decodeToken as (
      a: number,
      b: Uint8Array
    ) => { result: PartSnapshot; nextIndex: number }
  )(typeListAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      export: exportAndNextIndex.result,
      children: childrenAndNextIndex.result,
      typeList: typeListAndNextIndex.result,
      partList: partListAndNextIndex.result
    },
    nextIndex: partListAndNextIndex.nextIndex
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypeSnapshot = (
  index: number,
  binary: Uint8Array
): { result: TypeSnapshot; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const parentListAndNextIndex: {
    result: ReadonlyArray<PartHash>;
    nextIndex: number;
  } = decodeList(
    decodeToken as (
      a: number,
      b: Uint8Array
    ) => { result: PartHash; nextIndex: number }
  )(nameAndNextIndex.nextIndex, binary);
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(parentListAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      parentList: parentListAndNextIndex.result,
      description: descriptionAndNextIndex.result
    },
    nextIndex: descriptionAndNextIndex.nextIndex
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodePartSnapshot = (
  index: number,
  binary: Uint8Array
): { result: PartSnapshot; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const parentListAndNextIndex: {
    result: ReadonlyArray<PartHash>;
    nextIndex: number;
  } = decodeList(
    decodeToken as (
      a: number,
      b: Uint8Array
    ) => { result: PartHash; nextIndex: number }
  )(nameAndNextIndex.nextIndex, binary);
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(parentListAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      parentList: parentListAndNextIndex.result,
      description: descriptionAndNextIndex.result
    },
    nextIndex: descriptionAndNextIndex.nextIndex
  };
};
