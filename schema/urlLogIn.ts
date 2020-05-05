import { type } from "@narumincho/type";
import * as idAndToken from "./idAndToken";

const openIdConnectProviderName = "OpenIdConnectProvider";
const urlDataName = "UrlData";
const clientModeName = "ClientMode";
const locationName = "Location";
const languageName = "Language";

export const customTypeList: ReadonlyArray<type.CustomType> = [
  {
    name: "RequestLogInUrlRequestData",
    description: "ログインのURLを発行するために必要なデータ",
    body: type.customTypeBodyProduct([
      {
        name: "openIdConnectProvider",
        description: "ログインに使用するプロバイダー",
        memberType: type.typeCustom(openIdConnectProviderName),
      },
      {
        name: "urlData",
        description: "ログインした後に返ってくるURLに必要なデータ",
        memberType: type.typeCustom(urlDataName),
      },
    ]),
  },
  {
    name: openIdConnectProviderName,
    description:
      "ソーシャルログインを提供するプロバイダー (例: Google, GitHub)",
    body: type.customTypeBodySum([
      {
        name: "Google",
        description:
          "Google ( https://developers.google.com/identity/sign-in/web/ )",
        parameter: type.maybeNothing(),
      },
      {
        name: "GitHub",
        description:
          "GitHub ( https://developer.github.com/v3/guides/basics-of-authentication/ )",
        parameter: type.maybeNothing(),
      },
    ]),
  },
  {
    name: urlDataName,
    description:
      "デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語を入れて,言語ごとに別のURLである必要がある. デバッグ時のホスト名は http://localhost になる",
    body: type.customTypeBodyProduct([
      {
        name: "clientMode",
        description: "クライアントモード",
        memberType: type.typeCustom(clientModeName),
      },
      {
        name: "location",
        description: "場所",
        memberType: type.typeCustom(locationName),
      },
      {
        name: "language",
        description: "言語",
        memberType: type.typeCustom(languageName),
      },
    ]),
  },
  {
    name: clientModeName,
    description: "デバッグモードか, リリースモード",
    body: type.customTypeBodySum([
      {
        name: "DebugMode",
        description: "デバッグモード. オリジンは http://localshot:2520",
        parameter: type.maybeNothing(),
      },
      {
        name: "Release",
        description: "リリースモード. オリジンは https://definy.app ",
        parameter: type.maybeNothing(),
      },
    ]),
  },
  {
    name: locationName,
    description:
      "DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる",
    body: type.customTypeBodySum([
      {
        name: "Home",
        description: "最初のページ",
        parameter: type.maybeNothing(),
      },
      {
        name: "CreateProject",
        description: "プロジェクト作成画面",
        parameter: type.maybeNothing(),
      },
      {
        name: "CreateIdea",
        description:
          "アイデア作成ページ. パラメーターのprojectIdは対象のプロジェクト",
        parameter: type.maybeJust(idAndToken.projectId),
      },
      {
        name: "User",
        description: "ユーザーの詳細ページ",
        parameter: type.maybeJust(idAndToken.userId),
      },
      {
        name: "UserList",
        description: "ユーザー一覧ページ",
        parameter: type.maybeNothing(),
      },
      {
        name: "Project",
        description: "プロジェクトの詳細ページ",
        parameter: type.maybeJust(idAndToken.projectId),
      },
      {
        name: "Idea",
        description: "アイデア詳細ページ",
        parameter: type.maybeJust(idAndToken.ideaId),
      },
      {
        name: "Suggestion",
        description: "提案のページ",
        parameter: type.maybeJust(idAndToken.suggestionId),
      },
      {
        name: "PartList",
        description: "パーツ一覧ページ",
        parameter: type.maybeNothing(),
      },
      {
        name: "TypePartList",
        description: "型パーツ一覧ページ",
        parameter: type.maybeNothing(),
      },
      {
        name: "About",
        description: "Definyについて説明したページ",
        parameter: type.maybeNothing(),
      },
    ]),
  },
  {
    name: languageName,
    description: "英語,日本語,エスペラント語などの言語",
    body: type.customTypeBodySum([
      {
        name: "Japanese",
        description: "日本語",
        parameter: type.maybeNothing(),
      },
      {
        name: "English",
        description: "英語",
        parameter: type.maybeNothing(),
      },
      {
        name: "Esperanto",
        description: "エスペラント語",
        parameter: type.maybeNothing(),
      },
    ]),
  },
];
