import {
  Maybe,
  Type,
  CustomTypeDefinition,
  CustomTypeDefinitionBody,
} from "@narumincho/type/distribution/data";
import * as idAndToken from "./idAndToken";
import * as customType from "./customType";
import * as name from "./name";

export const customTypeList: ReadonlyArray<CustomTypeDefinition> = [
  {
    name: name.suggestionSnapshot,
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
        type: customType.suggestionStateType,
      },
      {
        name: "changeList",
        description: "変更",
        type: Type.List(customType.changeType),
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
        type: customType.time,
      },
      {
        name: "getTime",
        description: "取得日時",
        type: customType.time,
      },
    ]),
  },
  {
    name: name.suggestionSnapshotAndId,
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
        type: customType.suggestionSnapshotType,
      },
    ]),
  },
  {
    name: name.suggestionResponse,
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
        type: Type.Maybe(customType.suggestionSnapshotType),
      },
    ]),
  },
  {
    name: name.suggestionState,
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
    name: name.change,
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
        parameter: Maybe.Just(customType.addPartType),
      },
    ]),
  },
  {
    name: name.addPart,
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
        type: customType.suggestionTypeType,
      },
      {
        name: "expr",
        description: "新しいパーツの式",
        type: customType.suggestionExprType,
      },
    ]),
  },
  {
    name: name.suggestionType,
    description: "ChangeのAddPartなどで使われる提案で作成した型を使えるType",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "Function",
        description: "関数",
        parameter: Maybe.Just(customType.suggestionTypeInputAndOutputType),
      },
      {
        name: "TypePartWithParameter",
        description: "提案前に作られた型パーツとパラメーター",
        parameter: Maybe.Just(
          customType.typePartWithSuggestionTypeParameterType
        ),
      },
      {
        name: "SuggestionTypePartWithParameter",
        description: "提案時に作られた型パーツとパラメーター",
        parameter: Maybe.Just(
          customType.suggestionTypePartWithSuggestionTypeParameterType
        ),
      },
    ]),
  },
  {
    name: name.suggestionTypeInputAndOutput,
    description: "",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "inputType",
        description: "入力の型",
        type: customType.suggestionTypeType,
      },
      {
        name: "outputType",
        description: "出力の型",
        type: customType.suggestionTypeType,
      },
    ]),
  },
  {
    name: name.typePartWithSuggestionTypeParameter,
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
        type: Type.List(customType.suggestionTypeType),
      },
    ]),
  },
  {
    name: name.suggestionTypePartWithSuggestionTypeParameter,
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
        type: Type.List(customType.suggestionTypeType),
      },
    ]),
  },
  {
    name: name.suggestionExpr,
    description: "提案時に含まれるパーツを参照できる式",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "Kernel",
        description: "Definyだけでは表現できない式",
        parameter: Maybe.Just(customType.kernelExprType),
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
        parameter: Maybe.Just(customType.localPartReferenceType),
      },
      {
        name: "TagReference",
        description: "タグを参照",
        parameter: Maybe.Just(customType.TagReferenceType),
      },
      {
        name: "SuggestionTagReference",
        description: "提案内で定義された型のタグ",
        parameter: Maybe.Just(customType.suggestionTagReferenceType),
      },
      {
        name: "FunctionCall",
        description: "関数呼び出し (中に含まれる型はSuggestionExpr)",
        parameter: Maybe.Just(customType.suggestionFunctionCallType),
      },
      {
        name: "Lambda",
        description: "ラムダ",
        parameter: Maybe.Just(Type.List(customType.suggestionLambdaBranchType)),
      },
      {
        name: "Blank",
        description: "空白",
        parameter: Maybe.Nothing(),
      },
    ]),
  },
  {
    name: name.suggestionTagReference,
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
    name: name.suggestionFunctionCall,
    description: "関数呼び出し (中に含まれる型はSuggestionExpr)",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "function",
        description: "関数",
        type: customType.suggestionExprType,
      },
      {
        name: "parameter",
        description: "パラメーター",
        type: customType.suggestionExprType,
      },
    ]),
  },
  {
    name: name.suggestionLambdaBranch,
    description: "suggestionExprの入ったLambdaBranch",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "condition",
        description: "入力値の条件を書くところ",
        type: customType.conditionType,
      },
      {
        name: "description",
        description: "ブランチの説明",
        type: Type.String,
      },
      {
        name: "localPartList",
        description: "",
        type: Type.List(customType.suggestionBranchPartDefinitionType),
      },
      {
        name: "expr",
        description: "式",
        type: customType.suggestionExprType,
      },
    ]),
  },
  {
    name: name.suggestionBranchPartDefinition,
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
        type: customType.suggestionTypeType,
      },
      {
        name: "expr",
        description: "ローカルパーツの式",
        type: customType.suggestionExprType,
      },
    ]),
  },
  {
    name: name.typePartSnapshot,
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
        type: customType.time,
      },
      {
        name: "body",
        description: "定義本体",
        type: customType.typePartBodyType,
      },
    ]),
  },
  {
    name: name.partSnapshot,
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
        type: customType.typeType,
      },
      {
        name: "expr",
        description: "パーツの式",
        type: customType.exprType,
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
        type: customType.time,
      },
    ]),
  },
  {
    name: name.typePartBody,
    description: "型の定義本体",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "Product",
        description: "直積型",
        parameter: Maybe.Just(Type.List(customType.memberType)),
      },
      {
        name: "Sum",
        description: "直和型",
        parameter: Maybe.Just(Type.List(customType.patternType)),
      },
      {
        name: "Kernel",
        description: "Definyだけでは表現できないデータ型",
        parameter: Maybe.Just(customType.typePartBodyKernelType),
      },
    ]),
  },
  {
    name: name.member,
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
        type: customType.typeType,
      },
    ]),
  },
  {
    name: name.pattern,
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
        type: Type.Maybe(customType.typeType),
      },
    ]),
  },
  {
    name: name.typePartBodyKernel,
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
    name: name.type,
    description: "型",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "Function",
        description: "関数",
        parameter: Maybe.Just(customType.typeInputAndOutputType),
      },
      {
        name: "TypePartWithParameter",
        description: "型パーツと, パラメーターのリスト",
        parameter: Maybe.Just(customType.typePartIdWithParameterType),
      },
    ]),
  },
  {
    name: name.typeInputAndOutput,
    description: "",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "inputType",
        description: "入力の型",
        type: customType.typeType,
      },
      {
        name: "outputType",
        description: "出力の型",
        type: customType.typeType,
      },
    ]),
  },
  {
    name: name.typePartIdWithParameter,
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
        type: Type.List(customType.typeType),
      },
    ]),
  },
  {
    name: name.expr,
    description: "式",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "Kernel",
        description: "Definyだけでは表現できない式",
        parameter: Maybe.Just(customType.kernelExprType),
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
        parameter: Maybe.Just(customType.localPartReferenceType),
      },
      {
        name: "TagReference",
        description: "タグを参照",
        parameter: Maybe.Just(customType.TagReferenceType),
      },
      {
        name: "FunctionCall",
        description: "関数呼び出し",
        parameter: Maybe.Just(customType.functionCallType),
      },
      {
        name: "Lambda",
        description: "ラムダ",
        parameter: Maybe.Just(Type.List(customType.lambdaBranchType)),
      },
    ]),
  },
  {
    name: name.evaluatedExpr,
    description: "評価しきった式",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "Kernel",
        description: "Definyだけでは表現できない式",
        parameter: Maybe.Just(customType.kernelExprType),
      },
      {
        name: "Int32",
        description: "32bit整数",
        parameter: Maybe.Just(Type.Int32),
      },
      {
        name: "LocalPartReference",
        description: "ローカルパーツの参照",
        parameter: Maybe.Just(customType.localPartReferenceType),
      },
      {
        name: "TagReference",
        description: "タグを参照",
        parameter: Maybe.Just(customType.TagReferenceType),
      },
      {
        name: "Lambda",
        description: "ラムダ",
        parameter: Maybe.Just(Type.List(customType.lambdaBranchType)),
      },
      {
        name: "KernelCall",
        description: "内部関数呼び出し",
        parameter: Maybe.Just(customType.kernelCallType),
      },
    ]),
  },
  {
    name: name.kernelCall,
    description: "複数の引数が必要な内部関数の部分呼び出し",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "kernel",
        description: "関数",
        type: customType.kernelExprType,
      },
      {
        name: "expr",
        description: "呼び出すパラメーター",
        type: customType.evaluatedExprType,
      },
    ]),
  },
  {
    name: name.kernelExpr,
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
    name: name.localPartReference,
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
    name: name.tagReference,
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
    name: name.functionCall,
    description: "関数呼び出し",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "function",
        description: "関数",
        type: customType.exprType,
      },
      {
        name: "parameter",
        description: "パラメーター",
        type: customType.exprType,
      },
    ]),
  },
  {
    name: name.lambdaBranch,
    description: "ラムダのブランチ. Just x -> data x のようなところ",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "condition",
        description: "入力値の条件を書くところ. Just x",
        type: customType.conditionType,
      },
      {
        name: "description",
        description: "ブランチの説明",
        type: Type.String,
      },
      {
        name: "localPartList",
        description: "",
        type: Type.List(customType.branchPartDefinitionType),
      },
      {
        name: "expr",
        description: "式",
        type: customType.exprType,
      },
    ]),
  },
  {
    name: name.condition,
    description: "ブランチの式を使う条件",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "ByTag",
        description: "タグ",
        parameter: Maybe.Just(customType.conditionTagType),
      },
      {
        name: "ByCapture",
        description: "キャプチャパーツへのキャプチャ",
        parameter: Maybe.Just(customType.conditionCaptureType),
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
    name: name.conditionTag,
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
        type: Type.Maybe(customType.conditionType),
      },
    ]),
  },
  {
    name: name.conditionCapture,
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
    name: name.branchPartDefinition,
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
        type: customType.typeType,
      },
      {
        name: "expr",
        description: "ローカルパーツの式",
        type: customType.exprType,
      },
    ]),
  },
  {
    name: name.evaluateExprError,
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
        parameter: Maybe.Just(customType.localPartReferenceType),
      },
      {
        name: "TypeError",
        description: "型が合わない",
        parameter: Maybe.Just(customType.typeErrorType),
      },
      {
        name: "NotSupported",
        description: "まだサポートしていないものが含まれている",
        parameter: Maybe.Nothing(),
      },
    ]),
  },
  {
    name: name.typeError,
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
    name: name.evalParameter,
    description: "評価する上で必要なソースコード",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "partList",
        description: "パーツのリスト",
        type: Type.List(
          Type.Custom({ name: name.partWith, parameterList: [] })
        ),
      },
      {
        name: "typePartList",
        description: "型パーツのリスト",
        type: Type.List(
          Type.Custom({ name: name.typePartWithId, parameterList: [] })
        ),
      },
      {
        name: "changeList",
        description: "変更点",
        type: Type.List(customType.changeType),
      },
      {
        name: "expr",
        description: "評価してほしい式",
        type: customType.suggestionExprType,
      },
    ]),
  },
  {
    name: name.partWith,
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
        type: Type.Custom({ name: name.partSnapshot, parameterList: [] }),
      },
    ]),
  },
  {
    name: name.typePartWithId,
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
        type: Type.Custom({
          name: name.typePartSnapshot,
          parameterList: [],
        }),
      },
    ]),
  },
];
