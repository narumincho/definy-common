import * as nt from "@narumincho/type";
import * as codeGen from "js-ts-code-generator";
import * as fs from "fs";
import * as childProcess from "child_process";

const accessTokenName = "AccessToken";
const userIdName = "UserId";
const projectIdName = "ProjectId";
const fileHashName = "FileHash";

const dateTimeName = "DateTime";
const requestLogInUrlRequestDataName = "RequestLogInUrlRequestData";
const openIdConnectProviderName = "OpenIdConnectProvider";
const urlDataName = "UrlData";
const clientModeName = "ClientMode";
const locationName = "Location";
const languageName = "Language";

const dateTime: nt.type.CustomType = {
  name: dateTimeName,
  description: "日時 最小単位は秒",
  body: nt.type.customTypeBodyProduct([
    {
      name: "year",
      description: "年. 人類紀元. 西暦に10000を足したもの Human Era",
      memberType: nt.type.typeInt32
    },
    {
      name: "month",
      description: "月. 1月～12月. 最大値は月や年によって決まる",
      memberType: nt.type.typeInt32
    },
    {
      name: "day",
      description: "日",
      memberType: nt.type.typeInt32
    },
    {
      name: "hour",
      description: "時. 0時～23時",
      memberType: nt.type.typeInt32
    },
    {
      name: "minute",
      description: "分",
      memberType: nt.type.typeInt32
    },
    {
      name: "second",
      description: "秒",
      memberType: nt.type.typeInt32
    }
  ])
};

const requestLogInUrlRequestData: nt.type.CustomType = {
  name: requestLogInUrlRequestDataName,
  description: "ログインのURLを発行するために必要なデータ",
  body: nt.type.customTypeBodyProduct([
    {
      name: "openIdConnectProvider",
      description: "ログインに使用するプロバイダー",
      memberType: nt.type.typeCustom(openIdConnectProviderName)
    },
    {
      name: "urlData",
      description: "ログインした後に返ってくるURLに必要なデータ",
      memberType: nt.type.typeCustom(urlDataName)
    }
  ])
};

const openIdConnectProvider: nt.type.CustomType = {
  name: openIdConnectProviderName,
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

const urlData: nt.type.CustomType = {
  name: urlDataName,
  description:
    "デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語のを入れて,言語ごとに別のURLである必要がある. デバッグ時には http://localhost:2520 のオリジンになってしまう",
  body: nt.type.customTypeBodyProduct([
    {
      name: "clientMode",
      description: "クライアントモード",
      memberType: nt.type.typeCustom(clientModeName)
    },
    {
      name: "location",
      description: "場所",
      memberType: nt.type.typeCustom(locationName)
    },
    {
      name: "language",
      description: "言語",
      memberType: nt.type.typeCustom(languageName)
    },
    {
      name: "accessToken",
      description: "アクセストークン",
      memberType: nt.type.typeMaybe(nt.type.typeToken(accessTokenName))
    }
  ])
};

const clientMode: nt.type.CustomType = {
  name: clientModeName,
  description: "デバッグの状態と, デバッグ時ならアクセスしているポート番号",
  body: nt.type.customTypeBodySum([
    {
      name: "DebugMode",
      description:
        "デバッグモード. ポート番号を保持する. オリジンは http://localhost:2520 のようなもの",
      parameter: nt.type.maybeJust(nt.type.typeInt32)
    },
    {
      name: "Release",
      description: "リリースモード. https://definy.app ",
      parameter: nt.type.maybeNothing()
    }
  ])
};

const location: nt.type.CustomType = {
  name: locationName,
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

const language: nt.type.CustomType = {
  name: languageName,
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

const schema: nt.type.Schema = {
  customTypeList: [
    dateTime,
    clientMode,
    requestLogInUrlRequestData,
    openIdConnectProvider,
    urlData,
    language,
    location
  ],
  idOrTokenTypeNameList: [
    accessTokenName,
    userIdName,
    projectIdName,
    fileHashName
  ]
};

const code = codeGen.generateCodeAsString(
  nt.generateTypeScriptCode(schema),
  "TypeScript"
);

const typeScriptPath = "source/data.ts";
fs.promises.writeFile(typeScriptPath, code).then(() => {
  childProcess.exec(
    "npx prettier " + typeScriptPath,
    (error, standardOutput) => {
      if (error !== null) {
        throw new Error("TypeScript code error! " + error.toString());
      }
      fs.promises.writeFile(typeScriptPath, standardOutput);
      console.log("output TypeScript code!");
    }
  );
});
const elmPath = "Data.elm";
fs.promises.writeFile(elmPath, nt.elm.generateCode("Data", schema)).then(() => {
  childProcess.exec("elm-format --yes " + elmPath, error => {
    console.log("output Elm code!");
    if (error !== null) {
      throw new Error("elm code error! " + error.toString());
    }
  });
});
