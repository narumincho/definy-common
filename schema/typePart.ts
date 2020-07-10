import * as type from "./type";
import * as util from "../source/util";
import {
  Maybe,
  TypeAttribute,
  TypePart,
  TypePartBody,
  TypePartBodyKernel,
  TypePartId,
} from "../source/data";

export const Int32: TypePart = {
  name: "Int32",
  migrationPartId: Maybe.Nothing(),
  description:
    "-2 147 483 648 ～ 2 147 483 647. 32bit 符号付き整数. JavaScriptのnumberとして扱える. numberの32bit符号あり整数をSigned Leb128のバイナリに変換する",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [],
  body: TypePartBody.Kernel(TypePartBodyKernel.Int32),
};

export const Binary: TypePart = {
  name: "Binary",
  migrationPartId: Maybe.Nothing(),
  description:
    "バイナリ. JavaScriptのUint8Arrayで扱える. 最初にLED128でバイト数, その次にバイナリそのまま",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [],
  body: TypePartBody.Kernel(TypePartBodyKernel.Binary),
};

export const Bool: TypePart = {
  name: "Bool",
  migrationPartId: Maybe.Nothing(),
  description:
    "Bool. 真か偽. JavaScriptのbooleanで扱える. true: 1, false: 0. (1byte)としてバイナリに変換する",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Just(TypeAttribute.AsBoolean),
  typeParameterList: [],
  body: TypePartBody.Sum([
    {
      name: "True",
      description: "真",
      parameter: Maybe.Nothing(),
    },
    {
      name: "False",
      description: "偽",
      parameter: Maybe.Nothing(),
    },
  ]),
};

export const List: TypePart = {
  name: "List",
  migrationPartId: Maybe.Nothing(),
  description: "リスト. JavaScriptのArrayで扱う",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [
    {
      name: "e",
      typePartId: "cf95a75adf60a7eecabe7d0b4c3e68cd" as TypePartId,
    },
  ],
  body: TypePartBody.Kernel(TypePartBodyKernel.List),
};

const valueTypePartId = "7340e6b552af43695335a64e057f4250" as TypePartId;

export const maybe: TypePart = {
  name: "Maybe",
  migrationPartId: Maybe.Nothing(),
  description:
    "Maybe. nullableのようなもの. 今後はRustのstd::Optionに出力するために属性をつける?",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [
    {
      typePartId: valueTypePartId,
      name: "value",
    },
  ],
  body: TypePartBody.Sum([
    {
      name: "Just",
      description: "値があるということ",
      parameter: Maybe.Just({ typePartId: valueTypePartId, parameter: [] }),
    },
    {
      name: "Nothing",
      description: "値がないということ",
      parameter: Maybe.Nothing(),
    },
  ]),
};

const okTypePartId = "2163b3c97b382de8085973eff850c919" as TypePartId;
const errorTypePartId = "bd8be8409130f30f15c5c86c01de6dc5" as TypePartId;

export const Result: TypePart = {
  name: "Result",
  migrationPartId: Maybe.Nothing(),
  description:
    "成功と失敗を表す型. 今後はRustのstd::Resultに出力するために属性をつける?",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [
    {
      typePartId: okTypePartId,
      name: "ok",
    },
    {
      typePartId: errorTypePartId,
      name: "error",
    },
  ],
  body: TypePartBody.Sum([
    {
      name: "Ok",
      description: "成功",
      parameter: Maybe.Just({ typePartId: okTypePartId, parameter: [] }),
    },
    {
      name: "Error",
      description: "失敗",
      parameter: Maybe.Just({ typePartId: errorTypePartId, parameter: [] }),
    },
  ]),
};

export const String: TypePart = {
  name: "String",
  migrationPartId: Maybe.Nothing(),
  description:
    "文字列. JavaScriptのstringで扱う. バイナリ形式はUTF-8. 不正な文字が入っている可能性がある",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [],
  body: TypePartBody.Kernel(TypePartBodyKernel.String),
};

export const Time: TypePart = {
  name: "Time",
  migrationPartId: Maybe.Nothing(),
  description:
    "日時. 0001-01-01T00:00:00.000Z to 9999-12-31T23:59:59.999Z 最小単位はミリ秒. ミリ秒の求め方は day*1000*60*60*24 + millisecond",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  typeParameterList: [],
  attribute: Maybe.Nothing(),
  body: TypePartBody.Product([
    {
      name: "day",
      description: "1970-01-01からの経過日数. マイナスになることもある",
      type: type.Int32,
    },
    {
      name: "millisecond",
      description: "日にちの中のミリ秒. 0 to 86399999 (=1000*60*60*24-1)",
      type: type.Int32,
    },
  ]),
};

export const RequestLogInUrlRequestData: TypePart = {
  name: "RequestLogInUrlRequestData",
  migrationPartId: Maybe.Nothing(),
  description: "ログインのURLを発行するために必要なデータ",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  typeParameterList: [],
  attribute: Maybe.Nothing(),
  body: TypePartBody.Product([
    {
      name: "openIdConnectProvider",
      description: "ログインに使用するプロバイダー",
      type: type.OpenIdConnectProvider,
    },
    {
      name: "urlData",
      description: "ログインした後に返ってくるURLに必要なデータ",
      type: type.UrlData,
    },
  ]),
};

export const OpenIdConnectProvider: TypePart = {
  name: "OpenIdConnectProvider",
  migrationPartId: Maybe.Nothing(),
  description: "ソーシャルログインを提供するプロバイダー (例: Google, GitHub)",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  typeParameterList: [],
  attribute: Maybe.Nothing(),
  body: TypePartBody.Sum([
    {
      name: "Google",
      description:
        "Google ( https://developers.google.com/identity/sign-in/web/ )",
      parameter: Maybe.Nothing(),
    },
    {
      name: "GitHub",
      description:
        "GitHub ( https://developer.github.com/v3/guides/basics-of-authentication/ )",
      parameter: Maybe.Nothing(),
    },
  ]),
};

export const UrlData: TypePart = {
  name: "UrlData",
  migrationPartId: Maybe.Nothing(),
  description:
    "デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語を入れて,言語ごとに別のURLである必要がある. デバッグ時のホスト名は http://localhost になる",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [],
  body: TypePartBody.Product([
    {
      name: "clientMode",
      description: "クライアントモード",
      type: type.ClientMode,
    },
    {
      name: "location",
      description: "場所",
      type: type.Location,
    },
    {
      name: "language",
      description: "言語",
      type: type.Language,
    },
  ]),
};

export const ClientMode: TypePart = {
  name: "ClientMode",
  migrationPartId: Maybe.Nothing(),
  description: "デバッグモードか, リリースモード",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [],
  body: TypePartBody.Sum([
    {
      name: "DebugMode",
      description: "デバッグモード. オリジンは http://localshot:2520",
      parameter: Maybe.Nothing(),
    },
    {
      name: "Release",
      description: "リリースモード. オリジンは https://definy.app ",
      parameter: Maybe.Nothing(),
    },
  ]),
};

export const Location: TypePart = {
  name: "Location",
  migrationPartId: Maybe.Nothing(),
  description:
    "DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [],
  body: TypePartBody.Sum([
    {
      name: "Home",
      description: "最初のページ",
      parameter: Maybe.Nothing(),
    },
    {
      name: "CreateProject",
      description: "プロジェクト作成画面",
      parameter: Maybe.Nothing(),
    },
    {
      name: "Project",
      description: "プロジェクトの詳細ページ",
      parameter: Maybe.Just(type.ProjectId),
    },
    {
      name: "User",
      description: "ユーザーの詳細ページ",
      parameter: Maybe.Just(type.UserId),
    },
    {
      name: "Idea",
      description: "アイデア詳細ページ",
      parameter: Maybe.Just(type.IdeaId),
    },
    {
      name: "Suggestion",
      description: "提案のページ",
      parameter: Maybe.Just(type.SuggestionId),
    },
    {
      name: "About",
      description: "Definyについて説明したページ",
      parameter: Maybe.Nothing(),
    },
    {
      name: "Debug",
      description: "デバッグページ",
      parameter: Maybe.Nothing(),
    },
  ]),
};

export const Language: TypePart = {
  name: "Language",
  migrationPartId: Maybe.Nothing(),
  description: "英語,日本語,エスペラント語などの言語",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [],
  body: TypePartBody.Sum([
    {
      name: "Japanese",
      description: "日本語",
      parameter: Maybe.Nothing(),
    },
    {
      name: "English",
      description: "英語",
      parameter: Maybe.Nothing(),
    },
    {
      name: "Esperanto",
      description: "エスペラント語",
      parameter: Maybe.Nothing(),
    },
  ]),
};

export const ProjectId: TypePart = {
  name: "ProjectId",
  migrationPartId: Maybe.Nothing(),
  description: "プロジェクトを区別するためのID",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [],
  body: TypePartBody.Kernel(TypePartBodyKernel.Id),
};

export const UserId: TypePart = {
  name: "UserId",
  migrationPartId: Maybe.Nothing(),
  description: "ユーザーを区別するためのID",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [],
  body: TypePartBody.Kernel(TypePartBodyKernel.Id),
};

export const IdeaId: TypePart = {
  name: "IdeaId",
  migrationPartId: Maybe.Nothing(),
  description: "アイデアを区別するためのID",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [],
  body: TypePartBody.Kernel(TypePartBodyKernel.Id),
};

export const SuggestionId: TypePart = {
  name: "SuggestionId",
  migrationPartId: Maybe.Nothing(),
  description: "提案を区別するためのID",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [],
  body: TypePartBody.Kernel(TypePartBodyKernel.Id),
};
