import * as nt from "@narumincho/type";
import { type } from "@narumincho/type";
import * as codeGen from "js-ts-code-generator";
import * as fs from "fs";
import * as childProcess from "child_process";
import * as prettier from "prettier";
import * as suggestion from "./suggestion";
import * as idAndToken from "./idAndToken";
import * as time from "./time";
import * as urlLogIn from "./urlLogIn";
import * as resource from "./resource";

const typePartSnapshotName = "TypePartSnapshot";
const partSnapshotName = "PartSnapshot";
const typePartBodyName = "TypePartBody";
const typePartBodyProductMemberName = "TypePartBodyProductMember";
const typePartBodySumPatternName = "TypePartBodySumPattern";
const typePartBodyKernelName = "TypePartBodyKernel";
const typeName = "Type";
const typeFunctionName = "TypeFunction";
const typeTypePartWithParameterName = "TypeTypePartWithParameter";

const exprName = "Expr";
const evaluatedExprName = "EvaluatedExpr";
const kernelCallName = "KernelCall";
const kernelExprName = "KernelExpr";
const localPartReferenceName = "LocalPartReference";
const tagReferenceName = "TagReference";
const functionCallName = "FunctionCall";
const lambdaBranchName = "LambdaBranch";
const conditionName = "Condition";
const conditionTagName = "ConditionTag";
const branchPartDefinitionName = "BranchPartDefinition";
const conditionCaptureName = "ConditionCapture";
const evaluateExprErrorName = "EvaluateExprError";
const typeErrorName = "TypeError";

const createProjectParameterName = "CreateProjectParameter";
const createIdeaParameterName = "CreateIdeaParameter";
const addCommentParameterName = "AddCommentParameter";

const listCustomType: ReadonlyArray<type.CustomType> = [
  time.timeCustomType,
  ...urlLogIn.customTypeList,
  ...resource.customTypeList,
  {
    name: typePartSnapshotName,
    description: "型パーツ",
    body: type.customTypeBodyProduct([
      {
        name: "name",
        description: "型パーツの名前",
        memberType: type.typeString,
      },
      {
        name: "parentList",
        description: "この型パーツの元",
        memberType: type.typeList(idAndToken.partId),
      },
      {
        name: "description",
        description: "型パーツの説明",
        memberType: type.typeString,
      },
      {
        name: "projectId",
        description: "所属しているプロジェクトのID",
        memberType: idAndToken.projectId,
      },
      {
        name: "createSuggestionId",
        description: "この型パーツが作成された提案",
        memberType: idAndToken.suggestionId,
      },
      {
        name: "getTime",
        description: "取得日時",
        memberType: time.time,
      },
      {
        name: "body",
        description: "定義本体",
        memberType: type.typeCustom(typePartBodyName),
      },
    ]),
  },
  {
    name: partSnapshotName,
    description: "パーツの定義",
    body: type.customTypeBodyProduct([
      {
        name: "name",
        description: "パーツの名前",
        memberType: type.typeString,
      },
      {
        name: "parentList",
        description: "このパーツの元",
        memberType: type.typeList(idAndToken.partId),
      },
      {
        name: "description",
        description: "パーツの説明",
        memberType: type.typeString,
      },
      {
        name: "type",
        description: "パーツの型",
        memberType: type.typeCustom(typeName),
      },
      {
        name: "expr",
        description: "パーツの式",
        memberType: type.typeMaybe(type.typeCustom(exprName)),
      },
      {
        name: "projectId",
        description: "所属しているプロジェクトのID",
        memberType: idAndToken.projectId,
      },
      {
        name: "createSuggestionId",
        description: "このパーツが作成された提案",
        memberType: idAndToken.suggestionId,
      },
      {
        name: "getTime",
        description: "取得日時",
        memberType: time.time,
      },
    ]),
  },
  {
    name: typePartBodyName,
    description: "型の定義本体",
    body: type.customTypeBodySum([
      {
        name: "Product",
        description: "直積型",
        parameter: type.maybeJust(
          type.typeList(type.typeCustom(typePartBodyProductMemberName))
        ),
      },
      {
        name: "Sum",
        description: "直和型",
        parameter: type.maybeJust(
          type.typeList(type.typeCustom(typePartBodySumPatternName))
        ),
      },
      {
        name: "Kernel",
        description: "Definyだけでは表現できないデータ型",
        parameter: type.maybeJust(type.typeCustom(typePartBodyKernelName)),
      },
    ]),
  },
  {
    name: typePartBodyProductMemberName,
    description: "直積型のメンバー",
    body: type.customTypeBodyProduct([
      {
        name: "name",
        description: "メンバー名",
        memberType: type.typeString,
      },
      {
        name: "description",
        description: "説明文",
        memberType: type.typeString,
      },
      {
        name: "memberType",
        description: "メンバー値の型",
        memberType: type.typeCustom(typeName),
      },
    ]),
  },
  {
    name: typePartBodySumPatternName,
    description: "直積型のパターン",
    body: type.customTypeBodyProduct([
      {
        name: "name",
        description: "タグ名",
        memberType: type.typeString,
      },
      {
        name: "description",
        description: "説明文",
        memberType: type.typeString,
      },
      {
        name: "parameter",
        description: "パラメーター",
        memberType: type.typeCustom(typeName),
      },
    ]),
  },
  {
    name: typePartBodyKernelName,
    description: "Definyだけでは表現できないデータ型",
    body: type.customTypeBodySum([
      {
        name: "Int32",
        description: "32bit整数",
        parameter: type.maybeNothing(),
      },
      {
        name: "List",
        description: "リスト",
        parameter: type.maybeNothing(),
      },
    ]),
  },
  {
    name: typeName,
    description: "型",
    body: type.customTypeBodySum([
      {
        name: "Function",
        description: "関数",
        parameter: type.maybeJust(type.typeCustom(typeFunctionName)),
      },
      {
        name: "TypePartWithParameter",
        description: "型パーツと, パラメーターのリスト",
        parameter: type.maybeJust(
          type.typeCustom(typeTypePartWithParameterName)
        ),
      },
    ]),
  },
  {
    name: typeFunctionName,
    description: "",
    body: type.customTypeBodyProduct([
      {
        name: "inputType",
        description: "入力の型",
        memberType: type.typeCustom(typeName),
      },
      {
        name: "outputType",
        description: "出力の型",
        memberType: type.typeCustom(typeName),
      },
    ]),
  },
  {
    name: typeTypePartWithParameterName,
    description: "",
    body: type.customTypeBodyProduct([
      {
        name: "typePartId",
        description: "型の参照",
        memberType: idAndToken.typePartId,
      },
      {
        name: "parameter",
        description: "型のパラメーター",
        memberType: type.typeList(type.typeCustom(typeName)),
      },
    ]),
  },
  {
    name: exprName,
    description: "式",
    body: type.customTypeBodySum([
      {
        name: "Kernel",
        description: "Definyだけでは表現できない式",
        parameter: type.maybeJust(type.typeCustom(kernelExprName)),
      },
      {
        name: "Int32Literal",
        description: "32bit整数",
        parameter: type.maybeJust(type.typeInt32),
      },
      {
        name: "PartReference",
        description: "パーツの値を参照",
        parameter: type.maybeJust(idAndToken.partId),
      },
      {
        name: "LocalPartReference",
        description: "ローカルパーツの参照",
        parameter: type.maybeJust(type.typeCustom(localPartReferenceName)),
      },
      {
        name: "TagReference",
        description: "タグを参照",
        parameter: type.maybeJust(type.typeCustom(tagReferenceName)),
      },
      {
        name: "FunctionCall",
        description: "関数呼び出し",
        parameter: type.maybeJust(type.typeCustom(functionCallName)),
      },
      {
        name: "Lambda",
        description: "ラムダ",
        parameter: type.maybeJust(
          type.typeList(type.typeCustom(lambdaBranchName))
        ),
      },
    ]),
  },
  {
    name: evaluatedExprName,
    description: "評価しきった式",
    body: type.customTypeBodySum([
      {
        name: "Kernel",
        description: "Definyだけでは表現できない式",
        parameter: type.maybeJust(type.typeCustom(kernelExprName)),
      },
      {
        name: "Int32",
        description: "32bit整数",
        parameter: type.maybeJust(type.typeInt32),
      },
      {
        name: "LocalPartReference",
        description: "ローカルパーツの参照",
        parameter: type.maybeJust(type.typeCustom(localPartReferenceName)),
      },
      {
        name: "TagReference",
        description: "タグを参照",
        parameter: type.maybeJust(type.typeCustom(tagReferenceName)),
      },
      {
        name: "Lambda",
        description: "ラムダ",
        parameter: type.maybeJust(
          type.typeList(type.typeCustom(lambdaBranchName))
        ),
      },
      {
        name: "KernelCall",
        description: "内部関数呼び出し",
        parameter: type.maybeJust(type.typeCustom(kernelCallName)),
      },
    ]),
  },
  {
    name: kernelCallName,
    description: "複数の引数が必要な内部関数の部分呼び出し",
    body: type.customTypeBodyProduct([
      {
        name: "kernel",
        description: "関数",
        memberType: type.typeCustom(kernelExprName),
      },
      {
        name: "expr",
        description: "呼び出すパラメーター",
        memberType: type.typeCustom(evaluatedExprName),
      },
    ]),
  },
  {
    name: kernelExprName,
    description: "Definyだけでは表現できない式",
    body: type.customTypeBodySum([
      {
        name: "Int32Add",
        description: "32bit整数を足す関数",
        parameter: type.maybeNothing(),
      },
      {
        name: "Int32Sub",
        description: "32bit整数を引く関数",
        parameter: type.maybeNothing(),
      },
      {
        name: "Int32Mul",
        description: "32bit整数をかける関数",
        parameter: type.maybeNothing(),
      },
    ]),
  },
  {
    name: localPartReferenceName,
    description: "ローカルパスの参照を表す",
    body: type.customTypeBodyProduct([
      {
        name: "partId",
        description: "ローカルパスが定義されているパーツのID",
        memberType: idAndToken.partId,
      },
      {
        name: "localPartId",
        description: "ローカルパーツID",
        memberType: idAndToken.localPartId,
      },
    ]),
  },
  {
    name: tagReferenceName,
    description: "タグの参照を表す",
    body: type.customTypeBodyProduct([
      {
        name: "typePartId",
        description: "型ID",
        memberType: idAndToken.typePartId,
      },
      {
        name: "tagIndex",
        description: "タグIndex",
        memberType: type.typeInt32,
      },
    ]),
  },
  {
    name: functionCallName,
    description: "関数呼び出し",
    body: type.customTypeBodyProduct([
      {
        name: "function",
        description: "関数",
        memberType: type.typeCustom(exprName),
      },
      {
        name: "parameter",
        description: "パラメーター",
        memberType: type.typeCustom(exprName),
      },
    ]),
  },
  {
    name: lambdaBranchName,
    description: "ラムダのブランチ. Just x -> data x のようなところ",
    body: type.customTypeBodyProduct([
      {
        name: "condition",
        description: "入力値の条件を書くところ. Just x",
        memberType: type.typeCustom(conditionName),
      },
      {
        name: "description",
        description: "ブランチの説明",
        memberType: type.typeString,
      },
      {
        name: "localPartList",
        description: "",
        memberType: type.typeList(type.typeCustom(branchPartDefinitionName)),
      },
      {
        name: "expr",
        description: "式",
        memberType: type.typeMaybe(type.typeCustom(exprName)),
      },
    ]),
  },
  {
    name: conditionName,
    description: "ブランチの式を使う条件",
    body: type.customTypeBodySum([
      {
        name: "ByTag",
        description: "タグ",
        parameter: type.maybeJust(type.typeCustom(conditionTagName)),
      },
      {
        name: "ByCapture",
        description: "キャプチャパーツへのキャプチャ",
        parameter: type.maybeJust(type.typeCustom(conditionCaptureName)),
      },
      {
        name: "Any",
        description: "_ すべてのパターンを通すもの",
        parameter: type.maybeNothing(),
      },
      {
        name: "Int32",
        description: "32bit整数の完全一致",
        parameter: type.maybeJust(type.typeInt32),
      },
    ]),
  },
  {
    name: conditionTagName,
    description: "タグによる条件",
    body: type.customTypeBodyProduct([
      {
        name: "tag",
        description: "タグ",
        memberType: idAndToken.tagId,
      },
      {
        name: "parameter",
        description: "パラメーター",
        memberType: type.typeMaybe(type.typeCustom(conditionName)),
      },
    ]),
  },
  {
    name: conditionCaptureName,
    description: "キャプチャパーツへのキャプチャ",
    body: type.customTypeBodyProduct([
      {
        name: "name",
        description: "キャプチャパーツの名前",
        memberType: type.typeString,
      },
      {
        name: "localPartId",
        description: "ローカルパーツId",
        memberType: idAndToken.localPartId,
      },
    ]),
  },
  {
    name: branchPartDefinitionName,
    description: "ラムダのブランチで使えるパーツを定義する部分",
    body: type.customTypeBodyProduct([
      {
        name: "localPartId",
        description: "ローカルパーツID",
        memberType: idAndToken.localPartId,
      },
      {
        name: "name",
        description: "ブランチパーツの名前",
        memberType: type.typeString,
      },
      {
        name: "description",
        description: "ブランチパーツの説明",
        memberType: type.typeString,
      },
      {
        name: "type",
        description: "ローカルパーツの型",
        memberType: type.typeCustom(typeName),
      },
      {
        name: "expr",
        description: "ローカルパーツの式",
        memberType: type.typeCustom(exprName),
      },
    ]),
  },
  {
    name: evaluateExprErrorName,
    description: "",
    body: type.customTypeBodySum([
      {
        name: "NeedPartDefinition",
        description: "式を評価するには,このパーツの定義が必要だと言っている",
        parameter: type.maybeJust(idAndToken.partId),
      },
      {
        name: "PartExprIsNothing",
        description: "パーツの式が空だと言っている",
        parameter: type.maybeJust(idAndToken.partId),
      },
      {
        name: "CannotFindLocalPartDefinition",
        description: "ローカルパーツの定義を見つけることができなかった",
        parameter: type.maybeJust(type.typeCustom(localPartReferenceName)),
      },
      {
        name: "TypeError",
        description: "型が合わない",
        parameter: type.maybeJust(type.typeCustom(typeErrorName)),
      },
      {
        name: "NotSupported",
        description: "まだサポートしていないものが含まれている",
        parameter: type.maybeNothing(),
      },
    ]),
  },
  {
    name: typeErrorName,
    description: "型エラー",
    body: type.customTypeBodyProduct([
      {
        name: "message",
        description: "型エラーの説明",
        memberType: type.typeString,
      },
    ]),
  },
  {
    name: createProjectParameterName,
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
    name: createIdeaParameterName,
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
    name: addCommentParameterName,
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
  ...suggestion.customTypeList,
];

const code = codeGen.generateCodeAsString(
  nt.generateTypeScriptCode(listCustomType),
  "TypeScript"
);

const typeScriptPath = "source/data.ts";
fs.promises
  .writeFile(typeScriptPath, prettier.format(code, { parser: "typescript" }))
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
