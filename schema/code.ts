import {
  Maybe,
  Type,
  CustomTypeDefinition,
  CustomTypeDefinitionBody,
} from "@narumincho/type/distribution/data";
import * as idAndToken from "./idAndToken";
import * as time from "./time";

const suggestionSnapshotName = "SuggestionSnapshot";
const suggestionSnapshotAndIdName = "SuggestionSnapshotAndId";
const suggestionResponse = "SuggestionResponse";

const suggestionStateName = "SuggestionState";
const changeName = "Change";
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

const evalParameterName = "EvalParameter";
const partWithId = "PartWithId";
const typePartWithId = "TypePartWithId";
export const changeType = Type.Custom({
  name: changeName,
  parameterList: [],
});
const suggestionStateType = Type.Custom({
  name: suggestionStateName,
  parameterList: [],
});
const suggestionSnapshotType = Type.Custom({
  name: suggestionSnapshotName,
  parameterList: [],
});
const addPartType = Type.Custom({
  name: addPartName,
  parameterList: [],
});
const suggestionTypeType = Type.Custom({
  name: suggestionTypeName,
  parameterList: [],
});
const suggestionExprType = Type.Custom({
  name: suggestionExprName,
  parameterList: [],
});
const suggestionTypeInputAndOutputType = Type.Custom({
  name: suggestionTypeInputAndOutputName,
  parameterList: [],
});
const typePartWithSuggestionTypeParameterType = Type.Custom({
  name: typePartWithSuggestionTypeParameterName,
  parameterList: [],
});
const suggestionTypePartWithSuggestionTypeParameterType = Type.Custom({
  name: suggestionTypePartWithSuggestionTypeParameterName,
  parameterList: [],
});
const kernelExprType = Type.Custom({
  name: kernelExprName,
  parameterList: [],
});
const localPartReferenceType = Type.Custom({
  name: localPartReferenceName,
  parameterList: [],
});
const TagReferenceType = Type.Custom({
  name: tagReferenceName,
  parameterList: [],
});
const suggestionTagReferenceType = Type.Custom({
  name: suggestionTagReferenceName,
  parameterList: [],
});
const suggestionFunctionCallType = Type.Custom({
  name: suggestionFunctionCallName,
  parameterList: [],
});
const suggestionLambdaBranchType = Type.Custom({
  name: suggestionLambdaBranchName,
  parameterList: [],
});
const conditionType = Type.Custom({
  name: conditionName,
  parameterList: [],
});
const suggestionBranchPartDefinitionType = Type.Custom({
  name: suggestionBranchPartDefinitionName,
  parameterList: [],
});
const typePartBodyType = Type.Custom({
  name: typePartBodyName,
  parameterList: [],
});
const typeType = Type.Custom({
  name: typeName,
  parameterList: [],
});
const exprType = Type.Custom({
  name: exprName,
  parameterList: [],
});
const typePartBodyProductMemberType = Type.Custom({
  name: typePartBodyProductMemberName,
  parameterList: [],
});
const typePartBodySumPatternType = Type.Custom({
  name: typePartBodySumPatternName,
  parameterList: [],
});
const typePartBodyKernelType = Type.Custom({
  name: typePartBodyKernelName,
  parameterList: [],
});
const typeInputAndOutputType = Type.Custom({
  name: typeInputAndOutputName,
  parameterList: [],
});
const typePartIdWithParameterType = Type.Custom({
  name: typePartIdWithParameterName,
  parameterList: [],
});
const functionCallType = Type.Custom({
  name: functionCallName,
  parameterList: [],
});
const lambdaBranchType = Type.Custom({
  name: lambdaBranchName,
  parameterList: [],
});
const kernelCallType = Type.Custom({
  name: kernelCallName,
  parameterList: [],
});
const evaluatedExprType = Type.Custom({
  name: evaluatedExprName,
  parameterList: [],
});
const branchPartDefinitionType = Type.Custom({
  name: branchPartDefinitionName,
  parameterList: [],
});
const conditionTagType = Type.Custom({
  name: conditionTagName,
  parameterList: [],
});
const conditionCaptureType = Type.Custom({
  name: conditionCaptureName,
  parameterList: [],
});
const typeErrorType = Type.Custom({
  name: typeErrorName,
  parameterList: [],
});

export const customTypeList: ReadonlyArray<CustomTypeDefinition> = [
  {
    name: suggestionSnapshotName,
    description: "提案",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "name",
        description: "変更概要",
        type: Type.String,
      },
      {
        name: "createUserId",
        description: "作成者",
        type: idAndToken.userId,
      },
      {
        name: "reason",
        description: "変更理由",
        type: Type.String,
      },
      {
        name: "state",
        description: "承認状態",
        type: suggestionStateType,
      },
      {
        name: "changeList",
        description: "変更",
        type: Type.List(changeType),
      },
      {
        name: "projectId",
        description: "変更をするプロジェクト",
        type: idAndToken.projectId,
      },
      {
        name: "ideaId",
        description: "投稿したアイデアID",
        type: idAndToken.ideaId,
      },
      {
        name: "updateTime",
        description: "更新日時",
        type: time.time,
      },
      {
        name: "getTime",
        description: "取得日時",
        type: time.time,
      },
    ]),
  },
  {
    name: suggestionSnapshotAndIdName,
    description: "Id付きのSuggestion",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "id",
        description: "SuggestionId",
        type: idAndToken.suggestionId,
      },
      {
        name: "snapshot",
        description: "SuggestionSnapshot",
        type: suggestionSnapshotType,
      },
    ]),
  },
  {
    name: suggestionResponse,
    description:
      "Maybe SuggestionSnapshotとSuggestionId TypeScript→Elmに渡す用",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "id",
        description: "SuggestionId",
        type: idAndToken.suggestionId,
      },
      {
        name: "snapshotMaybe",
        description: "SuggestionSnapshot Maybe",
        type: Type.Maybe(suggestionSnapshotType),
      },
    ]),
  },
  {
    name: suggestionStateName,
    description: "提案の状況",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "Creating",
        description: "作成中",
        parameter: Maybe.Nothing(),
      },
      {
        name: "ApprovalPending",
        description: "承認待ち",
        parameter: Maybe.Nothing(),
      },
      {
        name: "Approved",
        description: "承認済み",
        parameter: Maybe.Nothing(),
      },
      {
        name: "Rejected",
        description: "拒否された",
        parameter: Maybe.Nothing(),
      },
    ]),
  },
  {
    name: changeName,
    description: "変更点",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "ProjectName",
        description: "プロジェクト名の変更",
        parameter: Maybe.Just(Type.String),
      },
      {
        name: "AddPart",
        description: "パーツの追加",
        parameter: Maybe.Just(addPartType),
      },
    ]),
  },
  {
    name: addPartName,
    description: "パーツを追加するのに必要なもの",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "id",
        description: "ブラウザで生成した今回作成した提案内で参照するためのID",
        type: Type.Int32,
      },
      {
        name: "name",
        description: "新しいパーツの名前",
        type: Type.String,
      },
      {
        name: "description",
        description: "新しいパーツの説明",
        type: Type.String,
      },
      {
        name: "type",
        description: "新しいパーツの型",
        type: suggestionTypeType,
      },
      {
        name: "expr",
        description: "新しいパーツの式",
        type: suggestionExprType,
      },
    ]),
  },
  {
    name: suggestionTypeName,
    description: "ChangeのAddPartなどで使われる提案で作成した型を使えるType",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "Function",
        description: "関数",
        parameter: Maybe.Just(suggestionTypeInputAndOutputType),
      },
      {
        name: "TypePartWithParameter",
        description: "提案前に作られた型パーツとパラメーター",
        parameter: Maybe.Just(typePartWithSuggestionTypeParameterType),
      },
      {
        name: "SuggestionTypePartWithParameter",
        description: "提案時に作られた型パーツとパラメーター",
        parameter: Maybe.Just(
          suggestionTypePartWithSuggestionTypeParameterType
        ),
      },
    ]),
  },
  {
    name: suggestionTypeInputAndOutputName,
    description: "",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "inputType",
        description: "入力の型",
        type: suggestionTypeType,
      },
      {
        name: "outputType",
        description: "出力の型",
        type: suggestionTypeType,
      },
    ]),
  },
  {
    name: typePartWithSuggestionTypeParameterName,
    description: "",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "typePartId",
        description: "型の参照",
        type: idAndToken.typePartId,
      },
      {
        name: "parameter",
        description: "型のパラメーター",
        type: Type.List(suggestionTypeType),
      },
    ]),
  },
  {
    name: suggestionTypePartWithSuggestionTypeParameterName,
    description: "",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "suggestionTypePartIndex",
        description: "提案内での定義した型パーツのID",
        type: Type.Int32,
      },
      {
        name: "parameter",
        description: "型のパラメーター",
        type: Type.List(suggestionTypeType),
      },
    ]),
  },
  {
    name: suggestionExprName,
    description: "提案時に含まれるパーツを参照できる式",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "Kernel",
        description: "Definyだけでは表現できない式",
        parameter: Maybe.Just(kernelExprType),
      },
      {
        name: "Int32Literal",
        description: "32bit整数",
        parameter: Maybe.Just(Type.Int32),
      },
      {
        name: "PartReference",
        description: "パーツの値を参照",
        parameter: Maybe.Just(idAndToken.partId),
      },
      {
        name: "SuggestionPartReference",
        description: "提案内で定義されたパーツのID",
        parameter: Maybe.Just(Type.Int32),
      },
      {
        name: "LocalPartReference",
        description: "ローカルパーツの参照",
        parameter: Maybe.Just(localPartReferenceType),
      },
      {
        name: "TagReference",
        description: "タグを参照",
        parameter: Maybe.Just(TagReferenceType),
      },
      {
        name: "SuggestionTagReference",
        description: "提案内で定義された型のタグ",
        parameter: Maybe.Just(suggestionTagReferenceType),
      },
      {
        name: "FunctionCall",
        description: "関数呼び出し (中に含まれる型はSuggestionExpr)",
        parameter: Maybe.Just(suggestionFunctionCallType),
      },
      {
        name: "Lambda",
        description: "ラムダ",
        parameter: Maybe.Just(Type.List(suggestionLambdaBranchType)),
      },
      {
        name: "Blank",
        description: "空白",
        parameter: Maybe.Nothing(),
      },
    ]),
  },
  {
    name: suggestionTagReferenceName,
    description: "提案内で定義された型のタグ",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "suggestionTypePartIndex",
        description: "提案内での定義した型パーツの番号",
        type: Type.Int32,
      },
      {
        name: "tagIndex",
        description: "タグIndex",
        type: Type.Int32,
      },
    ]),
  },
  {
    name: suggestionFunctionCallName,
    description: "関数呼び出し (中に含まれる型はSuggestionExpr)",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "function",
        description: "関数",
        type: suggestionExprType,
      },
      {
        name: "parameter",
        description: "パラメーター",
        type: suggestionExprType,
      },
    ]),
  },
  {
    name: suggestionLambdaBranchName,
    description: "suggestionExprの入ったLambdaBranch",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "condition",
        description: "入力値の条件を書くところ",
        type: conditionType,
      },
      {
        name: "description",
        description: "ブランチの説明",
        type: Type.String,
      },
      {
        name: "localPartList",
        description: "",
        type: Type.List(suggestionBranchPartDefinitionType),
      },
      {
        name: "expr",
        description: "式",
        type: suggestionExprType,
      },
    ]),
  },
  {
    name: suggestionBranchPartDefinitionName,
    description:
      "ラムダのブランチで使えるパーツを定義する部分 (SuggestionExpr バージョン)",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "localPartId",
        description: "ローカルパーツID",
        type: idAndToken.localPartId,
      },
      {
        name: "name",
        description: "ブランチパーツの名前",
        type: Type.String,
      },
      {
        name: "description",
        description: "ブランチパーツの説明",
        type: Type.String,
      },
      {
        name: "type",
        description: "ローカルパーツの型",
        type: suggestionTypeType,
      },
      {
        name: "expr",
        description: "ローカルパーツの式",
        type: suggestionExprType,
      },
    ]),
  },
  {
    name: typePartSnapshotName,
    description: "型パーツ",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "name",
        description: "型パーツの名前",
        type: Type.String,
      },
      {
        name: "parentList",
        description: "この型パーツの元",
        type: Type.List(idAndToken.partId),
      },
      {
        name: "description",
        description: "型パーツの説明",
        type: Type.String,
      },
      {
        name: "projectId",
        description: "所属しているプロジェクトのID",
        type: idAndToken.projectId,
      },
      {
        name: "createSuggestionId",
        description: "この型パーツが作成された提案",
        type: idAndToken.suggestionId,
      },
      {
        name: "getTime",
        description: "取得日時",
        type: time.time,
      },
      {
        name: "body",
        description: "定義本体",
        type: typePartBodyType,
      },
    ]),
  },
  {
    name: partSnapshotName,
    description: "パーツの定義",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "name",
        description: "パーツの名前",
        type: Type.String,
      },
      {
        name: "parentList",
        description: "このパーツの元",
        type: Type.List(idAndToken.partId),
      },
      {
        name: "description",
        description: "パーツの説明",
        type: Type.String,
      },
      {
        name: "type",
        description: "パーツの型",
        type: typeType,
      },
      {
        name: "expr",
        description: "パーツの式",
        type: exprType,
      },
      {
        name: "projectId",
        description: "所属しているプロジェクトのID",
        type: idAndToken.projectId,
      },
      {
        name: "createSuggestionId",
        description: "このパーツが作成された提案",
        type: idAndToken.suggestionId,
      },
      {
        name: "getTime",
        description: "取得日時",
        type: time.time,
      },
    ]),
  },
  {
    name: typePartBodyName,
    description: "型の定義本体",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "Product",
        description: "直積型",
        parameter: Maybe.Just(Type.List(typePartBodyProductMemberType)),
      },
      {
        name: "Sum",
        description: "直和型",
        parameter: Maybe.Just(Type.List(typePartBodySumPatternType)),
      },
      {
        name: "Kernel",
        description: "Definyだけでは表現できないデータ型",
        parameter: Maybe.Just(typePartBodyKernelType),
      },
    ]),
  },
  {
    name: typePartBodyProductMemberName,
    description: "直積型のメンバー",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "name",
        description: "メンバー名",
        type: Type.String,
      },
      {
        name: "description",
        description: "説明文",
        type: Type.String,
      },
      {
        name: "type",
        description: "メンバー値の型",
        type: typeType,
      },
    ]),
  },
  {
    name: typePartBodySumPatternName,
    description: "直積型のパターン",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "name",
        description: "タグ名",
        type: Type.String,
      },
      {
        name: "description",
        description: "説明文",
        type: Type.String,
      },
      {
        name: "parameter",
        description: "パラメーター",
        type: Type.Maybe(typeType),
      },
    ]),
  },
  {
    name: typePartBodyKernelName,
    description: "Definyだけでは表現できないデータ型",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "Int32",
        description: "32bit整数",
        parameter: Maybe.Nothing(),
      },
      {
        name: "List",
        description: "リスト",
        parameter: Maybe.Nothing(),
      },
    ]),
  },
  {
    name: typeName,
    description: "型",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "Function",
        description: "関数",
        parameter: Maybe.Just(typeInputAndOutputType),
      },
      {
        name: "TypePartWithParameter",
        description: "型パーツと, パラメーターのリスト",
        parameter: Maybe.Just(typePartIdWithParameterType),
      },
    ]),
  },
  {
    name: typeInputAndOutputName,
    description: "",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "inputType",
        description: "入力の型",
        type: typeType,
      },
      {
        name: "outputType",
        description: "出力の型",
        type: typeType,
      },
    ]),
  },
  {
    name: typePartIdWithParameterName,
    description: "",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "typePartId",
        description: "型の参照",
        type: idAndToken.typePartId,
      },
      {
        name: "parameter",
        description: "型のパラメーター",
        type: Type.List(typeType),
      },
    ]),
  },
  {
    name: exprName,
    description: "式",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "Kernel",
        description: "Definyだけでは表現できない式",
        parameter: Maybe.Just(kernelExprType),
      },
      {
        name: "Int32Literal",
        description: "32bit整数",
        parameter: Maybe.Just(Type.Int32),
      },
      {
        name: "PartReference",
        description: "パーツの値を参照",
        parameter: Maybe.Just(idAndToken.partId),
      },
      {
        name: "LocalPartReference",
        description: "ローカルパーツの参照",
        parameter: Maybe.Just(localPartReferenceType),
      },
      {
        name: "TagReference",
        description: "タグを参照",
        parameter: Maybe.Just(TagReferenceType),
      },
      {
        name: "FunctionCall",
        description: "関数呼び出し",
        parameter: Maybe.Just(functionCallType),
      },
      {
        name: "Lambda",
        description: "ラムダ",
        parameter: Maybe.Just(Type.List(lambdaBranchType)),
      },
    ]),
  },
  {
    name: evaluatedExprName,
    description: "評価しきった式",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "Kernel",
        description: "Definyだけでは表現できない式",
        parameter: Maybe.Just(kernelExprType),
      },
      {
        name: "Int32",
        description: "32bit整数",
        parameter: Maybe.Just(Type.Int32),
      },
      {
        name: "LocalPartReference",
        description: "ローカルパーツの参照",
        parameter: Maybe.Just(localPartReferenceType),
      },
      {
        name: "TagReference",
        description: "タグを参照",
        parameter: Maybe.Just(TagReferenceType),
      },
      {
        name: "Lambda",
        description: "ラムダ",
        parameter: Maybe.Just(Type.List(lambdaBranchType)),
      },
      {
        name: "KernelCall",
        description: "内部関数呼び出し",
        parameter: Maybe.Just(kernelCallType),
      },
    ]),
  },
  {
    name: kernelCallName,
    description: "複数の引数が必要な内部関数の部分呼び出し",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "kernel",
        description: "関数",
        type: kernelExprType,
      },
      {
        name: "expr",
        description: "呼び出すパラメーター",
        type: evaluatedExprType,
      },
    ]),
  },
  {
    name: kernelExprName,
    description: "Definyだけでは表現できない式",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "Int32Add",
        description: "32bit整数を足す関数",
        parameter: Maybe.Nothing(),
      },
      {
        name: "Int32Sub",
        description: "32bit整数を引く関数",
        parameter: Maybe.Nothing(),
      },
      {
        name: "Int32Mul",
        description: "32bit整数をかける関数",
        parameter: Maybe.Nothing(),
      },
    ]),
  },
  {
    name: localPartReferenceName,
    description: "ローカルパスの参照を表す",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "partId",
        description: "ローカルパスが定義されているパーツのID",
        type: idAndToken.partId,
      },
      {
        name: "localPartId",
        description: "ローカルパーツID",
        type: idAndToken.localPartId,
      },
    ]),
  },
  {
    name: tagReferenceName,
    description: "タグの参照を表す",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "typePartId",
        description: "型ID",
        type: idAndToken.typePartId,
      },
      {
        name: "tagId",
        description: "タグID",
        type: idAndToken.tagId,
      },
    ]),
  },
  {
    name: functionCallName,
    description: "関数呼び出し",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "function",
        description: "関数",
        type: exprType,
      },
      {
        name: "parameter",
        description: "パラメーター",
        type: exprType,
      },
    ]),
  },
  {
    name: lambdaBranchName,
    description: "ラムダのブランチ. Just x -> data x のようなところ",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "condition",
        description: "入力値の条件を書くところ. Just x",
        type: conditionType,
      },
      {
        name: "description",
        description: "ブランチの説明",
        type: Type.String,
      },
      {
        name: "localPartList",
        description: "",
        type: Type.List(branchPartDefinitionType),
      },
      {
        name: "expr",
        description: "式",
        type: exprType,
      },
    ]),
  },
  {
    name: conditionName,
    description: "ブランチの式を使う条件",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "ByTag",
        description: "タグ",
        parameter: Maybe.Just(conditionTagType),
      },
      {
        name: "ByCapture",
        description: "キャプチャパーツへのキャプチャ",
        parameter: Maybe.Just(conditionCaptureType),
      },
      {
        name: "Any",
        description: "_ すべてのパターンを通すもの",
        parameter: Maybe.Nothing(),
      },
      {
        name: "Int32",
        description: "32bit整数の完全一致",
        parameter: Maybe.Just(Type.Int32),
      },
    ]),
  },
  {
    name: conditionTagName,
    description: "タグによる条件",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "tag",
        description: "タグ",
        type: idAndToken.tagId,
      },
      {
        name: "parameter",
        description: "パラメーター",
        type: Type.Maybe(conditionType),
      },
    ]),
  },
  {
    name: conditionCaptureName,
    description: "キャプチャパーツへのキャプチャ",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "name",
        description: "キャプチャパーツの名前",
        type: Type.String,
      },
      {
        name: "localPartId",
        description: "ローカルパーツId",
        type: idAndToken.localPartId,
      },
    ]),
  },
  {
    name: branchPartDefinitionName,
    description: "ラムダのブランチで使えるパーツを定義する部分",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "localPartId",
        description: "ローカルパーツID",
        type: idAndToken.localPartId,
      },
      {
        name: "name",
        description: "ブランチパーツの名前",
        type: Type.String,
      },
      {
        name: "description",
        description: "ブランチパーツの説明",
        type: Type.String,
      },
      {
        name: "type",
        description: "ローカルパーツの型",
        type: typeType,
      },
      {
        name: "expr",
        description: "ローカルパーツの式",
        type: exprType,
      },
    ]),
  },
  {
    name: evaluateExprErrorName,
    description: "評価したときに失敗した原因を表すもの",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "NeedPartDefinition",
        description: "式を評価するには,このパーツの定義が必要だと言っている",
        parameter: Maybe.Just(idAndToken.partId),
      },
      {
        name: "NeedSuggestionPart",
        description: "式を評価するために必要なSuggestionPartが見つからない",
        parameter: Maybe.Just(Type.Int32),
      },
      {
        name: "Blank",
        description: "計算結果にblankが含まれている",
        parameter: Maybe.Nothing(),
      },
      {
        name: "CannotFindLocalPartDefinition",
        description: "ローカルパーツの定義を見つけることができなかった",
        parameter: Maybe.Just(localPartReferenceType),
      },
      {
        name: "TypeError",
        description: "型が合わない",
        parameter: Maybe.Just(typeErrorType),
      },
      {
        name: "NotSupported",
        description: "まだサポートしていないものが含まれている",
        parameter: Maybe.Nothing(),
      },
    ]),
  },
  {
    name: typeErrorName,
    description: "型エラー",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "message",
        description: "型エラーの説明",
        type: Type.String,
      },
    ]),
  },
  {
    name: evalParameterName,
    description: "評価する上で必要なソースコード",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "partList",
        description: "パーツのリスト",
        type: Type.List(Type.Custom({ name: partWithId, parameterList: [] })),
      },
      {
        name: "typePartList",
        description: "型パーツのリスト",
        type: Type.List(
          Type.Custom({ name: typePartWithId, parameterList: [] })
        ),
      },
      {
        name: "changeList",
        description: "変更点",
        type: Type.List(changeType),
      },
      {
        name: "expr",
        description: "評価してほしい式",
        type: suggestionExprType,
      },
    ]),
  },
  {
    name: partWithId,
    description: "パーツとPartId",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "id",
        description: "PartId",
        type: idAndToken.partId,
      },
      {
        name: "part",
        description: "PartSnapshot",
        type: Type.Custom({ name: partSnapshotName, parameterList: [] }),
      },
    ]),
  },
  {
    name: typePartWithId,
    description: "型パーツとTypePartId",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "id",
        description: "TypePartId",
        type: idAndToken.typePartId,
      },
      {
        name: "typePart",
        description: "TypePartSnapshot",
        type: Type.Custom({ name: typePartSnapshotName, parameterList: [] }),
      },
    ]),
  },
];
