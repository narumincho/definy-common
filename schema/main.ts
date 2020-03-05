import * as nt from "@narumincho/type";
import * as codeGen from "js-ts-code-generator";
import * as fs from "fs";

const requestLogInUrlRequestData: nt.type.CustomType = {
  name: "RequestLogInUrlRequestData",
  description: "ログインのURLを発行するために必要なデータ",
  body: nt.type.customTypeBodyProduct([
    {
      name: "openIdConnectProvider",
      description: "ログインに使用するプロバイダー",
      memberType: nt.type.typeCustom("OpenIdConnectProvider")
    },
    {
      name: "languageAndLocation",
      description: "ログインした後に返ってくる場所と言語",
      memberType: nt.type.typeCustom("LanguageAndLocation")
    }
  ])
};

const openIdConnectProvider: nt.type.CustomType = {
  name: "OpenIdConnectProvider",
  description: "プロバイダー (例: LINE, Google, GitHub)",
  body: nt.type.customTypeBodySum([
    {
      name: "Google",
      description:
        "Google ( https://developers.google.com/identity/sign-in/web/ )",
      parameter: nt.type.maybeNothing()
    },
    {
      name: "GitHub",
      description:
        "GitHub ( https://developer.github.com/v3/guides/basics-of-authentication/ )",
      parameter: nt.type.maybeNothing()
    },
    {
      name: "Line",
      description: "LINE ( https://developers.line.biz/ja/docs/line-login/ )",
      parameter: nt.type.maybeNothing()
    }
  ])
};

const languageAndLocation: nt.type.CustomType = {
  name: "LanguageAndLocation",
  description:
    "言語と場所. URLとして表現される. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語のを入れて,言語ごとに別のURLである必要がある",
  body: nt.type.customTypeBodyProduct([
    {
      name: "language",
      description: "言語",
      memberType: nt.type.typeCustom("Language")
    },
    {
      name: "location",
      description: "場所",
      memberType: nt.type.typeCustom("Location")
    }
  ])
};

const language: nt.type.CustomType = {
  name: "Language",
  description: "英語,日本語,エスペラント語などの言語",
  body: nt.type.customTypeBodySum([
    {
      name: "Japanese",
      description: "日本語",
      parameter: nt.type.maybeNothing()
    },
    {
      name: "English",
      description: "英語",
      parameter: nt.type.maybeNothing()
    },
    {
      name: "Esperanto",
      description: "エスペラント語",
      parameter: nt.type.maybeNothing()
    }
  ])
};

const location: nt.type.CustomType = {
  name: "Location",
  description:
    "DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる",
  body: nt.type.customTypeBodySum([
    {
      name: "Home",
      description: "最初のページ",
      parameter: nt.type.maybeNothing()
    },
    {
      name: "User",
      description: "ユーザーの詳細ページ",
      parameter: nt.type.maybeJust(nt.type.typeId("UserId"))
    },
    {
      name: "Project",
      description: "プロジェクトの詳細ページ",
      parameter: nt.type.maybeJust(nt.type.typeId("ProjectId"))
    }
  ])
};

const code = codeGen.generateCodeAsString(
  nt.generateTypeScriptCode(
    {
      customTypeList: [
        requestLogInUrlRequestData,
        openIdConnectProvider,
        languageAndLocation,
        language,
        location
      ],
      idOrHashTypeNameList: ["UserId", "ProjectId"]
    },
    false
  ),
  "TypeScript"
);

fs.writeFileSync("source/data.ts", code);
