import { type } from "@narumincho/type";
import * as idAndToken from "./idAndToken";
import * as time from "./time";

const suggestionSnapshotName = "SuggestionSnapshot";
const suggestionSnapshotAndIdName = "SuggestionSnapshotAndId";
const suggestionResponse = "SuggestionResponse";

const suggestionStateName = "SuggestionState";
const changeName = "Change";
export const change = type.typeCustom(changeName);
const addPartName = "AddPart";
const suggestionTypeName = "SuggestionType";
const suggestionTypeInputAndOutputName = "SuggestionTypeInputAndOutput";
const typePartWithSuggestionTypeParameterName =
  "TypePartWithSuggestionTypeParameter";
const suggestionTypePartWithSuggestionTypeParameterName =
  "SuggestionTypePartWithSuggestionTypeParameter";

const suggestionExprName = "SuggestionExpr";
const suggestionTagReferenceName = "SuggestionTagReference";
const suggestionFunctionCallName = "SuggestionFunctionCall";
const suggestionLambdaBranchName = "SuggestionLambdaBranch";
const suggestionBranchPartDefinitionName = "SuggestionBranchPartDefinition";

const typePartSnapshotName = "TypePartSnapshot";
const partSnapshotName = "PartSnapshot";
const typePartBodyName = "TypePartBody";
const typePartBodyProductMemberName = "TypePartBodyProductMember";
const typePartBodySumPatternName = "TypePartBodySumPattern";
const typePartBodyKernelName = "TypePartBodyKernel";
const typeName = "Type";
const typeInputAndOutputName = "TypeInputAndOutput";
const typePartIdWithParameterName = "TypePartIdWithParameter";

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

const product = type.customTypeBodyProduct;
const sum = type.customTypeBodySum;

export const customTypeList: ReadonlyArray<type.CustomType> = [
  {
    name: suggestionSnapshotName,
    description: "提案",
    body: product([
      {
        name: "name",
        description: "変更概要",
        memberType: type.typeString,
      },
      {
        name: "createUserId",
        description: "作成者",
        memberType: idAndToken.userId,
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
      {
        name: "updateTime",
        description: "更新日時",
        memberType: time.time,
      },
      {
        name: "getTime",
        description: "取得日時",
        memberType: time.time,
      },
    ]),
  },
  {
    name: suggestionSnapshotAndIdName,
    description: "Id付きのSuggestion",
    body: product([
      {
        name: "id",
        description: "SuggestionId",
        memberType: idAndToken.suggestionId,
      },
      {
        name: "snapshot",
        description: "SuggestionSnapshot",
        memberType: type.typeCustom(suggestionSnapshotName),
      },
    ]),
  },
  {
    name: suggestionResponse,
    description:
      "Maybe SuggestionSnapshotとSuggestionId TypeScript→Elmに渡す用",
    body: product([
      {
        name: "id",
        description: "SuggestionId",
        memberType: idAndToken.suggestionId,
      },
      {
        name: "snapshotMaybe",
        description: "SuggestionSnapshot Maybe",
        memberType: type.typeMaybe(type.typeCustom(suggestionSnapshotName)),
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
      {
        name: "expr",
        description: "新しいパーツの式",
        memberType: type.typeCustom(suggestionExprName),
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
        parameter: type.maybeJust(
          type.typeCustom(suggestionTypeInputAndOutputName)
        ),
      },
      {
        name: "TypePartWithParameter",
        description: "提案前に作られた型パーツとパラメーター",
        parameter: type.maybeJust(
          type.typeCustom(typePartWithSuggestionTypeParameterName)
        ),
      },
      {
        name: "SuggestionTypePartWithParameter",
        description: "提案時に作られた型パーツとパラメーター",
        parameter: type.maybeJust(
          type.typeCustom(suggestionTypePartWithSuggestionTypeParameterName)
        ),
      },
    ]),
  },
  {
    name: suggestionTypeInputAndOutputName,
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
    name: typePartWithSuggestionTypeParameterName,
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
    name: suggestionTypePartWithSuggestionTypeParameterName,
    description: "",
    body: product([
      {
        name: "suggestionTypePartIndex",
        description: "提案内での定義した型パーツの番号",
        memberType: type.typeInt32,
      },
      {
        name: "parameter",
        description: "型のパラメーター",
        memberType: type.typeList(type.typeCustom(suggestionTypeName)),
      },
    ]),
  },
  {
    name: suggestionExprName,
    description: "提案時に含まれるパーツを参照できる式",
    body: sum([
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
        name: "SuggestionPartReference",
        description: "提案内で定義されたパーツの番号",
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
        name: "SuggestionTagReference",
        description: "提案内で定義された型のタグ",
        parameter: type.maybeJust(type.typeCustom(suggestionTagReferenceName)),
      },
      {
        name: "FunctionCall",
        description: "関数呼び出し (中に含まれる型はSuggestionExpr)",
        parameter: type.maybeJust(type.typeCustom(suggestionFunctionCallName)),
      },
      {
        name: "Lambda",
        description: "ラムダ",
        parameter: type.maybeJust(type.typeCustom(suggestionLambdaBranchName)),
      },
    ]),
  },
  {
    name: suggestionTagReferenceName,
    description: "提案内で定義された型のタグ",
    body: product([
      {
        name: "suggestionTypePartIndex",
        description: "提案内での定義した型パーツの番号",
        memberType: type.typeInt32,
      },
      {
        name: "tagIndex",
        description: "タグIndex",
        memberType: type.typeInt32,
      },
    ]),
  },
  {
    name: suggestionFunctionCallName,
    description: "関数呼び出し (中に含まれる型はSuggestionExpr)",
    body: product([
      {
        name: "function",
        description: "関数",
        memberType: type.typeCustom(suggestionExprName),
      },
      {
        name: "parameter",
        description: "パラメーター",
        memberType: type.typeCustom(suggestionExprName),
      },
    ]),
  },
  {
    name: suggestionLambdaBranchName,
    description: "suggestionExprの入ったLambdaBranch",
    body: product([
      {
        name: "condition",
        description: "入力値の条件を書くところ",
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
        memberType: type.typeList(
          type.typeCustom(suggestionBranchPartDefinitionName)
        ),
      },
      {
        name: "expr",
        description: "式",
        memberType: type.typeMaybe(type.typeCustom(suggestionExprName)),
      },
    ]),
  },
  {
    name: suggestionBranchPartDefinitionName,
    description:
      "ラムダのブランチで使えるパーツを定義する部分 (SuggestionExpr バージョン)",
    body: product([
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
        memberType: type.typeCustom(suggestionTypeName),
      },
      {
        name: "expr",
        description: "ローカルパーツの式",
        memberType: type.typeCustom(suggestionExprName),
      },
    ]),
  },
  {
    name: typePartSnapshotName,
    description: "型パーツ",
    body: product([
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
    body: product([
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
    body: sum([
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
    body: product([
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
    body: product([
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
    body: sum([
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
    body: sum([
      {
        name: "Function",
        description: "関数",
        parameter: type.maybeJust(type.typeCustom(typeInputAndOutputName)),
      },
      {
        name: "TypePartWithParameter",
        description: "型パーツと, パラメーターのリスト",
        parameter: type.maybeJust(type.typeCustom(typePartIdWithParameterName)),
      },
    ]),
  },
  {
    name: typeInputAndOutputName,
    description: "",
    body: product([
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
    name: typePartIdWithParameterName,
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
        memberType: type.typeList(type.typeCustom(typeName)),
      },
    ]),
  },
  {
    name: exprName,
    description: "式",
    body: sum([
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
    body: sum([
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
    body: product([
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
    body: sum([
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
    body: product([
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
    body: product([
      {
        name: "typePartId",
        description: "型ID",
        memberType: idAndToken.typePartId,
      },
      {
        name: "tagId",
        description: "タグID",
        memberType: idAndToken.tagId,
      },
    ]),
  },
  {
    name: functionCallName,
    description: "関数呼び出し",
    body: product([
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
    body: product([
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
    body: sum([
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
    body: product([
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
    body: product([
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
    body: product([
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
    body: sum([
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
    body: product([
      {
        name: "message",
        description: "型エラーの説明",
        memberType: type.typeString,
      },
    ]),
  },
];
