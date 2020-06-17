import {
  Maybe,
  CustomTypeDefinition,
  CustomTypeDefinitionBody,
} from "@narumincho/type/distribution/data";
import * as idAndToken from "./idAndToken";
import * as customType from "./customType";
import * as name from "./name";

export const customTypeList: ReadonlyArray<CustomTypeDefinition> = [
  {
    name: "RequestLogInUrlRequestData",
    description: "ログインのURLを発行するために必要なデータ",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "openIdConnectProvider",
        description: "ログインに使用するプロバイダー",
        type: customType.openIdConnectProviderType,
      },
      {
        name: "urlData",
        description: "ログインした後に返ってくるURLに必要なデータ",
        type: customType.urlDataType,
      },
    ]),
  },
  {
    name: name.openIdConnectProviderName,
    description:
      "ソーシャルログインを提供するプロバイダー (例: Google, GitHub)",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
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
  },
  {
    name: name.urlDataName,
    description:
      "デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語を入れて,言語ごとに別のURLである必要がある. デバッグ時のホスト名は http://localhost になる",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "clientMode",
        description: "クライアントモード",
        type: customType.clientModeType,
      },
      {
        name: "location",
        description: "場所",
        type: customType.locationType,
      },
      {
        name: "language",
        description: "言語",
        type: customType.languageType,
      },
    ]),
  },
  {
    name: name.clientModeName,
    description: "デバッグモードか, リリースモード",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
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
  },
  {
    name: name.locationName,
    description:
      "DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
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
        parameter: Maybe.Just(idAndToken.projectId),
      },
      {
        name: "UserList",
        description: "ユーザー一覧ページ",
        parameter: Maybe.Nothing(),
      },
      {
        name: "User",
        description: "ユーザーの詳細ページ",
        parameter: Maybe.Just(idAndToken.userId),
      },
      {
        name: "IdeaList",
        description: "アイデア一覧",
        parameter: Maybe.Nothing(),
      },
      {
        name: "Idea",
        description: "アイデア詳細ページ",
        parameter: Maybe.Just(idAndToken.ideaId),
      },
      {
        name: "SuggestionList",
        description: "提案一覧",
        parameter: Maybe.Nothing(),
      },
      {
        name: "Suggestion",
        description: "提案のページ",
        parameter: Maybe.Just(idAndToken.suggestionId),
      },
      {
        name: "PartList",
        description: "パーツ一覧ページ",
        parameter: Maybe.Nothing(),
      },
      {
        name: "TypePartList",
        description: "型パーツ一覧ページ",
        parameter: Maybe.Nothing(),
      },
      {
        name: "About",
        description: "Definyについて説明したページ",
        parameter: Maybe.Nothing(),
      },
    ]),
  },
  {
    name: name.languageName,
    description: "英語,日本語,エスペラント語などの言語",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
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
  },
];
