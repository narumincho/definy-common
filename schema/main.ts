import * as nt from "@narumincho/type";
import {
  Type,
  CustomTypeDefinition,
  CustomTypeDefinitionBody,
} from "@narumincho/type/distribution/data";
import * as codeGen from "js-ts-code-generator";
import * as fs from "fs";
import * as prettier from "prettier";
import * as code from "./code";
import * as idAndToken from "./idAndToken";
import * as name from "./name";
import * as urlLogIn from "./urlLogIn";
import * as resource from "./resource";
import * as customType from "./customType";

const listCustomType: ReadonlyArray<CustomTypeDefinition> = [
  {
    name: name.time,
    description:
      "日時. 0001-01-01T00:00:00.000Z to 9999-12-31T23:59:59.999Z 最小単位はミリ秒. ミリ秒の求め方は day*1000*60*60*24 + millisecond",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "day",
        description: "1970-01-01からの経過日数. マイナスになることもある",
        type: Type.Int32,
      },
      {
        name: "millisecond",
        description: "日にちの中のミリ秒. 0 to 86399999 (=1000*60*60*24-1)",
        type: Type.Int32,
      },
    ]),
  },
  ...urlLogIn.customTypeList,
  ...resource.customTypeList,
  ...code.customTypeList,
  {
    name: "CreateProjectParameter",
    description: "プロジェクト作成時に必要なパラメーター",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "accessToken",
        description: "プロジェクトを作るときのアカウント",
        type: idAndToken.accessToken,
      },
      {
        name: "projectName",
        description: "プロジェクト名",
        type: Type.String,
      },
    ]),
  },
  {
    name: "CreateIdeaParameter",
    description: "アイデアを作成時に必要なパラメーター",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "accessToken",
        description: "プロジェクトを作るときのアカウント",
        type: idAndToken.accessToken,
      },
      {
        name: "ideaName",
        description: "アイデア名",
        type: Type.String,
      },
      {
        name: "projectId",
        description: "対象のプロジェクトID",
        type: idAndToken.projectId,
      },
    ]),
  },
  {
    name: "AddCommentParameter",
    description: "アイデアにコメントを追加するときに必要なパラメーター",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "accessToken",
        description: "プロジェクトを作るときのアカウント",
        type: idAndToken.accessToken,
      },
      {
        name: "ideaId",
        description: "コメントを追加するアイデア",
        type: idAndToken.ideaId,
      },
      {
        name: "comment",
        description: "コメント本文",
        type: Type.String,
      },
    ]),
  },
  {
    name: "AddSuggestionParameter",
    description: "提案を作成するときに必要なパラメーター",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "accessToken",
        description: "提案を作成するアカウント",
        type: idAndToken.accessToken,
      },
      {
        name: "ideaId",
        description: "提案に関連付けられるアイデア",
        type: idAndToken.ideaId,
      },
    ]),
  },
  {
    name: "UpdateSuggestionParameter",
    description: "提案を更新するときに必要なパラメーター",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "accessToken",
        description: "提案を更新するアカウント",
        type: idAndToken.accessToken,
      },
      {
        name: "suggestionId",
        description: "書き換える提案",
        type: idAndToken.suggestionId,
      },
      {
        name: "name",
        description: "提案の名前",
        type: Type.String,
      },
      {
        name: "reason",
        description: "変更理由",
        type: Type.String,
      },
      {
        name: "changeList",
        description: "提案の変更",
        type: Type.List(customType.changeType),
      },
    ]),
  },
  {
    name: "AccessTokenAndSuggestionId",
    description: "提案を承認待ちにしたり許可したりするときなどに使う",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "accessToken",
        description: "アクセストークン",
        type: idAndToken.accessToken,
      },
      {
        name: "suggestionId",
        description: "SuggestionId",
        type: idAndToken.suggestionId,
      },
    ]),
  },
];

const typeScriptCode = codeGen.generateCodeAsString(
  nt.generateTypeScriptCode(listCustomType),
  "TypeScript"
);

const typeScriptPath = "source/data.ts";
fs.promises
  .writeFile(
    typeScriptPath,
    prettier.format(typeScriptCode, { parser: "typescript" })
  )
  .then(() => {
    console.log("output TypeScript code!");
  });
