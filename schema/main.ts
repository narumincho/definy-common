import * as nt from "@narumincho/type";
import { type } from "@narumincho/type";
import * as codeGen from "js-ts-code-generator";
import * as fs from "fs";
import * as childProcess from "child_process";
import * as prettier from "prettier";

const accessToken = type.typeToken("AccessToken");
const userId = type.typeId("UserId");
const projectId = type.typeId("ProjectId");
const ideaId = type.typeId("IdeaId");
const fileHash = type.typeToken("FileHash");
const moduleId = type.typeId("ModuleId");
const typeId = type.typeId("TypeId");
const tagId = type.typeId("TagId");
const partId = type.typeId("PartId");
const localPartId = type.typeId("LocalPartId");

const timeName = "Time";
const requestLogInUrlRequestDataName = "RequestLogInUrlRequestData";
const openIdConnectProviderName = "OpenIdConnectProvider";
const urlDataName = "UrlData";
const clientModeName = "ClientMode";
const locationName = "Location";
const languageName = "Language";

const userSnapshotName = "UserSnapshot";
const userSnapshotAndIdName = "UserSnapshotAndId";

const projectSnapshotName = "ProjectSnapshot";
const projectSnapshotAndIdName = "ProjectSnapshotAndId";

const ideaSnapshotName = "IdeaSnapshot";
const ideaSnapshotAndIdName = "IdeaSnapshotAndId";

const ideaItemName = "IdeaItem";
const commentName = "Comment";
const suggestionName = "Suggestion";
const changeName = "Change";
const moduleName = "Module";
const typeDefinitionName = "TypeDefinition";
const partDefinitionName = "PartDefinition";
const typeBodyName = "TypeBody";
const typeBodyProductMemberName = "TypeBodyProductMember";
const typeBodySumPatternName = "TypeBodySumPattern";
const typeBodyKernelName = "TypeBodyKernel";
const typeName = "Type";
const exprName = "Expr";
const evaluatedExprName = "EvaluatedExpr";
const kernelCallName = "KernelCall";
const kernelExprName = "KernelExpr";
const localPartReferenceName = "LocalPartReference";
const tagReferenceName = "TagReferenceIndex";
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

const accessTokenErrorName = "AccessTokenError";

const projectResponseName = "ProjectResponse";
const userResponseName = "UserResponse";
const ideaResponseName = "IdeaResponse";
const IdeaListByProjectIdResponseName = "IdeaListByProjectIdResponse";

const listCustomType: ReadonlyArray<type.CustomType> = [
  {
    name: timeName,
    description:
      "日時. 0001-01-01T00:00:00.000Z to 9999-12-31T23:59:59.999Z 最小単位はミリ秒. ミリ秒の求め方は day*1000*60*60*24 + millisecond",
    body: type.customTypeBodyProduct([
      {
        name: "day",
        description: "1970-01-01からの経過日数. マイナスになることもある",
        memberType: type.typeInt32,
      },
      {
        name: "millisecond",
        description: "日にちの中のミリ秒. 0 to 86399999 (=1000*60*60*24-1)",
        memberType: type.typeInt32,
      },
    ]),
  },
  {
    name: requestLogInUrlRequestDataName,
    description: "ログインのURLを発行するために必要なデータ",
    body: type.customTypeBodyProduct([
      {
        name: "openIdConnectProvider",
        description: "ログインに使用するプロバイダー",
        memberType: type.typeCustom(openIdConnectProviderName),
      },
      {
        name: "urlData",
        description: "ログインした後に返ってくるURLに必要なデータ",
        memberType: type.typeCustom(urlDataName),
      },
    ]),
  },
  {
    name: openIdConnectProviderName,
    description:
      "ソーシャルログインを提供するプロバイダー (例: Google, GitHub)",
    body: type.customTypeBodySum([
      {
        name: "Google",
        description:
          "Google ( https://developers.google.com/identity/sign-in/web/ )",
        parameter: type.maybeNothing(),
      },
      {
        name: "GitHub",
        description:
          "GitHub ( https://developer.github.com/v3/guides/basics-of-authentication/ )",
        parameter: type.maybeNothing(),
      },
    ]),
  },
  {
    name: urlDataName,
    description:
      "デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語を入れて,言語ごとに別のURLである必要がある. デバッグ時のホスト名は http://localhost になる",
    body: type.customTypeBodyProduct([
      {
        name: "clientMode",
        description: "クライアントモード",
        memberType: type.typeCustom(clientModeName),
      },
      {
        name: "location",
        description: "場所",
        memberType: type.typeCustom(locationName),
      },
      {
        name: "language",
        description: "言語",
        memberType: type.typeCustom(languageName),
      },
    ]),
  },
  {
    name: clientModeName,
    description: "デバッグモードか, リリースモード",
    body: type.customTypeBodySum([
      {
        name: "DebugMode",
        description: "デバッグモード. オリジンは http://localshot:2520",
        parameter: type.maybeNothing(),
      },
      {
        name: "Release",
        description: "リリースモード. オリジンは https://definy.app ",
        parameter: type.maybeNothing(),
      },
    ]),
  },
  {
    name: locationName,
    description:
      "DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる",
    body: type.customTypeBodySum([
      {
        name: "Home",
        description: "最初のページ",
        parameter: type.maybeNothing(),
      },
      {
        name: "CreateProject",
        description: "プロジェクト作成画面",
        parameter: type.maybeNothing(),
      },
      {
        name: "CreateIdea",
        description:
          "アイデア作成ページ. パラメーターのprojectIdは対象のプロジェクト",
        parameter: type.maybeJust(projectId),
      },
      {
        name: "User",
        description: "ユーザーの詳細ページ",
        parameter: type.maybeJust(userId),
      },
      {
        name: "Project",
        description: "プロジェクトの詳細ページ",
        parameter: type.maybeJust(projectId),
      },
      {
        name: "Idea",
        description: "アイデア詳細ページ",
        parameter: type.maybeJust(ideaId),
      },
    ]),
  },
  {
    name: languageName,
    description: "英語,日本語,エスペラント語などの言語",
    body: type.customTypeBodySum([
      {
        name: "Japanese",
        description: "日本語",
        parameter: type.maybeNothing(),
      },
      {
        name: "English",
        description: "英語",
        parameter: type.maybeNothing(),
      },
      {
        name: "Esperanto",
        description: "エスペラント語",
        parameter: type.maybeNothing(),
      },
    ]),
  },
  {
    name: userSnapshotName,
    description: "ユーザーのデータのスナップショット",
    body: type.customTypeBodyProduct([
      {
        name: "name",
        description:
          "ユーザー名. 表示される名前. 他のユーザーとかぶっても良い. 絵文字も使える. 全角英数は半角英数,半角カタカナは全角カタカナ, (株)の合字を分解するなどのNFKCの正規化がされる. U+0000-U+0019 と U+007F-U+00A0 の範囲の文字は入らない. 前後に空白を含められない. 間の空白は2文字以上連続しない. 文字数のカウント方法は正規化されたあとのCodePoint単位. Twitterと同じ, 1文字以上50文字以下",
        memberType: type.typeString,
      },
      {
        name: "imageHash",
        description: "プロフィール画像",
        memberType: fileHash,
      },
      {
        name: "introduction",
        description:
          "自己紹介文. 改行文字を含めることができる. Twitterと同じ 0～160文字",
        memberType: type.typeString,
      },
      {
        name: "createTime",
        description: "Definyでユーザーが作成された日時",
        memberType: type.typeCustom(timeName),
      },
      {
        name: "likeProjectIdList",
        description: "プロジェクトに対する いいね",
        memberType: type.typeList(projectId),
      },
      {
        name: "developProjectIdList",
        description: "開発に参加した (書いたコードが使われた) プロジェクト",
        memberType: type.typeList(projectId),
      },
      {
        name: "commentIdeaIdList",
        description: "コメントをしたアイデア",
        memberType: type.typeList(ideaId),
      },
      {
        name: "getTime",
        description: "取得日時",
        memberType: type.typeCustom(timeName),
      },
    ]),
  },
  {
    name: userSnapshotAndIdName,
    description: "最初に自分の情報を得るときに返ってくるデータ",
    body: type.customTypeBodyProduct([
      {
        name: "id",
        description: "ユーザーID",
        memberType: userId,
      },
      {
        name: "snapshot",
        description: "ユーザーのスナップショット",
        memberType: type.typeCustom(userSnapshotName),
      },
    ]),
  },
  {
    name: projectSnapshotName,
    description: "プロジェクト",
    body: type.customTypeBodyProduct([
      {
        name: "name",
        description: "プロジェクト名",
        memberType: type.typeString,
      },
      {
        name: "iconHash",
        description: "プロジェクトのアイコン画像",
        memberType: fileHash,
      },
      {
        name: "imageHash",
        description: "プロジェクトのカバー画像",
        memberType: fileHash,
      },
      {
        name: "createTime",
        description: "作成日時",
        memberType: type.typeCustom(timeName),
      },
      {
        name: "createUser",
        description: "作成アカウント",
        memberType: userId,
      },
      {
        name: "updateTime",
        description: "更新日時",
        memberType: type.typeCustom(timeName),
      },
      {
        name: "getTime",
        description: "取得日時",
        memberType: type.typeCustom(timeName),
      },
    ]),
  },
  {
    name: projectSnapshotAndIdName,
    description: "プロジェクトを作成したときに返ってくるデータ",
    body: type.customTypeBodyProduct([
      {
        name: "id",
        description: "プロジェクトID",
        memberType: projectId,
      },
      {
        name: "snapshot",
        description: "プロジェクトのスナップショット",
        memberType: type.typeCustom(projectSnapshotName),
      },
    ]),
  },
  {
    name: ideaSnapshotName,
    description: "アイデア",
    body: type.customTypeBodyProduct([
      {
        name: "name",
        description: "アイデア名",
        memberType: type.typeString,
      },
      {
        name: "createUser",
        description: "言い出しっぺ",
        memberType: userId,
      },
      {
        name: "createTime",
        description: "作成日時",
        memberType: type.typeCustom(timeName),
      },
      {
        name: "projectId",
        description: "対象のプロジェクト",
        memberType: projectId,
      },
      {
        name: "itemList",
        description: "アイデアの要素",
        memberType: type.typeList(type.typeCustom(ideaItemName)),
      },
      {
        name: "updateTime",
        description: "更新日時",
        memberType: type.typeCustom(timeName),
      },
      {
        name: "getTime",
        description: "取得日時",
        memberType: type.typeCustom(timeName),
      },
    ]),
  },
  {
    name: ideaSnapshotAndIdName,
    description: "アイデアとそのID. アイデア作成時に返ってくる",
    body: type.customTypeBodyProduct([
      {
        name: "id",
        description: "アイデアID",
        memberType: ideaId,
      },
      {
        name: "snapshot",
        description: "アイデアのスナップショット",
        memberType: type.typeCustom(ideaSnapshotName),
      },
    ]),
  },
  {
    name: ideaItemName,
    description: "アイデアのコメント",
    body: type.customTypeBodySum([
      {
        name: "Comment",
        description: "文章でのコメント",
        parameter: type.maybeJust(type.typeCustom(commentName)),
      },
      {
        name: "Suggestion",
        description: "編集提案をする",
        parameter: type.maybeJust(type.typeCustom(suggestionName)),
      },
    ]),
  },
  {
    name: commentName,
    description: "文章でのコメント",
    body: type.customTypeBodyProduct([
      {
        name: "body",
        description: "本文",
        memberType: type.typeString,
      },
      {
        name: "createUserId",
        description: "作成者",
        memberType: userId,
      },
      {
        name: "createTime",
        description: "作成日時",
        memberType: type.typeCustom(timeName),
      },
    ]),
  },
  {
    name: suggestionName,
    description: "編集提案",
    body: type.customTypeBodyProduct([
      {
        name: "createTime",
        description: "アイデアに投稿した日時",
        memberType: type.typeCustom(timeName),
      },
      {
        name: "description",
        description: "なぜ,どんな変更をしたのかの説明",
        memberType: type.typeString,
      },
      {
        name: "change",
        description: "変更点",
        memberType: type.typeCustom(changeName),
      },
    ]),
  },
  {
    name: changeName,
    description: "変更点",
    body: type.customTypeBodySum([
      {
        name: "ProjectName",
        description: "プロジェクト名の変更",
        parameter: type.maybeJust(type.typeString),
      },
    ]),
  },
  {
    name: moduleName,
    description: "モジュール",
    body: type.customTypeBodyProduct([
      {
        name: "name",
        description: "モジュール名.階層構造を表現することができる",
        memberType: type.typeList(type.typeString),
      },
      {
        name: "description",
        description: "モジュールの説明",
        memberType: type.typeString,
      },
      {
        name: "export",
        description: "外部のプロジェクトに公開するかどうか",
        memberType: type.typeBool,
      },
    ]),
  },
  {
    name: typeDefinitionName,
    description: "型の定義",
    body: type.customTypeBodyProduct([
      {
        name: "name",
        description: "型の名前",
        memberType: type.typeString,
      },
      {
        name: "parentList",
        description: "この型の元",
        memberType: type.typeList(partId),
      },
      {
        name: "description",
        description: "型の説明",
        memberType: type.typeString,
      },
    ]),
  },
  {
    name: partDefinitionName,
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
        memberType: type.typeList(partId),
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
        name: "moduleId",
        description: "所属しているモジュール",
        memberType: moduleId,
      },
    ]),
  },
  {
    name: typeBodyName,
    description: "型の定義本体",
    body: type.customTypeBodySum([
      {
        name: "Product",
        description: "直積型",
        parameter: type.maybeJust(
          type.typeList(type.typeCustom(typeBodyProductMemberName))
        ),
      },
      {
        name: "Sum",
        description: "直和型",
        parameter: type.maybeJust(
          type.typeList(type.typeCustom(typeBodySumPatternName))
        ),
      },
      {
        name: "Kernel",
        description: "Definyだけでは表現できないデータ型",
        parameter: type.maybeJust(type.typeCustom(typeBodyKernelName)),
      },
    ]),
  },
  {
    name: typeBodyProductMemberName,
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
        memberType: typeId,
      },
    ]),
  },
  {
    name: typeBodySumPatternName,
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
        memberType: type.typeMaybe(typeId),
      },
    ]),
  },
  {
    name: typeBodyKernelName,
    description: "Definyだけでは表現できないデータ型",
    body: type.customTypeBodySum([
      {
        name: "Function",
        description: "関数",
        parameter: type.maybeNothing(),
      },
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
    name: "Type",
    description: "型",
    body: type.customTypeBodyProduct([
      {
        name: "reference",
        description: "型の参照",
        memberType: typeId,
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
        parameter: type.maybeJust(partId),
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
        memberType: partId,
      },
      {
        name: "localPartId",
        description: "ローカルパーツID",
        memberType: localPartId,
      },
    ]),
  },
  {
    name: tagReferenceName,
    description: "タグの参照を表す",
    body: type.customTypeBodyProduct([
      {
        name: "typeId",
        description: "型ID",
        memberType: typeId,
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
        memberType: tagId,
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
        memberType: localPartId,
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
        memberType: localPartId,
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
        parameter: type.maybeJust(partId),
      },
      {
        name: "PartExprIsNothing",
        description: "パーツの式が空だと言っている",
        parameter: type.maybeJust(partId),
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
        memberType: accessToken,
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
        memberType: accessToken,
      },
      {
        name: "ideaName",
        description: "アイデア名",
        memberType: type.typeString,
      },
      {
        name: "projectId",
        description: "対象のプロジェクトID",
        memberType: projectId,
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
        memberType: accessToken,
      },
      {
        name: "ideaId",
        description: "コメントを追加するアイデア",
        memberType: ideaId,
      },
      {
        name: "comment",
        description: "コメント本文",
        memberType: type.typeString,
      },
    ]),
  },
  {
    name: accessTokenErrorName,
    description: "アクセストークンに関するエラー",
    body: type.customTypeBodySum([
      {
        name: "AccessTokenExpiredOrInvalid",
        description: "アクセストークンが期限切れまたは無効です",
        parameter: type.maybeNothing(),
      },
      {
        name: "ProjectNameIsInvalid",
        description:
          "指定したプロジェクト名から使えない文字をとったら何も残りませんでした",
        parameter: type.maybeNothing(),
      },
    ]),
  },
  {
    name: projectResponseName,
    description:
      "Maybe プロジェクトのスナップショット と projectId. indexedDBからElmに渡す用",
    body: type.customTypeBodyProduct([
      {
        name: "id",
        description: "プロジェクトのID",
        memberType: projectId,
      },
      {
        name: "snapshotMaybe",
        description: "プロジェクトのデータ",
        memberType: type.typeMaybe(type.typeCustom(projectSnapshotName)),
      },
    ]),
  },
  {
    name: userResponseName,
    description:
      "Maybe プロジェクトのスナップショット と userId. indexedDBからElmに渡す用",
    body: type.customTypeBodyProduct([
      {
        name: "id",
        description: "ユーザーID",
        memberType: userId,
      },
      {
        name: "snapshotMaybe",
        description: "ユーザーのデータ",
        memberType: type.typeMaybe(type.typeCustom(userSnapshotName)),
      },
    ]),
  },
  {
    name: ideaResponseName,
    description: "Maybe アイデア と ideaId. indexedDBからElmに渡す用",
    body: type.customTypeBodyProduct([
      {
        name: "id",
        description: "アイデアID",
        memberType: ideaId,
      },
      {
        name: "snapshotMaybe",
        description: "アイデアのスナップショット",
        memberType: type.typeMaybe(type.typeCustom(ideaSnapshotName)),
      },
    ]),
  },
  {
    name: IdeaListByProjectIdResponseName,
    description: "プロジェクトからアイデアの一覧を取得したときにElmに渡すもの",
    body: type.customTypeBodyProduct([
      {
        name: "projectId",
        description: "プロジェクトID",
        memberType: projectId,
      },
      {
        name: "ideaSnapshotAndIdList",
        description: "アイデアの一覧",
        memberType: type.typeList(type.typeCustom(ideaSnapshotAndIdName)),
      },
    ]),
  },
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
