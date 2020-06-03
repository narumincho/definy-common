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
import * as time from "./time";
import * as urlLogIn from "./urlLogIn";
import * as resource from "./resource";

const listCustomType: ReadonlyArray<CustomTypeDefinition> = [
  time.timeCustomType,
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
        type: Type.List(code.changeType),
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
