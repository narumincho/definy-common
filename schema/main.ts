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
const userName = "User";
const userAndUserIdName = "UserAndUserId";
const projectName = "Project";
const projectAndProjectIdName = "ProjectAndProjectId";
const ideaName = "Idea";
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
const accessTokenErrorName = "AccessTokenError";
const projectCacheName = "ProjectCache";
const userCacheName = "UserCache";
const projectCacheWithIdName = "ProjectCacheWithId";
const userCacheWithIdName = "UserCacheWithId";

const time: type.CustomType = {
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
};

const requestLogInUrlRequestData: type.CustomType = {
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
};

const openIdConnectProvider: type.CustomType = {
  name: openIdConnectProviderName,
  description: "プロバイダー (例: LINE, Google, GitHub)",
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
};

const urlData: type.CustomType = {
  name: urlDataName,
  description:
    "デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語のを入れて,言語ごとに別のURLである必要がある. デバッグ時のホスト名は http://[::1] になる",
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
    {
      name: "accessToken",
      description:
        "アクセストークン. ログインした後のリダイレクト先としてサーバーから渡される",
      memberType: type.typeMaybe(accessToken),
    },
  ]),
};

const clientMode: type.CustomType = {
  name: clientModeName,
  description: "デバッグの状態と, デバッグ時ならアクセスしているポート番号",
  body: type.customTypeBodySum([
    {
      name: "DebugMode",
      description:
        "デバッグモード. ポート番号を保持する. オリジンは http://[::1]:2520 のようなもの",
      parameter: type.maybeJust(type.typeInt32),
    },
    {
      name: "Release",
      description: "リリースモード. https://definy.app ",
      parameter: type.maybeNothing(),
    },
  ]),
};

const location: type.CustomType = {
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
      name: "User",
      description: "ユーザーの詳細ページ",
      parameter: type.maybeJust(type.typeId("UserId")),
    },
    {
      name: "Project",
      description: "プロジェクトの詳細ページ",
      parameter: type.maybeJust(type.typeId("ProjectId")),
    },
  ]),
};

const language: type.CustomType = {
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
};

const user: type.CustomType = {
  name: userName,
  description: "ユーザーが公開している情報",
  body: type.customTypeBodyProduct([
    {
      name: "name",
      description:
        "ユーザー名. 表示される名前。他のユーザーとかぶっても良い. 絵文字も使える. 全角英数は半角英数,半角カタカナは全角カタカナ, (株)の合字を分解するなどのNFKCの正規化がされる. U+0000-U+0019 と U+007F-U+00A0 の範囲の文字は入らない. 前後に空白を含められない. 間の空白は2文字以上連続しない. 文字数のカウント方法は正規化されたあとのCodePoint単位. Twitterと同じ、1文字以上50文字以下",
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
      name: "createdAt",
      description: "ユーザーが作成された日時",
      memberType: type.typeCustom(timeName),
    },
    {
      name: "likedProjectIdList",
      description: "プロジェクトに対する いいね",
      memberType: type.typeList(projectId),
    },
    {
      name: "developedProjectIdList",
      description: "開発に参加した (書いたコードが使われた) プロジェクト",
      memberType: type.typeList(projectId),
    },
    {
      name: "commentedIdeaIdList",
      description: "コメントをしたアイデア",
      memberType: type.typeList(ideaId),
    },
  ]),
};

const userAndUserId: type.CustomType = {
  name: userAndUserIdName,
  description: "最初に自分の情報を得るときに返ってくるデータ",
  body: type.customTypeBodyProduct([
    {
      name: "userId",
      description: "ユーザーID",
      memberType: userId,
    },
    {
      name: "user",
      description: "ユーザーのデータ",
      memberType: type.typeCustom(userName),
    },
  ]),
};

const project: type.CustomType = {
  name: projectName,
  description: "プロジェクト",
  body: type.customTypeBodyProduct([
    {
      name: "name",
      description: "プロジェクト名",
      memberType: type.typeString,
    },
    {
      name: "icon",
      description: "プロジェクトのアイコン画像",
      memberType: fileHash,
    },
    {
      name: "image",
      description: "プロジェクトのカバー画像",
      memberType: fileHash,
    },
    {
      name: "createdAt",
      description: "作成日時",
      memberType: type.typeCustom(timeName),
    },
    {
      name: "createdBy",
      description: "作成アカウント",
      memberType: userId,
    },
  ]),
};

const projectAndProjectId: type.CustomType = {
  name: projectAndProjectIdName,
  description: "プロジェクトを作成したときに返ってくるデータ",
  body: type.customTypeBodyProduct([
    {
      name: "projectId",
      description: "プロジェクトID",
      memberType: projectId,
    },
    {
      name: "project",
      description: "プロジェクトのデータ",
      memberType: type.typeCustom(projectName),
    },
  ]),
};

const idea: type.CustomType = {
  name: ideaName,
  description: "アイデア",
  body: type.customTypeBodyProduct([
    {
      name: "name",
      description: "アイデア名",
      memberType: type.typeString,
    },
    {
      name: "createdBy",
      description: "言い出しっぺ",
      memberType: userId,
    },
    {
      name: "createdAt",
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
  ]),
};

const ideaItem: type.CustomType = {
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
};

const ideaCommentText: type.CustomType = {
  name: commentName,
  description: "文章でのコメント",
  body: type.customTypeBodyProduct([
    {
      name: "body",
      description: "本文",
      memberType: type.typeString,
    },
    {
      name: "createdBy",
      description: "作成者",
      memberType: userId,
    },
    {
      name: "createdAt",
      description: "作成日時",
      memberType: type.typeCustom(timeName),
    },
  ]),
};

const suggestion: type.CustomType = {
  name: suggestionName,
  description: "編集提案",
  body: type.customTypeBodyProduct([
    {
      name: "createdAt",
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
};

const change: type.CustomType = {
  name: changeName,
  description: "変更点",
  body: type.customTypeBodySum([
    {
      name: "ProjectName",
      description: "プロジェクト名の変更",
      parameter: type.maybeJust(type.typeString),
    },
  ]),
};

const module_: type.CustomType = {
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
};

const typeDefinition: type.CustomType = {
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
};

const partDefinition: type.CustomType = {
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
};

const typeBody: type.CustomType = {
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
};

const typeBodyProductMember: type.CustomType = {
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
};

const typeBodySumPattern: type.CustomType = {
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
};

const typeBodyKernel: type.CustomType = {
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
};

const type_: type.CustomType = {
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
};

const expr: type.CustomType = {
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
};

const evaluatedExpr: type.CustomType = {
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
};

const kernelCall: type.CustomType = {
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
};

const kernelExpr: type.CustomType = {
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
};

const localPartReference: type.CustomType = {
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
};

const tagReference: type.CustomType = {
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
};

const functionCall: type.CustomType = {
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
};

const lambdaBranch: type.CustomType = {
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
};

const condition: type.CustomType = {
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
};

const conditionTag: type.CustomType = {
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
};

const conditionCapture: type.CustomType = {
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
};

const branchPartDefinition: type.CustomType = {
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
};

const evaluateExprError: type.CustomType = {
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
};

const typeError: type.CustomType = {
  name: typeErrorName,
  description: "型エラー",
  body: type.customTypeBodyProduct([
    {
      name: "message",
      description: "型エラーの説明",
      memberType: type.typeString,
    },
  ]),
};

const createProjectParameter: type.CustomType = {
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
};

const createProjectError: type.CustomType = {
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
};

const projectCache: type.CustomType = {
  name: projectCacheName,
  description: "indexDBに格納したりする取得日時も含めたProject",
  body: type.customTypeBodyProduct([
    {
      name: "project",
      description: "プロジェクト",
      memberType: type.typeCustom(projectName),
    },
    {
      name: "respondTime",
      description: "取得日時",
      memberType: type.typeCustom(timeName),
    },
  ]),
};

const userCache: type.CustomType = {
  name: userCacheName,
  description: "indexDBに格納したりする取得日も含めたUser",
  body: type.customTypeBodyProduct([
    {
      name: "user",
      description: "ユーザーのデータ",
      memberType: type.typeCustom(userName),
    },
    {
      name: "respondTime",
      description: "取得日時",
      memberType: type.typeCustom(timeName),
    },
  ]),
};

const projectCacheWithId: type.CustomType = {
  name: projectCacheWithIdName,
  description: "プロジェクトのキャッシュデータとID. indexedDBからElmに渡す用",
  body: type.customTypeBodyProduct([
    {
      name: "projectCache",
      description: "プロジェクトのデータ",
      memberType: type.typeMaybe(type.typeCustom(projectCacheName)),
    },
    {
      name: "projectId",
      description: "プロジェクトのID",
      memberType: projectId,
    },
  ]),
};

const userCacheWithId: type.CustomType = {
  name: userCacheWithIdName,
  description: "ユーザーのキャッシュデータとID. indexedDBからElmに渡す用",
  body: type.customTypeBodyProduct([
    {
      name: "userCache",
      description: "ユーザーのデータ",
      memberType: type.typeMaybe(type.typeCustom(userCacheName)),
    },
    {
      name: "userId",
      description: "ユーザーID",
      memberType: userId,
    },
  ]),
};

const listCustomType: ReadonlyArray<type.CustomType> = [
  time,
  clientMode,
  requestLogInUrlRequestData,
  openIdConnectProvider,
  urlData,
  language,
  location,
  user,
  userAndUserId,
  project,
  projectAndProjectId,
  idea,
  ideaItem,
  ideaCommentText,
  suggestion,
  change,
  module_,
  typeDefinition,
  typeBody,
  typeBodyProductMember,
  typeBodySumPattern,
  typeBodyKernel,
  partDefinition,
  type_,
  expr,
  evaluatedExpr,
  kernelCall,
  kernelExpr,
  localPartReference,
  tagReference,
  functionCall,
  lambdaBranch,
  condition,
  conditionTag,
  conditionCapture,
  branchPartDefinition,
  evaluateExprError,
  typeError,
  createProjectParameter,
  createProjectError,
  projectCache,
  userCache,
  projectCacheWithId,
  userCacheWithId,
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
