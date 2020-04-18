import * as nt from "@narumincho/type";
import { type } from "@narumincho/type";
import * as codeGen from "js-ts-code-generator";
import * as fs from "fs";
import * as childProcess from "child_process";
import * as prettier from "prettier";
import * as code from "./code";
import * as idAndToken from "./idAndToken";
import * as time from "./time";
import * as urlLogIn from "./urlLogIn";
import * as resource from "./resource";

const listCustomType: ReadonlyArray<type.CustomType> = [
  time.timeCustomType,
  ...urlLogIn.customTypeList,
  ...resource.customTypeList,
  ...code.customTypeList,
  {
    name: "CreateProjectParameter",
    description: "プロジェクト作成時に必要なパラメーター",
    body: type.customTypeBodyProduct([
      {
        name: "accessToken",
        description: "プロジェクトを作るときのアカウント",
        memberType: idAndToken.accessToken,
      },
      {
        name: "projectName",
        description: "プロジェクト名",
        memberType: type.typeString,
      },
    ]),
  },
  {
    name: "CreateIdeaParameter",
    description: "アイデアを作成時に必要なパラメーター",
    body: type.customTypeBodyProduct([
      {
        name: "accessToken",
        description: "プロジェクトを作るときのアカウント",
        memberType: idAndToken.accessToken,
      },
      {
        name: "ideaName",
        description: "アイデア名",
        memberType: type.typeString,
      },
      {
        name: "projectId",
        description: "対象のプロジェクトID",
        memberType: idAndToken.projectId,
      },
    ]),
  },
  {
    name: "AddCommentParameter",
    description: "アイデアにコメントを追加するときに必要なパラメーター",
    body: type.customTypeBodyProduct([
      {
        name: "accessToken",
        description: "プロジェクトを作るときのアカウント",
        memberType: idAndToken.accessToken,
      },
      {
        name: "ideaId",
        description: "コメントを追加するアイデア",
        memberType: idAndToken.ideaId,
      },
      {
        name: "comment",
        description: "コメント本文",
        memberType: type.typeString,
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
const elmPath = "Data.elm";
fs.promises
  .writeFile(elmPath, nt.generateElmCode("Data", listCustomType))
  .then(() => {
    childProcess.exec("elm-format --yes " + elmPath, (error) => {
      console.log("output Elm code!");
      if (error !== null) {
        throw new Error("elm code error! " + error.toString());
      }
    });
  });
