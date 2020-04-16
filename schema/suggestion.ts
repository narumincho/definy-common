import { type } from "@narumincho/type";
import * as idAndToken from "./idAndToken";

export const suggestionName = "Suggestion";
export const suggestionStateName = "SuggestionState";
export const changeName = "Change";
const addPartName = "AddPart";
const suggestionTypeName = "SuggestionType";
const suggestionTypeFunctionName = "SuggestionTypeFunction";
const suggestionTypeTypePartWithParameterName =
  "SuggestionTypeTypePartWithParameter";
const suggestionTypeSuggestionTypePartWithParameterName =
  "SuggestionTypeSuggestionTypePartWithParameter";

const suggestionExprName = "SuggestionExpr";

const product = type.customTypeBodyProduct;
const sum = type.customTypeBodySum;

export const customTypeList: ReadonlyArray<type.CustomType> = [
  {
    name: suggestionName,
    description: "編集提案",
    body: product([
      {
        name: "name",
        description: "変更概要",
        memberType: type.typeString,
      },
      {
        name: "reason",
        description: "変更理由",
        memberType: type.typeString,
      },
      {
        name: "state",
        description: "承認状態",
        memberType: type.typeCustom(suggestionStateName),
      },
      {
        name: "changeList",
        description: "変更",
        memberType: type.typeList(type.typeCustom(changeName)),
      },
      {
        name: "projectId",
        description: "変更をするプロジェクト",
        memberType: idAndToken.projectId,
      },
      {
        name: "ideaId",
        description: "投稿したアイデアID",
        memberType: idAndToken.ideaId,
      },
    ]),
  },
  {
    name: suggestionStateName,
    description: "提案の状況",
    body: sum([
      {
        name: "Creating",
        description: "作成中",
        parameter: type.maybeNothing(),
      },
      {
        name: "ApprovalPending",
        description: "承認待ち",
        parameter: type.maybeNothing(),
      },
      {
        name: "Approved",
        description: "承認済み",
        parameter: type.maybeNothing(),
      },
      {
        name: "Rejected",
        description: "拒否された",
        parameter: type.maybeNothing(),
      },
    ]),
  },
  {
    name: changeName,
    description: "変更点",
    body: sum([
      {
        name: "ProjectName",
        description: "プロジェクト名の変更",
        parameter: type.maybeJust(type.typeString),
      },
      {
        name: "AddPart",
        description: "パーツの追加",
        parameter: type.maybeJust(type.typeCustom(addPartName)),
      },
    ]),
  },
  {
    name: addPartName,
    description: "パーツを追加するのに必要なもの",
    body: product([
      {
        name: "name",
        description: "新しいパーツの名前",
        memberType: type.typeString,
      },
      {
        name: "description",
        description: "新しいパーツの説明",
        memberType: type.typeString,
      },
      {
        name: "type",
        description: "新しいパーツの型",
        memberType: type.typeCustom(suggestionTypeName),
      },
    ]),
  },
  {
    name: suggestionTypeName,
    description: "ChangeのAddPartなどで使われる提案で作成した型を使えるType",
    body: sum([
      {
        name: "Function",
        description: "関数",
        parameter: type.maybeJust(type.typeCustom(suggestionTypeFunctionName)),
      },
      {
        name: "TypePartWithParameter",
        description: "提案前に作られた型パーツとパラメーター",
        parameter: type.maybeJust(
          type.typeCustom(suggestionTypeTypePartWithParameterName)
        ),
      },
      {
        name: "SuggestionTypePartWithParameter",
        description: "提案時に作られた型パーツとパラメーター",
        parameter: type.maybeJust(
          type.typeCustom(suggestionTypeTypePartWithParameterName)
        ),
      },
    ]),
  },
  {
    name: suggestionTypeFunctionName,
    description: "",
    body: product([
      {
        name: "inputType",
        description: "入力の型",
        memberType: type.typeCustom(suggestionTypeName),
      },
      {
        name: "outputType",
        description: "出力の型",
        memberType: type.typeCustom(suggestionTypeName),
      },
    ]),
  },
  {
    name: suggestionTypeTypePartWithParameterName,
    description: "",
    body: product([
      {
        name: "typePartId",
        description: "型の参照",
        memberType: idAndToken.typePartId,
      },
      {
        name: "parameter",
        description: "型のパラメーター",
        memberType: type.typeList(type.typeCustom(suggestionTypeName)),
      },
    ]),
  },
  {
    name: suggestionTypeSuggestionTypePartWithParameterName,
    description: "",
    body: product([
      {
        name: "suggestTypePartIndex",
        description: "提案内での定義した型パーツの番号",
        memberType: idAndToken.typePartId,
      },
      {
        name: "parameter",
        description: "型のパラメーター",
        memberType: type.typeList(type.typeCustom(suggestionTypeName)),
      },
    ]),
  },
];
