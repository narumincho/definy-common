import * as a from "util";

/**
 * Maybe
 */
export type Maybe<T> = { _: "Just"; value: T } | { _: "Nothing" };

/**
 * Result
 */
export type Result<ok, error> =
  | { _: "Ok"; ok: ok }
  | { _: "Error"; error: error };

/**
 * 日時. 0001-01-01T00:00:00.000Z to 9999-12-31T23:59:59.999Z 最小単位はミリ秒. ミリ秒の求め方は day*1000*60*60*24 + millisecond
 */
export type Time = {
  /**
   * 1970-01-01からの経過日数. マイナスになることもある
   */
  day: number;
  /**
   * 日にちの中のミリ秒. 0 to 86399999 (=1000*60*60*24-1)
   */
  millisecond: number;
};

/**
 * ログインのURLを発行するために必要なデータ
 */
export type RequestLogInUrlRequestData = {
  /**
   * ログインに使用するプロバイダー
   */
  openIdConnectProvider: OpenIdConnectProvider;
  /**
   * ログインした後に返ってくるURLに必要なデータ
   */
  urlData: UrlData;
};

/**
 * ソーシャルログインを提供するプロバイダー (例: Google, GitHub)
 */
export type OpenIdConnectProvider = "Google" | "GitHub";

/**
 * デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語を入れて,言語ごとに別のURLである必要がある. デバッグ時のホスト名は http://localhost になる
 */
export type UrlData = {
  /**
   * クライアントモード
   */
  clientMode: ClientMode;
  /**
   * 場所
   */
  location: Location;
  /**
   * 言語
   */
  language: Language;
};

/**
 * デバッグモードか, リリースモード
 */
export type ClientMode = "DebugMode" | "Release";

/**
 * DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる
 */
export type Location =
  | { _: "Home" }
  | { _: "CreateProject" }
  | { _: "CreateIdea"; projectId: ProjectId }
  | { _: "User"; userId: UserId }
  | { _: "Project"; projectId: ProjectId }
  | { _: "Idea"; ideaId: IdeaId }
  | { _: "Suggestion"; suggestionId: SuggestionId };

/**
 * 英語,日本語,エスペラント語などの言語
 */
export type Language = "Japanese" | "English" | "Esperanto";

/**
 * ユーザーのデータのスナップショット
 */
export type UserSnapshot = {
  /**
   * ユーザー名. 表示される名前. 他のユーザーとかぶっても良い. 絵文字も使える. 全角英数は半角英数,半角カタカナは全角カタカナ, (株)の合字を分解するなどのNFKCの正規化がされる. U+0000-U+0019 と U+007F-U+00A0 の範囲の文字は入らない. 前後に空白を含められない. 間の空白は2文字以上連続しない. 文字数のカウント方法は正規化されたあとのCodePoint単位. Twitterと同じ, 1文字以上50文字以下
   */
  name: string;
  /**
   * プロフィール画像
   */
  imageHash: FileHash;
  /**
   * 自己紹介文. 改行文字を含めることができる. Twitterと同じ 0～160文字
   */
  introduction: string;
  /**
   * Definyでユーザーが作成された日時
   */
  createTime: Time;
  /**
   * プロジェクトに対する いいね
   */
  likeProjectIdList: ReadonlyArray<ProjectId>;
  /**
   * 開発に参加した (書いたコードが使われた) プロジェクト
   */
  developProjectIdList: ReadonlyArray<ProjectId>;
  /**
   * コメントをしたアイデア
   */
  commentIdeaIdList: ReadonlyArray<IdeaId>;
  /**
   * 取得日時
   */
  getTime: Time;
};

/**
 * 最初に自分の情報を得るときに返ってくるデータ
 */
export type UserSnapshotAndId = {
  /**
   * ユーザーID
   */
  id: UserId;
  /**
   * ユーザーのスナップショット
   */
  snapshot: UserSnapshot;
};

/**
 * Maybe プロジェクトのスナップショット と userId. indexedDBからElmに渡す用
 */
export type UserResponse = {
  /**
   * ユーザーID
   */
  id: UserId;
  /**
   * ユーザーのデータ
   */
  snapshotMaybe: Maybe<UserSnapshot>;
};

/**
 * プロジェクト
 */
export type ProjectSnapshot = {
  /**
   * プロジェクト名
   */
  name: string;
  /**
   * プロジェクトのアイコン画像
   */
  iconHash: FileHash;
  /**
   * プロジェクトのカバー画像
   */
  imageHash: FileHash;
  /**
   * 作成日時
   */
  createTime: Time;
  /**
   * 作成アカウント
   */
  createUser: UserId;
  /**
   * 更新日時
   */
  updateTime: Time;
  /**
   * 取得日時
   */
  getTime: Time;
  /**
   * 所属しているのパーツのIDのリスト
   */
  partIdList: ReadonlyArray<PartId>;
  /**
   * 所属している型パーツのIDのリスト
   */
  typePartIdList: ReadonlyArray<TypePartId>;
};

/**
 * プロジェクトを作成したときに返ってくるデータ
 */
export type ProjectSnapshotAndId = {
  /**
   * プロジェクトID
   */
  id: ProjectId;
  /**
   * プロジェクトのスナップショット
   */
  snapshot: ProjectSnapshot;
};

/**
 * Maybe プロジェクトのスナップショット と projectId. indexedDBからElmに渡す用
 */
export type ProjectResponse = {
  /**
   * プロジェクトのID
   */
  id: ProjectId;
  /**
   * プロジェクトのデータ
   */
  snapshotMaybe: Maybe<ProjectSnapshot>;
};

/**
 * アイデア
 */
export type IdeaSnapshot = {
  /**
   * アイデア名
   */
  name: string;
  /**
   * 言い出しっぺ
   */
  createUser: UserId;
  /**
   * 作成日時
   */
  createTime: Time;
  /**
   * 対象のプロジェクト
   */
  projectId: ProjectId;
  /**
   * アイデアの要素
   */
  itemList: ReadonlyArray<IdeaItem>;
  /**
   * 更新日時
   */
  updateTime: Time;
  /**
   * 取得日時
   */
  getTime: Time;
};

/**
 * アイデアとそのID. アイデア作成時に返ってくる
 */
export type IdeaSnapshotAndId = {
  /**
   * アイデアID
   */
  id: IdeaId;
  /**
   * アイデアのスナップショット
   */
  snapshot: IdeaSnapshot;
};

/**
 * Maybe アイデア と ideaId. indexedDBからElmに渡す用
 */
export type IdeaResponse = {
  /**
   * アイデアID
   */
  id: IdeaId;
  /**
   * アイデアのスナップショット
   */
  snapshotMaybe: Maybe<IdeaSnapshot>;
};

/**
 * プロジェクトからアイデアの一覧を取得したときにElmに渡すもの
 */
export type IdeaListByProjectIdResponse = {
  /**
   * プロジェクトID
   */
  projectId: ProjectId;
  /**
   * アイデアの一覧
   */
  ideaSnapshotAndIdList: ReadonlyArray<IdeaSnapshotAndId>;
};

/**
 * アイデアのコメント
 */
export type IdeaItem = {
  /**
   * 作成者
   */
  createUserId: UserId;
  /**
   * 作成日時
   */
  createTime: Time;
  /**
   * 本文
   */
  body: ItemBody;
};

/**
 * アイデアのアイテム
 */
export type ItemBody =
  | { _: "Comment"; string_: string }
  | { _: "SuggestionCreate"; suggestionId: SuggestionId }
  | { _: "SuggestionToApprovalPending"; suggestionId: SuggestionId }
  | { _: "SuggestionCancelToApprovalPending"; suggestionId: SuggestionId }
  | { _: "SuggestionApprove"; suggestionId: SuggestionId }
  | { _: "SuggestionReject"; suggestionId: SuggestionId }
  | { _: "SuggestionCancelRejection"; suggestionId: SuggestionId };

/**
 * 提案
 */
export type SuggestionSnapshot = {
  /**
   * 変更概要
   */
  name: string;
  /**
   * 作成者
   */
  createUserId: UserId;
  /**
   * 変更理由
   */
  reason: string;
  /**
   * 承認状態
   */
  state: SuggestionState;
  /**
   * 変更
   */
  changeList: ReadonlyArray<Change>;
  /**
   * 変更をするプロジェクト
   */
  projectId: ProjectId;
  /**
   * 投稿したアイデアID
   */
  ideaId: IdeaId;
  /**
   * 更新日時
   */
  updateTime: Time;
  /**
   * 取得日時
   */
  getTime: Time;
};

/**
 * Id付きのSuggestion
 */
export type SuggestionSnapshotAndId = {
  /**
   * SuggestionId
   */
  id: SuggestionId;
  /**
   * SuggestionSnapshot
   */
  snapshot: SuggestionSnapshot;
};

/**
 * 提案の状況
 */
export type SuggestionState =
  | "Creating"
  | "ApprovalPending"
  | "Approved"
  | "Rejected";

/**
 * 変更点
 */
export type Change =
  | { _: "ProjectName"; string_: string }
  | { _: "AddPart"; addPart: AddPart };

/**
 * パーツを追加するのに必要なもの
 */
export type AddPart = {
  /**
   * 新しいパーツの名前
   */
  name: string;
  /**
   * 新しいパーツの説明
   */
  description: string;
  /**
   * 新しいパーツの型
   */
  type: SuggestionType;
  /**
   * 新しいパーツの式
   */
  expr: SuggestionExpr;
};

/**
 * ChangeのAddPartなどで使われる提案で作成した型を使えるType
 */
export type SuggestionType =
  | {
      _: "Function";
      suggestionTypeInputAndOutput: SuggestionTypeInputAndOutput;
    }
  | {
      _: "TypePartWithParameter";
      typePartWithSuggestionTypeParameter: TypePartWithSuggestionTypeParameter;
    }
  | {
      _: "SuggestionTypePartWithParameter";
      suggestionTypePartWithSuggestionTypeParameter: SuggestionTypePartWithSuggestionTypeParameter;
    };

export type SuggestionTypeInputAndOutput = {
  /**
   * 入力の型
   */
  inputType: SuggestionType;
  /**
   * 出力の型
   */
  outputType: SuggestionType;
};

export type TypePartWithSuggestionTypeParameter = {
  /**
   * 型の参照
   */
  typePartId: TypePartId;
  /**
   * 型のパラメーター
   */
  parameter: ReadonlyArray<SuggestionType>;
};

export type SuggestionTypePartWithSuggestionTypeParameter = {
  /**
   * 提案内での定義した型パーツの番号
   */
  suggestionTypePartIndex: number;
  /**
   * 型のパラメーター
   */
  parameter: ReadonlyArray<SuggestionType>;
};

/**
 * 提案時に含まれるパーツを参照できる式
 */
export type SuggestionExpr =
  | { _: "Kernel"; kernelExpr: KernelExpr }
  | { _: "Int32Literal"; int32: number }
  | { _: "PartReference"; partId: PartId }
  | { _: "SuggestionPartReference"; int32: number }
  | { _: "LocalPartReference"; localPartReference: LocalPartReference }
  | { _: "TagReference"; tagReference: TagReference }
  | {
      _: "SuggestionTagReference";
      suggestionTagReference: SuggestionTagReference;
    }
  | { _: "FunctionCall"; suggestionFunctionCall: SuggestionFunctionCall }
  | { _: "Lambda"; suggestionLambdaBranch: SuggestionLambdaBranch };

/**
 * 提案内で定義された型のタグ
 */
export type SuggestionTagReference = {
  /**
   * 提案内での定義した型パーツの番号
   */
  suggestionTypePartIndex: number;
  /**
   * タグIndex
   */
  tagIndex: number;
};

/**
 * 関数呼び出し (中に含まれる型はSuggestionExpr)
 */
export type SuggestionFunctionCall = {
  /**
   * 関数
   */
  function: SuggestionExpr;
  /**
   * パラメーター
   */
  parameter: SuggestionExpr;
};

/**
 * suggestionExprの入ったLambdaBranch
 */
export type SuggestionLambdaBranch = {
  /**
   * 入力値の条件を書くところ
   */
  condition: Condition;
  /**
   * ブランチの説明
   */
  description: string;
  localPartList: ReadonlyArray<SuggestionBranchPartDefinition>;
  /**
   * 式
   */
  expr: Maybe<SuggestionExpr>;
};

/**
 * ラムダのブランチで使えるパーツを定義する部分 (SuggestionExpr バージョン)
 */
export type SuggestionBranchPartDefinition = {
  /**
   * ローカルパーツID
   */
  localPartId: LocalPartId;
  /**
   * ブランチパーツの名前
   */
  name: string;
  /**
   * ブランチパーツの説明
   */
  description: string;
  /**
   * ローカルパーツの型
   */
  type: SuggestionType;
  /**
   * ローカルパーツの式
   */
  expr: SuggestionExpr;
};

/**
 * 型パーツ
 */
export type TypePartSnapshot = {
  /**
   * 型パーツの名前
   */
  name: string;
  /**
   * この型パーツの元
   */
  parentList: ReadonlyArray<PartId>;
  /**
   * 型パーツの説明
   */
  description: string;
  /**
   * 所属しているプロジェクトのID
   */
  projectId: ProjectId;
  /**
   * この型パーツが作成された提案
   */
  createSuggestionId: SuggestionId;
  /**
   * 取得日時
   */
  getTime: Time;
  /**
   * 定義本体
   */
  body: TypePartBody;
};

/**
 * パーツの定義
 */
export type PartSnapshot = {
  /**
   * パーツの名前
   */
  name: string;
  /**
   * このパーツの元
   */
  parentList: ReadonlyArray<PartId>;
  /**
   * パーツの説明
   */
  description: string;
  /**
   * パーツの型
   */
  type: Type;
  /**
   * パーツの式
   */
  expr: Maybe<Expr>;
  /**
   * 所属しているプロジェクトのID
   */
  projectId: ProjectId;
  /**
   * このパーツが作成された提案
   */
  createSuggestionId: SuggestionId;
  /**
   * 取得日時
   */
  getTime: Time;
};

/**
 * 型の定義本体
 */
export type TypePartBody =
  | {
      _: "Product";
      typePartBodyProductMemberList: ReadonlyArray<TypePartBodyProductMember>;
    }
  | {
      _: "Sum";
      typePartBodySumPatternList: ReadonlyArray<TypePartBodySumPattern>;
    }
  | { _: "Kernel"; typePartBodyKernel: TypePartBodyKernel };

/**
 * 直積型のメンバー
 */
export type TypePartBodyProductMember = {
  /**
   * メンバー名
   */
  name: string;
  /**
   * 説明文
   */
  description: string;
  /**
   * メンバー値の型
   */
  memberType: Type;
};

/**
 * 直積型のパターン
 */
export type TypePartBodySumPattern = {
  /**
   * タグ名
   */
  name: string;
  /**
   * 説明文
   */
  description: string;
  /**
   * パラメーター
   */
  parameter: Type;
};

/**
 * Definyだけでは表現できないデータ型
 */
export type TypePartBodyKernel = "Int32" | "List";

/**
 * 型
 */
export type Type =
  | { _: "Function"; typeInputAndOutput: TypeInputAndOutput }
  | {
      _: "TypePartWithParameter";
      typePartIdWithParameter: TypePartIdWithParameter;
    };

export type TypeInputAndOutput = {
  /**
   * 入力の型
   */
  inputType: Type;
  /**
   * 出力の型
   */
  outputType: Type;
};

export type TypePartIdWithParameter = {
  /**
   * 型の参照
   */
  typePartId: TypePartId;
  /**
   * 型のパラメーター
   */
  parameter: ReadonlyArray<Type>;
};

/**
 * 式
 */
export type Expr =
  | { _: "Kernel"; kernelExpr: KernelExpr }
  | { _: "Int32Literal"; int32: number }
  | { _: "PartReference"; partId: PartId }
  | { _: "LocalPartReference"; localPartReference: LocalPartReference }
  | { _: "TagReference"; tagReference: TagReference }
  | { _: "FunctionCall"; functionCall: FunctionCall }
  | { _: "Lambda"; lambdaBranchList: ReadonlyArray<LambdaBranch> };

/**
 * 評価しきった式
 */
export type EvaluatedExpr =
  | { _: "Kernel"; kernelExpr: KernelExpr }
  | { _: "Int32"; int32: number }
  | { _: "LocalPartReference"; localPartReference: LocalPartReference }
  | { _: "TagReference"; tagReference: TagReference }
  | { _: "Lambda"; lambdaBranchList: ReadonlyArray<LambdaBranch> }
  | { _: "KernelCall"; kernelCall: KernelCall };

/**
 * 複数の引数が必要な内部関数の部分呼び出し
 */
export type KernelCall = {
  /**
   * 関数
   */
  kernel: KernelExpr;
  /**
   * 呼び出すパラメーター
   */
  expr: EvaluatedExpr;
};

/**
 * Definyだけでは表現できない式
 */
export type KernelExpr = "Int32Add" | "Int32Sub" | "Int32Mul";

/**
 * ローカルパスの参照を表す
 */
export type LocalPartReference = {
  /**
   * ローカルパスが定義されているパーツのID
   */
  partId: PartId;
  /**
   * ローカルパーツID
   */
  localPartId: LocalPartId;
};

/**
 * タグの参照を表す
 */
export type TagReference = {
  /**
   * 型ID
   */
  typePartId: TypePartId;
  /**
   * タグID
   */
  tagId: TagId;
};

/**
 * 関数呼び出し
 */
export type FunctionCall = {
  /**
   * 関数
   */
  function: Expr;
  /**
   * パラメーター
   */
  parameter: Expr;
};

/**
 * ラムダのブランチ. Just x -> data x のようなところ
 */
export type LambdaBranch = {
  /**
   * 入力値の条件を書くところ. Just x
   */
  condition: Condition;
  /**
   * ブランチの説明
   */
  description: string;
  localPartList: ReadonlyArray<BranchPartDefinition>;
  /**
   * 式
   */
  expr: Maybe<Expr>;
};

/**
 * ブランチの式を使う条件
 */
export type Condition =
  | { _: "ByTag"; conditionTag: ConditionTag }
  | { _: "ByCapture"; conditionCapture: ConditionCapture }
  | { _: "Any" }
  | { _: "Int32"; int32: number };

/**
 * タグによる条件
 */
export type ConditionTag = {
  /**
   * タグ
   */
  tag: TagId;
  /**
   * パラメーター
   */
  parameter: Maybe<Condition>;
};

/**
 * キャプチャパーツへのキャプチャ
 */
export type ConditionCapture = {
  /**
   * キャプチャパーツの名前
   */
  name: string;
  /**
   * ローカルパーツId
   */
  localPartId: LocalPartId;
};

/**
 * ラムダのブランチで使えるパーツを定義する部分
 */
export type BranchPartDefinition = {
  /**
   * ローカルパーツID
   */
  localPartId: LocalPartId;
  /**
   * ブランチパーツの名前
   */
  name: string;
  /**
   * ブランチパーツの説明
   */
  description: string;
  /**
   * ローカルパーツの型
   */
  type: Type;
  /**
   * ローカルパーツの式
   */
  expr: Expr;
};

export type EvaluateExprError =
  | { _: "NeedPartDefinition"; partId: PartId }
  | { _: "PartExprIsNothing"; partId: PartId }
  | {
      _: "CannotFindLocalPartDefinition";
      localPartReference: LocalPartReference;
    }
  | { _: "TypeError"; typeError: TypeError }
  | { _: "NotSupported" };

/**
 * 型エラー
 */
export type TypeError = {
  /**
   * 型エラーの説明
   */
  message: string;
};

/**
 * プロジェクト作成時に必要なパラメーター
 */
export type CreateProjectParameter = {
  /**
   * プロジェクトを作るときのアカウント
   */
  accessToken: AccessToken;
  /**
   * プロジェクト名
   */
  projectName: string;
};

/**
 * アイデアを作成時に必要なパラメーター
 */
export type CreateIdeaParameter = {
  /**
   * プロジェクトを作るときのアカウント
   */
  accessToken: AccessToken;
  /**
   * アイデア名
   */
  ideaName: string;
  /**
   * 対象のプロジェクトID
   */
  projectId: ProjectId;
};

/**
 * アイデアにコメントを追加するときに必要なパラメーター
 */
export type AddCommentParameter = {
  /**
   * プロジェクトを作るときのアカウント
   */
  accessToken: AccessToken;
  /**
   * コメントを追加するアイデア
   */
  ideaId: IdeaId;
  /**
   * コメント本文
   */
  comment: string;
};

/**
 * 提案を作成するときに必要なパラメーター
 */
export type AddSuggestionParameter = {
  /**
   * 提案を作成するアカウント
   */
  accessToken: AccessToken;
  /**
   * 提案に関連付けられるアイデア
   */
  ideaId: IdeaId;
};

/**
 * 提案を更新するときに必要なパラメーター
 */
export type UpdateSuggestionParameter = {
  /**
   * 提案を更新するアカウント
   */
  accessToke: AccessToken;
  /**
   * 書き換える提案
   */
  suggestionId: SuggestionId;
  /**
   * 提案の名前
   */
  name: string;
  /**
   * 変更理由
   */
  reason: string;
  /**
   * 提案の変更
   */
  changeList: ReadonlyArray<Change>;
};

/**
 * アクセストークンとSuggestionId
 */
export type AccessTokenAndSuggestionId = {
  /**
   * アクセストークン
   */
  accessToke: AccessToken;
  /**
   * SuggestionId
   */
  suggestionId: SuggestionId;
};

export type ProjectId = string & { _projectId: never };

export type UserId = string & { _userId: never };

export type IdeaId = string & { _ideaId: never };

export type SuggestionId = string & { _suggestionId: never };

export type FileHash = string & { _fileHash: never };

export type PartId = string & { _partId: never };

export type TypePartId = string & { _typePartId: never };

export type LocalPartId = string & { _localPartId: never };

export type TagId = string & { _tagId: never };

export type AccessToken = string & { _accessToken: never };

export const maybeJust = <T>(value: T): Maybe<T> => ({
  _: "Just",
  value: value,
});

export const maybeNothing = <T>(): Maybe<T> => ({ _: "Nothing" });

export const resultOk = <ok, error>(ok: ok): Result<ok, error> => ({
  _: "Ok",
  ok: ok,
});

export const resultError = <ok, error>(error: error): Result<ok, error> => ({
  _: "Error",
  error: error,
});

/**
 * 最初のページ
 */
export const locationHome: Location = { _: "Home" };

/**
 * プロジェクト作成画面
 */
export const locationCreateProject: Location = { _: "CreateProject" };

/**
 * アイデア作成ページ. パラメーターのprojectIdは対象のプロジェクト
 */
export const locationCreateIdea = (projectId: ProjectId): Location => ({
  _: "CreateIdea",
  projectId: projectId,
});

/**
 * ユーザーの詳細ページ
 */
export const locationUser = (userId: UserId): Location => ({
  _: "User",
  userId: userId,
});

/**
 * プロジェクトの詳細ページ
 */
export const locationProject = (projectId: ProjectId): Location => ({
  _: "Project",
  projectId: projectId,
});

/**
 * アイデア詳細ページ
 */
export const locationIdea = (ideaId: IdeaId): Location => ({
  _: "Idea",
  ideaId: ideaId,
});

/**
 * 提案のページ
 */
export const locationSuggestion = (suggestionId: SuggestionId): Location => ({
  _: "Suggestion",
  suggestionId: suggestionId,
});

/**
 * 文章でのコメントをした
 */
export const itemBodyComment = (string_: string): ItemBody => ({
  _: "Comment",
  string_: string_,
});

/**
 * 提案を作成した
 */
export const itemBodySuggestionCreate = (
  suggestionId: SuggestionId
): ItemBody => ({ _: "SuggestionCreate", suggestionId: suggestionId });

/**
 * 提案を承認待ちにした
 */
export const itemBodySuggestionToApprovalPending = (
  suggestionId: SuggestionId
): ItemBody => ({
  _: "SuggestionToApprovalPending",
  suggestionId: suggestionId,
});

/**
 * 承認待ちをキャンセルした
 */
export const itemBodySuggestionCancelToApprovalPending = (
  suggestionId: SuggestionId
): ItemBody => ({
  _: "SuggestionCancelToApprovalPending",
  suggestionId: suggestionId,
});

/**
 * 提案を承認した
 */
export const itemBodySuggestionApprove = (
  suggestionId: SuggestionId
): ItemBody => ({ _: "SuggestionApprove", suggestionId: suggestionId });

/**
 * 提案を拒否した
 */
export const itemBodySuggestionReject = (
  suggestionId: SuggestionId
): ItemBody => ({ _: "SuggestionReject", suggestionId: suggestionId });

/**
 * 提案の拒否をキャンセルした
 */
export const itemBodySuggestionCancelRejection = (
  suggestionId: SuggestionId
): ItemBody => ({ _: "SuggestionCancelRejection", suggestionId: suggestionId });

/**
 * プロジェクト名の変更
 */
export const changeProjectName = (string_: string): Change => ({
  _: "ProjectName",
  string_: string_,
});

/**
 * パーツの追加
 */
export const changeAddPart = (addPart: AddPart): Change => ({
  _: "AddPart",
  addPart: addPart,
});

/**
 * 関数
 */
export const suggestionTypeFunction = (
  suggestionTypeInputAndOutput: SuggestionTypeInputAndOutput
): SuggestionType => ({
  _: "Function",
  suggestionTypeInputAndOutput: suggestionTypeInputAndOutput,
});

/**
 * 提案前に作られた型パーツとパラメーター
 */
export const suggestionTypeTypePartWithParameter = (
  typePartWithSuggestionTypeParameter: TypePartWithSuggestionTypeParameter
): SuggestionType => ({
  _: "TypePartWithParameter",
  typePartWithSuggestionTypeParameter: typePartWithSuggestionTypeParameter,
});

/**
 * 提案時に作られた型パーツとパラメーター
 */
export const suggestionTypeSuggestionTypePartWithParameter = (
  suggestionTypePartWithSuggestionTypeParameter: SuggestionTypePartWithSuggestionTypeParameter
): SuggestionType => ({
  _: "SuggestionTypePartWithParameter",
  suggestionTypePartWithSuggestionTypeParameter: suggestionTypePartWithSuggestionTypeParameter,
});

/**
 * Definyだけでは表現できない式
 */
export const suggestionExprKernel = (
  kernelExpr: KernelExpr
): SuggestionExpr => ({ _: "Kernel", kernelExpr: kernelExpr });

/**
 * 32bit整数
 */
export const suggestionExprInt32Literal = (int32: number): SuggestionExpr => ({
  _: "Int32Literal",
  int32: int32,
});

/**
 * パーツの値を参照
 */
export const suggestionExprPartReference = (
  partId: PartId
): SuggestionExpr => ({ _: "PartReference", partId: partId });

/**
 * 提案内で定義されたパーツの番号
 */
export const suggestionExprSuggestionPartReference = (
  int32: number
): SuggestionExpr => ({ _: "SuggestionPartReference", int32: int32 });

/**
 * ローカルパーツの参照
 */
export const suggestionExprLocalPartReference = (
  localPartReference: LocalPartReference
): SuggestionExpr => ({
  _: "LocalPartReference",
  localPartReference: localPartReference,
});

/**
 * タグを参照
 */
export const suggestionExprTagReference = (
  tagReference: TagReference
): SuggestionExpr => ({ _: "TagReference", tagReference: tagReference });

/**
 * 提案内で定義された型のタグ
 */
export const suggestionExprSuggestionTagReference = (
  suggestionTagReference: SuggestionTagReference
): SuggestionExpr => ({
  _: "SuggestionTagReference",
  suggestionTagReference: suggestionTagReference,
});

/**
 * 関数呼び出し (中に含まれる型はSuggestionExpr)
 */
export const suggestionExprFunctionCall = (
  suggestionFunctionCall: SuggestionFunctionCall
): SuggestionExpr => ({
  _: "FunctionCall",
  suggestionFunctionCall: suggestionFunctionCall,
});

/**
 * ラムダ
 */
export const suggestionExprLambda = (
  suggestionLambdaBranch: SuggestionLambdaBranch
): SuggestionExpr => ({
  _: "Lambda",
  suggestionLambdaBranch: suggestionLambdaBranch,
});

/**
 * 直積型
 */
export const typePartBodyProduct = (
  typePartBodyProductMemberList: ReadonlyArray<TypePartBodyProductMember>
): TypePartBody => ({
  _: "Product",
  typePartBodyProductMemberList: typePartBodyProductMemberList,
});

/**
 * 直和型
 */
export const typePartBodySum = (
  typePartBodySumPatternList: ReadonlyArray<TypePartBodySumPattern>
): TypePartBody => ({
  _: "Sum",
  typePartBodySumPatternList: typePartBodySumPatternList,
});

/**
 * Definyだけでは表現できないデータ型
 */
export const typePartBodyKernel = (
  typePartBodyKernel: TypePartBodyKernel
): TypePartBody => ({ _: "Kernel", typePartBodyKernel: typePartBodyKernel });

/**
 * 関数
 */
export const typeFunction = (typeInputAndOutput: TypeInputAndOutput): Type => ({
  _: "Function",
  typeInputAndOutput: typeInputAndOutput,
});

/**
 * 型パーツと, パラメーターのリスト
 */
export const typeTypePartWithParameter = (
  typePartIdWithParameter: TypePartIdWithParameter
): Type => ({
  _: "TypePartWithParameter",
  typePartIdWithParameter: typePartIdWithParameter,
});

/**
 * Definyだけでは表現できない式
 */
export const exprKernel = (kernelExpr: KernelExpr): Expr => ({
  _: "Kernel",
  kernelExpr: kernelExpr,
});

/**
 * 32bit整数
 */
export const exprInt32Literal = (int32: number): Expr => ({
  _: "Int32Literal",
  int32: int32,
});

/**
 * パーツの値を参照
 */
export const exprPartReference = (partId: PartId): Expr => ({
  _: "PartReference",
  partId: partId,
});

/**
 * ローカルパーツの参照
 */
export const exprLocalPartReference = (
  localPartReference: LocalPartReference
): Expr => ({
  _: "LocalPartReference",
  localPartReference: localPartReference,
});

/**
 * タグを参照
 */
export const exprTagReference = (tagReference: TagReference): Expr => ({
  _: "TagReference",
  tagReference: tagReference,
});

/**
 * 関数呼び出し
 */
export const exprFunctionCall = (functionCall: FunctionCall): Expr => ({
  _: "FunctionCall",
  functionCall: functionCall,
});

/**
 * ラムダ
 */
export const exprLambda = (
  lambdaBranchList: ReadonlyArray<LambdaBranch>
): Expr => ({ _: "Lambda", lambdaBranchList: lambdaBranchList });

/**
 * Definyだけでは表現できない式
 */
export const evaluatedExprKernel = (kernelExpr: KernelExpr): EvaluatedExpr => ({
  _: "Kernel",
  kernelExpr: kernelExpr,
});

/**
 * 32bit整数
 */
export const evaluatedExprInt32 = (int32: number): EvaluatedExpr => ({
  _: "Int32",
  int32: int32,
});

/**
 * ローカルパーツの参照
 */
export const evaluatedExprLocalPartReference = (
  localPartReference: LocalPartReference
): EvaluatedExpr => ({
  _: "LocalPartReference",
  localPartReference: localPartReference,
});

/**
 * タグを参照
 */
export const evaluatedExprTagReference = (
  tagReference: TagReference
): EvaluatedExpr => ({ _: "TagReference", tagReference: tagReference });

/**
 * ラムダ
 */
export const evaluatedExprLambda = (
  lambdaBranchList: ReadonlyArray<LambdaBranch>
): EvaluatedExpr => ({ _: "Lambda", lambdaBranchList: lambdaBranchList });

/**
 * 内部関数呼び出し
 */
export const evaluatedExprKernelCall = (
  kernelCall: KernelCall
): EvaluatedExpr => ({ _: "KernelCall", kernelCall: kernelCall });

/**
 * タグ
 */
export const conditionByTag = (conditionTag: ConditionTag): Condition => ({
  _: "ByTag",
  conditionTag: conditionTag,
});

/**
 * キャプチャパーツへのキャプチャ
 */
export const conditionByCapture = (
  conditionCapture: ConditionCapture
): Condition => ({ _: "ByCapture", conditionCapture: conditionCapture });

/**
 * _ すべてのパターンを通すもの
 */
export const conditionAny: Condition = { _: "Any" };

/**
 * 32bit整数の完全一致
 */
export const conditionInt32 = (int32: number): Condition => ({
  _: "Int32",
  int32: int32,
});

/**
 * 式を評価するには,このパーツの定義が必要だと言っている
 */
export const evaluateExprErrorNeedPartDefinition = (
  partId: PartId
): EvaluateExprError => ({ _: "NeedPartDefinition", partId: partId });

/**
 * パーツの式が空だと言っている
 */
export const evaluateExprErrorPartExprIsNothing = (
  partId: PartId
): EvaluateExprError => ({ _: "PartExprIsNothing", partId: partId });

/**
 * ローカルパーツの定義を見つけることができなかった
 */
export const evaluateExprErrorCannotFindLocalPartDefinition = (
  localPartReference: LocalPartReference
): EvaluateExprError => ({
  _: "CannotFindLocalPartDefinition",
  localPartReference: localPartReference,
});

/**
 * 型が合わない
 */
export const evaluateExprErrorTypeError = (
  typeError: TypeError
): EvaluateExprError => ({ _: "TypeError", typeError: typeError });

/**
 * まだサポートしていないものが含まれている
 */
export const evaluateExprErrorNotSupported: EvaluateExprError = {
  _: "NotSupported",
};

/**
 * numberの32bit符号あり整数をSigned Leb128のバイナリに変換する
 */
export const encodeInt32 = (value: number): ReadonlyArray<number> => {
  value |= 0;
  const result: Array<number> = [];
  while (true) {
    const byte: number = value & 127;
    value >>= 7;
    if (
      (value === 0 && (byte & 64) === 0) ||
      (value === -1 && (byte & 64) !== 0)
    ) {
      result.push(byte);
      return result;
    }
    result.push(byte | 128);
  }
};

/**
 * stringからバイナリに変換する.
 */
export const encodeString = (text: string): ReadonlyArray<number> => {
  const result: ReadonlyArray<number> = [
    ...new (process === undefined || process.title === "browser"
      ? TextEncoder
      : a.TextEncoder)().encode(text),
  ];
  return encodeInt32(result.length).concat(result);
};

/**
 * boolからバイナリに変換する
 */
export const encodeBool = (value: boolean): ReadonlyArray<number> => [
  value ? 1 : 0,
];

export const encodeBinary = (value: Uint8Array): ReadonlyArray<number> =>
  encodeInt32(value.length).concat([...value]);

export const encodeList = <T>(
  encodeFunction: (a: T) => ReadonlyArray<number>
): ((a: ReadonlyArray<T>) => ReadonlyArray<number>) => (
  list: ReadonlyArray<T>
): ReadonlyArray<number> => {
  let result: Array<number> = encodeInt32(list.length) as Array<number>;
  for (const element of list) {
    result = result.concat(encodeFunction(element));
  }
  return result;
};

export const encodeMaybe = <T>(
  encodeFunction: (a: T) => ReadonlyArray<number>
): ((a: Maybe<T>) => ReadonlyArray<number>) => (
  maybe: Maybe<T>
): ReadonlyArray<number> => {
  switch (maybe._) {
    case "Just": {
      return [0].concat(encodeFunction(maybe.value));
    }
    case "Nothing": {
      return [1];
    }
  }
};

export const encodeResult = <ok, error>(
  okEncodeFunction: (a: ok) => ReadonlyArray<number>,
  errorEncodeFunction: (a: error) => ReadonlyArray<number>
): ((a: Result<ok, error>) => ReadonlyArray<number>) => (
  result: Result<ok, error>
): ReadonlyArray<number> => {
  switch (result._) {
    case "Ok": {
      return [0].concat(okEncodeFunction(result.ok));
    }
    case "Error": {
      return [1].concat(errorEncodeFunction(result.error));
    }
  }
};

export const encodeId = (id: string): ReadonlyArray<number> => {
  const result: Array<number> = [];
  for (let i = 0; i < 16; i += 1) {
    result[i] = Number.parseInt(id.slice(i * 2, i * 2 + 2), 16);
  }
  return result;
};

export const encodeToken = (id: string): ReadonlyArray<number> => {
  const result: Array<number> = [];
  for (let i = 0; i < 32; i += 1) {
    result[i] = Number.parseInt(id.slice(i * 2, i * 2 + 2), 16);
  }
  return result;
};

export const encodeTime = (time: Time): ReadonlyArray<number> =>
  encodeInt32(time.day).concat(encodeInt32(time.millisecond));

export const encodeRequestLogInUrlRequestData = (
  requestLogInUrlRequestData: RequestLogInUrlRequestData
): ReadonlyArray<number> =>
  encodeOpenIdConnectProvider(
    requestLogInUrlRequestData.openIdConnectProvider
  ).concat(encodeUrlData(requestLogInUrlRequestData.urlData));

export const encodeOpenIdConnectProvider = (
  openIdConnectProvider: OpenIdConnectProvider
): ReadonlyArray<number> => {
  switch (openIdConnectProvider) {
    case "Google": {
      return [0];
    }
    case "GitHub": {
      return [1];
    }
  }
};

export const encodeUrlData = (urlData: UrlData): ReadonlyArray<number> =>
  encodeClientMode(urlData.clientMode)
    .concat(encodeLocation(urlData.location))
    .concat(encodeLanguage(urlData.language));

export const encodeClientMode = (
  clientMode: ClientMode
): ReadonlyArray<number> => {
  switch (clientMode) {
    case "DebugMode": {
      return [0];
    }
    case "Release": {
      return [1];
    }
  }
};

export const encodeLocation = (location: Location): ReadonlyArray<number> => {
  switch (location._) {
    case "Home": {
      return [0];
    }
    case "CreateProject": {
      return [1];
    }
    case "CreateIdea": {
      return [2].concat(encodeId(location.projectId));
    }
    case "User": {
      return [3].concat(encodeId(location.userId));
    }
    case "Project": {
      return [4].concat(encodeId(location.projectId));
    }
    case "Idea": {
      return [5].concat(encodeId(location.ideaId));
    }
    case "Suggestion": {
      return [6].concat(encodeId(location.suggestionId));
    }
  }
};

export const encodeLanguage = (language: Language): ReadonlyArray<number> => {
  switch (language) {
    case "Japanese": {
      return [0];
    }
    case "English": {
      return [1];
    }
    case "Esperanto": {
      return [2];
    }
  }
};

export const encodeUserSnapshot = (
  userSnapshot: UserSnapshot
): ReadonlyArray<number> =>
  encodeString(userSnapshot.name)
    .concat(encodeToken(userSnapshot.imageHash))
    .concat(encodeString(userSnapshot.introduction))
    .concat(encodeTime(userSnapshot.createTime))
    .concat(encodeList(encodeId)(userSnapshot.likeProjectIdList))
    .concat(encodeList(encodeId)(userSnapshot.developProjectIdList))
    .concat(encodeList(encodeId)(userSnapshot.commentIdeaIdList))
    .concat(encodeTime(userSnapshot.getTime));

export const encodeUserSnapshotAndId = (
  userSnapshotAndId: UserSnapshotAndId
): ReadonlyArray<number> =>
  encodeId(userSnapshotAndId.id).concat(
    encodeUserSnapshot(userSnapshotAndId.snapshot)
  );

export const encodeUserResponse = (
  userResponse: UserResponse
): ReadonlyArray<number> =>
  encodeId(userResponse.id).concat(
    encodeMaybe(encodeUserSnapshot)(userResponse.snapshotMaybe)
  );

export const encodeProjectSnapshot = (
  projectSnapshot: ProjectSnapshot
): ReadonlyArray<number> =>
  encodeString(projectSnapshot.name)
    .concat(encodeToken(projectSnapshot.iconHash))
    .concat(encodeToken(projectSnapshot.imageHash))
    .concat(encodeTime(projectSnapshot.createTime))
    .concat(encodeId(projectSnapshot.createUser))
    .concat(encodeTime(projectSnapshot.updateTime))
    .concat(encodeTime(projectSnapshot.getTime))
    .concat(encodeList(encodeId)(projectSnapshot.partIdList))
    .concat(encodeList(encodeId)(projectSnapshot.typePartIdList));

export const encodeProjectSnapshotAndId = (
  projectSnapshotAndId: ProjectSnapshotAndId
): ReadonlyArray<number> =>
  encodeId(projectSnapshotAndId.id).concat(
    encodeProjectSnapshot(projectSnapshotAndId.snapshot)
  );

export const encodeProjectResponse = (
  projectResponse: ProjectResponse
): ReadonlyArray<number> =>
  encodeId(projectResponse.id).concat(
    encodeMaybe(encodeProjectSnapshot)(projectResponse.snapshotMaybe)
  );

export const encodeIdeaSnapshot = (
  ideaSnapshot: IdeaSnapshot
): ReadonlyArray<number> =>
  encodeString(ideaSnapshot.name)
    .concat(encodeId(ideaSnapshot.createUser))
    .concat(encodeTime(ideaSnapshot.createTime))
    .concat(encodeId(ideaSnapshot.projectId))
    .concat(encodeList(encodeIdeaItem)(ideaSnapshot.itemList))
    .concat(encodeTime(ideaSnapshot.updateTime))
    .concat(encodeTime(ideaSnapshot.getTime));

export const encodeIdeaSnapshotAndId = (
  ideaSnapshotAndId: IdeaSnapshotAndId
): ReadonlyArray<number> =>
  encodeId(ideaSnapshotAndId.id).concat(
    encodeIdeaSnapshot(ideaSnapshotAndId.snapshot)
  );

export const encodeIdeaResponse = (
  ideaResponse: IdeaResponse
): ReadonlyArray<number> =>
  encodeId(ideaResponse.id).concat(
    encodeMaybe(encodeIdeaSnapshot)(ideaResponse.snapshotMaybe)
  );

export const encodeIdeaListByProjectIdResponse = (
  ideaListByProjectIdResponse: IdeaListByProjectIdResponse
): ReadonlyArray<number> =>
  encodeId(ideaListByProjectIdResponse.projectId).concat(
    encodeList(encodeIdeaSnapshotAndId)(
      ideaListByProjectIdResponse.ideaSnapshotAndIdList
    )
  );

export const encodeIdeaItem = (ideaItem: IdeaItem): ReadonlyArray<number> =>
  encodeId(ideaItem.createUserId)
    .concat(encodeTime(ideaItem.createTime))
    .concat(encodeItemBody(ideaItem.body));

export const encodeItemBody = (itemBody: ItemBody): ReadonlyArray<number> => {
  switch (itemBody._) {
    case "Comment": {
      return [0].concat(encodeString(itemBody.string_));
    }
    case "SuggestionCreate": {
      return [1].concat(encodeId(itemBody.suggestionId));
    }
    case "SuggestionToApprovalPending": {
      return [2].concat(encodeId(itemBody.suggestionId));
    }
    case "SuggestionCancelToApprovalPending": {
      return [3].concat(encodeId(itemBody.suggestionId));
    }
    case "SuggestionApprove": {
      return [4].concat(encodeId(itemBody.suggestionId));
    }
    case "SuggestionReject": {
      return [5].concat(encodeId(itemBody.suggestionId));
    }
    case "SuggestionCancelRejection": {
      return [6].concat(encodeId(itemBody.suggestionId));
    }
  }
};

export const encodeSuggestionSnapshot = (
  suggestionSnapshot: SuggestionSnapshot
): ReadonlyArray<number> =>
  encodeString(suggestionSnapshot.name)
    .concat(encodeId(suggestionSnapshot.createUserId))
    .concat(encodeString(suggestionSnapshot.reason))
    .concat(encodeSuggestionState(suggestionSnapshot.state))
    .concat(encodeList(encodeChange)(suggestionSnapshot.changeList))
    .concat(encodeId(suggestionSnapshot.projectId))
    .concat(encodeId(suggestionSnapshot.ideaId))
    .concat(encodeTime(suggestionSnapshot.updateTime))
    .concat(encodeTime(suggestionSnapshot.getTime));

export const encodeSuggestionSnapshotAndId = (
  suggestionSnapshotAndId: SuggestionSnapshotAndId
): ReadonlyArray<number> =>
  encodeId(suggestionSnapshotAndId.id).concat(
    encodeSuggestionSnapshot(suggestionSnapshotAndId.snapshot)
  );

export const encodeSuggestionState = (
  suggestionState: SuggestionState
): ReadonlyArray<number> => {
  switch (suggestionState) {
    case "Creating": {
      return [0];
    }
    case "ApprovalPending": {
      return [1];
    }
    case "Approved": {
      return [2];
    }
    case "Rejected": {
      return [3];
    }
  }
};

export const encodeChange = (change: Change): ReadonlyArray<number> => {
  switch (change._) {
    case "ProjectName": {
      return [0].concat(encodeString(change.string_));
    }
    case "AddPart": {
      return [1].concat(encodeAddPart(change.addPart));
    }
  }
};

export const encodeAddPart = (addPart: AddPart): ReadonlyArray<number> =>
  encodeString(addPart.name)
    .concat(encodeString(addPart.description))
    .concat(encodeSuggestionType(addPart["type"]))
    .concat(encodeSuggestionExpr(addPart.expr));

export const encodeSuggestionType = (
  suggestionType: SuggestionType
): ReadonlyArray<number> => {
  switch (suggestionType._) {
    case "Function": {
      return [0].concat(
        encodeSuggestionTypeInputAndOutput(
          suggestionType.suggestionTypeInputAndOutput
        )
      );
    }
    case "TypePartWithParameter": {
      return [1].concat(
        encodeTypePartWithSuggestionTypeParameter(
          suggestionType.typePartWithSuggestionTypeParameter
        )
      );
    }
    case "SuggestionTypePartWithParameter": {
      return [2].concat(
        encodeSuggestionTypePartWithSuggestionTypeParameter(
          suggestionType.suggestionTypePartWithSuggestionTypeParameter
        )
      );
    }
  }
};

export const encodeSuggestionTypeInputAndOutput = (
  suggestionTypeInputAndOutput: SuggestionTypeInputAndOutput
): ReadonlyArray<number> =>
  encodeSuggestionType(suggestionTypeInputAndOutput.inputType).concat(
    encodeSuggestionType(suggestionTypeInputAndOutput.outputType)
  );

export const encodeTypePartWithSuggestionTypeParameter = (
  typePartWithSuggestionTypeParameter: TypePartWithSuggestionTypeParameter
): ReadonlyArray<number> =>
  encodeId(typePartWithSuggestionTypeParameter.typePartId).concat(
    encodeList(encodeSuggestionType)(
      typePartWithSuggestionTypeParameter.parameter
    )
  );

export const encodeSuggestionTypePartWithSuggestionTypeParameter = (
  suggestionTypePartWithSuggestionTypeParameter: SuggestionTypePartWithSuggestionTypeParameter
): ReadonlyArray<number> =>
  encodeInt32(
    suggestionTypePartWithSuggestionTypeParameter.suggestionTypePartIndex
  ).concat(
    encodeList(encodeSuggestionType)(
      suggestionTypePartWithSuggestionTypeParameter.parameter
    )
  );

export const encodeSuggestionExpr = (
  suggestionExpr: SuggestionExpr
): ReadonlyArray<number> => {
  switch (suggestionExpr._) {
    case "Kernel": {
      return [0].concat(encodeKernelExpr(suggestionExpr.kernelExpr));
    }
    case "Int32Literal": {
      return [1].concat(encodeInt32(suggestionExpr.int32));
    }
    case "PartReference": {
      return [2].concat(encodeId(suggestionExpr.partId));
    }
    case "SuggestionPartReference": {
      return [3].concat(encodeInt32(suggestionExpr.int32));
    }
    case "LocalPartReference": {
      return [4].concat(
        encodeLocalPartReference(suggestionExpr.localPartReference)
      );
    }
    case "TagReference": {
      return [5].concat(encodeTagReference(suggestionExpr.tagReference));
    }
    case "SuggestionTagReference": {
      return [6].concat(
        encodeSuggestionTagReference(suggestionExpr.suggestionTagReference)
      );
    }
    case "FunctionCall": {
      return [7].concat(
        encodeSuggestionFunctionCall(suggestionExpr.suggestionFunctionCall)
      );
    }
    case "Lambda": {
      return [8].concat(
        encodeSuggestionLambdaBranch(suggestionExpr.suggestionLambdaBranch)
      );
    }
  }
};

export const encodeSuggestionTagReference = (
  suggestionTagReference: SuggestionTagReference
): ReadonlyArray<number> =>
  encodeInt32(suggestionTagReference.suggestionTypePartIndex).concat(
    encodeInt32(suggestionTagReference.tagIndex)
  );

export const encodeSuggestionFunctionCall = (
  suggestionFunctionCall: SuggestionFunctionCall
): ReadonlyArray<number> =>
  encodeSuggestionExpr(suggestionFunctionCall["function"]).concat(
    encodeSuggestionExpr(suggestionFunctionCall.parameter)
  );

export const encodeSuggestionLambdaBranch = (
  suggestionLambdaBranch: SuggestionLambdaBranch
): ReadonlyArray<number> =>
  encodeCondition(suggestionLambdaBranch.condition)
    .concat(encodeString(suggestionLambdaBranch.description))
    .concat(
      encodeList(encodeSuggestionBranchPartDefinition)(
        suggestionLambdaBranch.localPartList
      )
    )
    .concat(encodeMaybe(encodeSuggestionExpr)(suggestionLambdaBranch.expr));

export const encodeSuggestionBranchPartDefinition = (
  suggestionBranchPartDefinition: SuggestionBranchPartDefinition
): ReadonlyArray<number> =>
  encodeId(suggestionBranchPartDefinition.localPartId)
    .concat(encodeString(suggestionBranchPartDefinition.name))
    .concat(encodeString(suggestionBranchPartDefinition.description))
    .concat(encodeSuggestionType(suggestionBranchPartDefinition["type"]))
    .concat(encodeSuggestionExpr(suggestionBranchPartDefinition.expr));

export const encodeTypePartSnapshot = (
  typePartSnapshot: TypePartSnapshot
): ReadonlyArray<number> =>
  encodeString(typePartSnapshot.name)
    .concat(encodeList(encodeId)(typePartSnapshot.parentList))
    .concat(encodeString(typePartSnapshot.description))
    .concat(encodeId(typePartSnapshot.projectId))
    .concat(encodeId(typePartSnapshot.createSuggestionId))
    .concat(encodeTime(typePartSnapshot.getTime))
    .concat(encodeTypePartBody(typePartSnapshot.body));

export const encodePartSnapshot = (
  partSnapshot: PartSnapshot
): ReadonlyArray<number> =>
  encodeString(partSnapshot.name)
    .concat(encodeList(encodeId)(partSnapshot.parentList))
    .concat(encodeString(partSnapshot.description))
    .concat(encodeType(partSnapshot["type"]))
    .concat(encodeMaybe(encodeExpr)(partSnapshot.expr))
    .concat(encodeId(partSnapshot.projectId))
    .concat(encodeId(partSnapshot.createSuggestionId))
    .concat(encodeTime(partSnapshot.getTime));

export const encodeTypePartBody = (
  typePartBody: TypePartBody
): ReadonlyArray<number> => {
  switch (typePartBody._) {
    case "Product": {
      return [0].concat(
        encodeList(encodeTypePartBodyProductMember)(
          typePartBody.typePartBodyProductMemberList
        )
      );
    }
    case "Sum": {
      return [1].concat(
        encodeList(encodeTypePartBodySumPattern)(
          typePartBody.typePartBodySumPatternList
        )
      );
    }
    case "Kernel": {
      return [2].concat(
        encodeTypePartBodyKernel(typePartBody.typePartBodyKernel)
      );
    }
  }
};

export const encodeTypePartBodyProductMember = (
  typePartBodyProductMember: TypePartBodyProductMember
): ReadonlyArray<number> =>
  encodeString(typePartBodyProductMember.name)
    .concat(encodeString(typePartBodyProductMember.description))
    .concat(encodeType(typePartBodyProductMember.memberType));

export const encodeTypePartBodySumPattern = (
  typePartBodySumPattern: TypePartBodySumPattern
): ReadonlyArray<number> =>
  encodeString(typePartBodySumPattern.name)
    .concat(encodeString(typePartBodySumPattern.description))
    .concat(encodeType(typePartBodySumPattern.parameter));

export const encodeTypePartBodyKernel = (
  typePartBodyKernel: TypePartBodyKernel
): ReadonlyArray<number> => {
  switch (typePartBodyKernel) {
    case "Int32": {
      return [0];
    }
    case "List": {
      return [1];
    }
  }
};

export const encodeType = (type_: Type): ReadonlyArray<number> => {
  switch (type_._) {
    case "Function": {
      return [0].concat(encodeTypeInputAndOutput(type_.typeInputAndOutput));
    }
    case "TypePartWithParameter": {
      return [1].concat(
        encodeTypePartIdWithParameter(type_.typePartIdWithParameter)
      );
    }
  }
};

export const encodeTypeInputAndOutput = (
  typeInputAndOutput: TypeInputAndOutput
): ReadonlyArray<number> =>
  encodeType(typeInputAndOutput.inputType).concat(
    encodeType(typeInputAndOutput.outputType)
  );

export const encodeTypePartIdWithParameter = (
  typePartIdWithParameter: TypePartIdWithParameter
): ReadonlyArray<number> =>
  encodeId(typePartIdWithParameter.typePartId).concat(
    encodeList(encodeType)(typePartIdWithParameter.parameter)
  );

export const encodeExpr = (expr: Expr): ReadonlyArray<number> => {
  switch (expr._) {
    case "Kernel": {
      return [0].concat(encodeKernelExpr(expr.kernelExpr));
    }
    case "Int32Literal": {
      return [1].concat(encodeInt32(expr.int32));
    }
    case "PartReference": {
      return [2].concat(encodeId(expr.partId));
    }
    case "LocalPartReference": {
      return [3].concat(encodeLocalPartReference(expr.localPartReference));
    }
    case "TagReference": {
      return [4].concat(encodeTagReference(expr.tagReference));
    }
    case "FunctionCall": {
      return [5].concat(encodeFunctionCall(expr.functionCall));
    }
    case "Lambda": {
      return [6].concat(encodeList(encodeLambdaBranch)(expr.lambdaBranchList));
    }
  }
};

export const encodeEvaluatedExpr = (
  evaluatedExpr: EvaluatedExpr
): ReadonlyArray<number> => {
  switch (evaluatedExpr._) {
    case "Kernel": {
      return [0].concat(encodeKernelExpr(evaluatedExpr.kernelExpr));
    }
    case "Int32": {
      return [1].concat(encodeInt32(evaluatedExpr.int32));
    }
    case "LocalPartReference": {
      return [2].concat(
        encodeLocalPartReference(evaluatedExpr.localPartReference)
      );
    }
    case "TagReference": {
      return [3].concat(encodeTagReference(evaluatedExpr.tagReference));
    }
    case "Lambda": {
      return [4].concat(
        encodeList(encodeLambdaBranch)(evaluatedExpr.lambdaBranchList)
      );
    }
    case "KernelCall": {
      return [5].concat(encodeKernelCall(evaluatedExpr.kernelCall));
    }
  }
};

export const encodeKernelCall = (
  kernelCall: KernelCall
): ReadonlyArray<number> =>
  encodeKernelExpr(kernelCall.kernel).concat(
    encodeEvaluatedExpr(kernelCall.expr)
  );

export const encodeKernelExpr = (
  kernelExpr: KernelExpr
): ReadonlyArray<number> => {
  switch (kernelExpr) {
    case "Int32Add": {
      return [0];
    }
    case "Int32Sub": {
      return [1];
    }
    case "Int32Mul": {
      return [2];
    }
  }
};

export const encodeLocalPartReference = (
  localPartReference: LocalPartReference
): ReadonlyArray<number> =>
  encodeId(localPartReference.partId).concat(
    encodeId(localPartReference.localPartId)
  );

export const encodeTagReference = (
  tagReference: TagReference
): ReadonlyArray<number> =>
  encodeId(tagReference.typePartId).concat(encodeId(tagReference.tagId));

export const encodeFunctionCall = (
  functionCall: FunctionCall
): ReadonlyArray<number> =>
  encodeExpr(functionCall["function"]).concat(
    encodeExpr(functionCall.parameter)
  );

export const encodeLambdaBranch = (
  lambdaBranch: LambdaBranch
): ReadonlyArray<number> =>
  encodeCondition(lambdaBranch.condition)
    .concat(encodeString(lambdaBranch.description))
    .concat(encodeList(encodeBranchPartDefinition)(lambdaBranch.localPartList))
    .concat(encodeMaybe(encodeExpr)(lambdaBranch.expr));

export const encodeCondition = (
  condition: Condition
): ReadonlyArray<number> => {
  switch (condition._) {
    case "ByTag": {
      return [0].concat(encodeConditionTag(condition.conditionTag));
    }
    case "ByCapture": {
      return [1].concat(encodeConditionCapture(condition.conditionCapture));
    }
    case "Any": {
      return [2];
    }
    case "Int32": {
      return [3].concat(encodeInt32(condition.int32));
    }
  }
};

export const encodeConditionTag = (
  conditionTag: ConditionTag
): ReadonlyArray<number> =>
  encodeId(conditionTag.tag).concat(
    encodeMaybe(encodeCondition)(conditionTag.parameter)
  );

export const encodeConditionCapture = (
  conditionCapture: ConditionCapture
): ReadonlyArray<number> =>
  encodeString(conditionCapture.name).concat(
    encodeId(conditionCapture.localPartId)
  );

export const encodeBranchPartDefinition = (
  branchPartDefinition: BranchPartDefinition
): ReadonlyArray<number> =>
  encodeId(branchPartDefinition.localPartId)
    .concat(encodeString(branchPartDefinition.name))
    .concat(encodeString(branchPartDefinition.description))
    .concat(encodeType(branchPartDefinition["type"]))
    .concat(encodeExpr(branchPartDefinition.expr));

export const encodeEvaluateExprError = (
  evaluateExprError: EvaluateExprError
): ReadonlyArray<number> => {
  switch (evaluateExprError._) {
    case "NeedPartDefinition": {
      return [0].concat(encodeId(evaluateExprError.partId));
    }
    case "PartExprIsNothing": {
      return [1].concat(encodeId(evaluateExprError.partId));
    }
    case "CannotFindLocalPartDefinition": {
      return [2].concat(
        encodeLocalPartReference(evaluateExprError.localPartReference)
      );
    }
    case "TypeError": {
      return [3].concat(encodeTypeError(evaluateExprError.typeError));
    }
    case "NotSupported": {
      return [4];
    }
  }
};

export const encodeTypeError = (typeError: TypeError): ReadonlyArray<number> =>
  encodeString(typeError.message);

export const encodeCreateProjectParameter = (
  createProjectParameter: CreateProjectParameter
): ReadonlyArray<number> =>
  encodeToken(createProjectParameter.accessToken).concat(
    encodeString(createProjectParameter.projectName)
  );

export const encodeCreateIdeaParameter = (
  createIdeaParameter: CreateIdeaParameter
): ReadonlyArray<number> =>
  encodeToken(createIdeaParameter.accessToken)
    .concat(encodeString(createIdeaParameter.ideaName))
    .concat(encodeId(createIdeaParameter.projectId));

export const encodeAddCommentParameter = (
  addCommentParameter: AddCommentParameter
): ReadonlyArray<number> =>
  encodeToken(addCommentParameter.accessToken)
    .concat(encodeId(addCommentParameter.ideaId))
    .concat(encodeString(addCommentParameter.comment));

export const encodeAddSuggestionParameter = (
  addSuggestionParameter: AddSuggestionParameter
): ReadonlyArray<number> =>
  encodeToken(addSuggestionParameter.accessToken).concat(
    encodeId(addSuggestionParameter.ideaId)
  );

export const encodeUpdateSuggestionParameter = (
  updateSuggestionParameter: UpdateSuggestionParameter
): ReadonlyArray<number> =>
  encodeToken(updateSuggestionParameter.accessToke)
    .concat(encodeId(updateSuggestionParameter.suggestionId))
    .concat(encodeString(updateSuggestionParameter.name))
    .concat(encodeString(updateSuggestionParameter.reason))
    .concat(encodeList(encodeChange)(updateSuggestionParameter.changeList));

export const encodeAccessTokenAndSuggestionId = (
  accessTokenAndSuggestionId: AccessTokenAndSuggestionId
): ReadonlyArray<number> =>
  encodeToken(accessTokenAndSuggestionId.accessToke).concat(
    encodeId(accessTokenAndSuggestionId.suggestionId)
  );

/**
 * SignedLeb128で表現されたバイナリをnumberのビット演算ができる32bit符号付き整数の範囲の数値に変換するコード
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeInt32 = (
  index: number,
  binary: Uint8Array
): { result: number; nextIndex: number } => {
  let result: number = 0;
  let offset: number = 0;
  while (true) {
    const byte: number = binary[index + offset];
    result |= (byte & 127) << (offset * 7);
    offset += 1;
    if ((128 & byte) === 0) {
      if (offset * 7 < 32 && (byte & 64) !== 0) {
        return {
          result: result | (~0 << (offset * 7)),
          nextIndex: index + offset,
        };
      }
      return { result: result, nextIndex: index + offset };
    }
  }
};

/**
 * バイナリからstringに変換する.
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeString = (
  index: number,
  binary: Uint8Array
): { result: string; nextIndex: number } => {
  const length: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  const nextIndex: number = length.nextIndex + length.result;
  const textBinary: Uint8Array = binary.slice(length.nextIndex, nextIndex);
  const isBrowser: boolean =
    process === undefined || process.title === "browser";
  if (isBrowser) {
    return {
      result: new TextDecoder().decode(textBinary),
      nextIndex: nextIndex,
    };
  }
  return {
    result: new a.TextDecoder().decode(textBinary),
    nextIndex: nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeBool = (
  index: number,
  binary: Uint8Array
): { result: boolean; nextIndex: number } => ({
  result: binary[index] !== 0,
  nextIndex: index + 1,
});

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeBinary = (
  index: number,
  binary: Uint8Array
): { result: Uint8Array; nextIndex: number } => {
  const length: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  const nextIndex: number = length.nextIndex + length.result;
  return {
    result: binary.slice(length.nextIndex, nextIndex),
    nextIndex: nextIndex,
  };
};

export const decodeList = <T>(
  decodeFunction: (a: number, b: Uint8Array) => { result: T; nextIndex: number }
): ((
  a: number,
  b: Uint8Array
) => { result: ReadonlyArray<T>; nextIndex: number }) => (
  index: number,
  binary: Uint8Array
): { result: ReadonlyArray<T>; nextIndex: number } => {
  const lengthResult: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  index = lengthResult.nextIndex;
  const result: Array<T> = [];
  for (let i = 0; i < lengthResult.result; i += 1) {
    const resultAndNextIndex: { result: T; nextIndex: number } = decodeFunction(
      index,
      binary
    );
    result.push(resultAndNextIndex.result);
    index = resultAndNextIndex.nextIndex;
  }
  return { result: result, nextIndex: index };
};

export const decodeMaybe = <T>(
  decodeFunction: (a: number, b: Uint8Array) => { result: T; nextIndex: number }
): ((a: number, b: Uint8Array) => { result: Maybe<T>; nextIndex: number }) => (
  index: number,
  binary: Uint8Array
): { result: Maybe<T>; nextIndex: number } => {
  const patternIndexAndNextIndex: {
    result: number;
    nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndexAndNextIndex.result === 0) {
    const valueAndNextIndex: { result: T; nextIndex: number } = decodeFunction(
      patternIndexAndNextIndex.nextIndex,
      binary
    );
    return {
      result: maybeJust(valueAndNextIndex.result),
      nextIndex: valueAndNextIndex.nextIndex,
    };
  }
  if (patternIndexAndNextIndex.result === 1) {
    return {
      result: maybeNothing(),
      nextIndex: patternIndexAndNextIndex.nextIndex,
    };
  }
  throw new Error(
    "存在しないMaybeのパターンを受け取った. 型情報を更新してください"
  );
};

export const decodeResult = <ok, error>(
  okDecodeFunction: (
    a: number,
    b: Uint8Array
  ) => { result: ok; nextIndex: number },
  errorDecodeFunction: (
    a: number,
    b: Uint8Array
  ) => { result: error; nextIndex: number }
): ((
  a: number,
  b: Uint8Array
) => { result: Result<ok, error>; nextIndex: number }) => (
  index: number,
  binary: Uint8Array
): { result: Result<ok, error>; nextIndex: number } => {
  const patternIndexAndNextIndex: {
    result: number;
    nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndexAndNextIndex.result === 0) {
    const okAndNextIndex: { result: ok; nextIndex: number } = okDecodeFunction(
      patternIndexAndNextIndex.nextIndex,
      binary
    );
    return {
      result: resultOk(okAndNextIndex.result),
      nextIndex: okAndNextIndex.nextIndex,
    };
  }
  if (patternIndexAndNextIndex.result === 1) {
    const errorAndNextIndex: {
      result: error;
      nextIndex: number;
    } = errorDecodeFunction(patternIndexAndNextIndex.nextIndex, binary);
    return {
      result: resultError(errorAndNextIndex.result),
      nextIndex: errorAndNextIndex.nextIndex,
    };
  }
  throw new Error(
    "存在しないResultのパターンを受け取った. 型情報を更新してください"
  );
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeId = (
  index: number,
  binary: Uint8Array
): { result: string; nextIndex: number } => ({
  result: [...binary.slice(index, index + 16)]
    .map((n: number): string => n.toString(16).padStart(2, "0"))
    .join(""),
  nextIndex: index + 16,
});

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeToken = (
  index: number,
  binary: Uint8Array
): { result: string; nextIndex: number } => ({
  result: [...binary.slice(index, index + 32)]
    .map((n: number): string => n.toString(16).padStart(2, "0"))
    .join(""),
  nextIndex: index + 32,
});

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTime = (
  index: number,
  binary: Uint8Array
): { result: Time; nextIndex: number } => {
  const dayAndNextIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  const millisecondAndNextIndex: {
    result: number;
    nextIndex: number;
  } = decodeInt32(dayAndNextIndex.nextIndex, binary);
  return {
    result: {
      day: dayAndNextIndex.result,
      millisecond: millisecondAndNextIndex.result,
    },
    nextIndex: millisecondAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeRequestLogInUrlRequestData = (
  index: number,
  binary: Uint8Array
): { result: RequestLogInUrlRequestData; nextIndex: number } => {
  const openIdConnectProviderAndNextIndex: {
    result: OpenIdConnectProvider;
    nextIndex: number;
  } = decodeOpenIdConnectProvider(index, binary);
  const urlDataAndNextIndex: {
    result: UrlData;
    nextIndex: number;
  } = decodeUrlData(openIdConnectProviderAndNextIndex.nextIndex, binary);
  return {
    result: {
      openIdConnectProvider: openIdConnectProviderAndNextIndex.result,
      urlData: urlDataAndNextIndex.result,
    },
    nextIndex: urlDataAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeOpenIdConnectProvider = (
  index: number,
  binary: Uint8Array
): { result: OpenIdConnectProvider; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return { result: "Google", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: "GitHub", nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeUrlData = (
  index: number,
  binary: Uint8Array
): { result: UrlData; nextIndex: number } => {
  const clientModeAndNextIndex: {
    result: ClientMode;
    nextIndex: number;
  } = decodeClientMode(index, binary);
  const locationAndNextIndex: {
    result: Location;
    nextIndex: number;
  } = decodeLocation(clientModeAndNextIndex.nextIndex, binary);
  const languageAndNextIndex: {
    result: Language;
    nextIndex: number;
  } = decodeLanguage(locationAndNextIndex.nextIndex, binary);
  return {
    result: {
      clientMode: clientModeAndNextIndex.result,
      location: locationAndNextIndex.result,
      language: languageAndNextIndex.result,
    },
    nextIndex: languageAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeClientMode = (
  index: number,
  binary: Uint8Array
): { result: ClientMode; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return { result: "DebugMode", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: "Release", nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeLocation = (
  index: number,
  binary: Uint8Array
): { result: Location; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return { result: locationHome, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: locationCreateProject, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    const result: { result: ProjectId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: ProjectId; nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: locationCreateIdea(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 3) {
    const result: { result: UserId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: UserId; nextIndex: number })(patternIndex.nextIndex, binary);
    return { result: locationUser(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 4) {
    const result: { result: ProjectId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: ProjectId; nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: locationProject(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 5) {
    const result: { result: IdeaId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: IdeaId; nextIndex: number })(patternIndex.nextIndex, binary);
    return { result: locationIdea(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 6) {
    const result: { result: SuggestionId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: SuggestionId; nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: locationSuggestion(result.result),
      nextIndex: result.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeLanguage = (
  index: number,
  binary: Uint8Array
): { result: Language; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return { result: "Japanese", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: "English", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    return { result: "Esperanto", nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeUserSnapshot = (
  index: number,
  binary: Uint8Array
): { result: UserSnapshot; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const imageHashAndNextIndex: {
    result: FileHash;
    nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { result: FileHash; nextIndex: number })(
    nameAndNextIndex.nextIndex,
    binary
  );
  const introductionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(imageHashAndNextIndex.nextIndex, binary);
  const createTimeAndNextIndex: {
    result: Time;
    nextIndex: number;
  } = decodeTime(introductionAndNextIndex.nextIndex, binary);
  const likeProjectIdListAndNextIndex: {
    result: ReadonlyArray<ProjectId>;
    nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: ProjectId; nextIndex: number }
  )(createTimeAndNextIndex.nextIndex, binary);
  const developProjectIdListAndNextIndex: {
    result: ReadonlyArray<ProjectId>;
    nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: ProjectId; nextIndex: number }
  )(likeProjectIdListAndNextIndex.nextIndex, binary);
  const commentIdeaIdListAndNextIndex: {
    result: ReadonlyArray<IdeaId>;
    nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: IdeaId; nextIndex: number }
  )(developProjectIdListAndNextIndex.nextIndex, binary);
  const getTimeAndNextIndex: { result: Time; nextIndex: number } = decodeTime(
    commentIdeaIdListAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      name: nameAndNextIndex.result,
      imageHash: imageHashAndNextIndex.result,
      introduction: introductionAndNextIndex.result,
      createTime: createTimeAndNextIndex.result,
      likeProjectIdList: likeProjectIdListAndNextIndex.result,
      developProjectIdList: developProjectIdListAndNextIndex.result,
      commentIdeaIdList: commentIdeaIdListAndNextIndex.result,
      getTime: getTimeAndNextIndex.result,
    },
    nextIndex: getTimeAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeUserSnapshotAndId = (
  index: number,
  binary: Uint8Array
): { result: UserSnapshotAndId; nextIndex: number } => {
  const idAndNextIndex: { result: UserId; nextIndex: number } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: UserId; nextIndex: number })(index, binary);
  const snapshotAndNextIndex: {
    result: UserSnapshot;
    nextIndex: number;
  } = decodeUserSnapshot(idAndNextIndex.nextIndex, binary);
  return {
    result: {
      id: idAndNextIndex.result,
      snapshot: snapshotAndNextIndex.result,
    },
    nextIndex: snapshotAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeUserResponse = (
  index: number,
  binary: Uint8Array
): { result: UserResponse; nextIndex: number } => {
  const idAndNextIndex: { result: UserId; nextIndex: number } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: UserId; nextIndex: number })(index, binary);
  const snapshotMaybeAndNextIndex: {
    result: Maybe<UserSnapshot>;
    nextIndex: number;
  } = decodeMaybe(decodeUserSnapshot)(idAndNextIndex.nextIndex, binary);
  return {
    result: {
      id: idAndNextIndex.result,
      snapshotMaybe: snapshotMaybeAndNextIndex.result,
    },
    nextIndex: snapshotMaybeAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeProjectSnapshot = (
  index: number,
  binary: Uint8Array
): { result: ProjectSnapshot; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const iconHashAndNextIndex: {
    result: FileHash;
    nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { result: FileHash; nextIndex: number })(
    nameAndNextIndex.nextIndex,
    binary
  );
  const imageHashAndNextIndex: {
    result: FileHash;
    nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { result: FileHash; nextIndex: number })(
    iconHashAndNextIndex.nextIndex,
    binary
  );
  const createTimeAndNextIndex: {
    result: Time;
    nextIndex: number;
  } = decodeTime(imageHashAndNextIndex.nextIndex, binary);
  const createUserAndNextIndex: {
    result: UserId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: UserId; nextIndex: number })(
    createTimeAndNextIndex.nextIndex,
    binary
  );
  const updateTimeAndNextIndex: {
    result: Time;
    nextIndex: number;
  } = decodeTime(createUserAndNextIndex.nextIndex, binary);
  const getTimeAndNextIndex: { result: Time; nextIndex: number } = decodeTime(
    updateTimeAndNextIndex.nextIndex,
    binary
  );
  const partIdListAndNextIndex: {
    result: ReadonlyArray<PartId>;
    nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: PartId; nextIndex: number }
  )(getTimeAndNextIndex.nextIndex, binary);
  const typePartIdListAndNextIndex: {
    result: ReadonlyArray<TypePartId>;
    nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: TypePartId; nextIndex: number }
  )(partIdListAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      iconHash: iconHashAndNextIndex.result,
      imageHash: imageHashAndNextIndex.result,
      createTime: createTimeAndNextIndex.result,
      createUser: createUserAndNextIndex.result,
      updateTime: updateTimeAndNextIndex.result,
      getTime: getTimeAndNextIndex.result,
      partIdList: partIdListAndNextIndex.result,
      typePartIdList: typePartIdListAndNextIndex.result,
    },
    nextIndex: typePartIdListAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeProjectSnapshotAndId = (
  index: number,
  binary: Uint8Array
): { result: ProjectSnapshotAndId; nextIndex: number } => {
  const idAndNextIndex: {
    result: ProjectId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: ProjectId; nextIndex: number })(index, binary);
  const snapshotAndNextIndex: {
    result: ProjectSnapshot;
    nextIndex: number;
  } = decodeProjectSnapshot(idAndNextIndex.nextIndex, binary);
  return {
    result: {
      id: idAndNextIndex.result,
      snapshot: snapshotAndNextIndex.result,
    },
    nextIndex: snapshotAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeProjectResponse = (
  index: number,
  binary: Uint8Array
): { result: ProjectResponse; nextIndex: number } => {
  const idAndNextIndex: {
    result: ProjectId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: ProjectId; nextIndex: number })(index, binary);
  const snapshotMaybeAndNextIndex: {
    result: Maybe<ProjectSnapshot>;
    nextIndex: number;
  } = decodeMaybe(decodeProjectSnapshot)(idAndNextIndex.nextIndex, binary);
  return {
    result: {
      id: idAndNextIndex.result,
      snapshotMaybe: snapshotMaybeAndNextIndex.result,
    },
    nextIndex: snapshotMaybeAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeIdeaSnapshot = (
  index: number,
  binary: Uint8Array
): { result: IdeaSnapshot; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const createUserAndNextIndex: {
    result: UserId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: UserId; nextIndex: number })(
    nameAndNextIndex.nextIndex,
    binary
  );
  const createTimeAndNextIndex: {
    result: Time;
    nextIndex: number;
  } = decodeTime(createUserAndNextIndex.nextIndex, binary);
  const projectIdAndNextIndex: {
    result: ProjectId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: ProjectId; nextIndex: number })(
    createTimeAndNextIndex.nextIndex,
    binary
  );
  const itemListAndNextIndex: {
    result: ReadonlyArray<IdeaItem>;
    nextIndex: number;
  } = decodeList(decodeIdeaItem)(projectIdAndNextIndex.nextIndex, binary);
  const updateTimeAndNextIndex: {
    result: Time;
    nextIndex: number;
  } = decodeTime(itemListAndNextIndex.nextIndex, binary);
  const getTimeAndNextIndex: { result: Time; nextIndex: number } = decodeTime(
    updateTimeAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      name: nameAndNextIndex.result,
      createUser: createUserAndNextIndex.result,
      createTime: createTimeAndNextIndex.result,
      projectId: projectIdAndNextIndex.result,
      itemList: itemListAndNextIndex.result,
      updateTime: updateTimeAndNextIndex.result,
      getTime: getTimeAndNextIndex.result,
    },
    nextIndex: getTimeAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeIdeaSnapshotAndId = (
  index: number,
  binary: Uint8Array
): { result: IdeaSnapshotAndId; nextIndex: number } => {
  const idAndNextIndex: { result: IdeaId; nextIndex: number } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: IdeaId; nextIndex: number })(index, binary);
  const snapshotAndNextIndex: {
    result: IdeaSnapshot;
    nextIndex: number;
  } = decodeIdeaSnapshot(idAndNextIndex.nextIndex, binary);
  return {
    result: {
      id: idAndNextIndex.result,
      snapshot: snapshotAndNextIndex.result,
    },
    nextIndex: snapshotAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeIdeaResponse = (
  index: number,
  binary: Uint8Array
): { result: IdeaResponse; nextIndex: number } => {
  const idAndNextIndex: { result: IdeaId; nextIndex: number } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: IdeaId; nextIndex: number })(index, binary);
  const snapshotMaybeAndNextIndex: {
    result: Maybe<IdeaSnapshot>;
    nextIndex: number;
  } = decodeMaybe(decodeIdeaSnapshot)(idAndNextIndex.nextIndex, binary);
  return {
    result: {
      id: idAndNextIndex.result,
      snapshotMaybe: snapshotMaybeAndNextIndex.result,
    },
    nextIndex: snapshotMaybeAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeIdeaListByProjectIdResponse = (
  index: number,
  binary: Uint8Array
): { result: IdeaListByProjectIdResponse; nextIndex: number } => {
  const projectIdAndNextIndex: {
    result: ProjectId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: ProjectId; nextIndex: number })(index, binary);
  const ideaSnapshotAndIdListAndNextIndex: {
    result: ReadonlyArray<IdeaSnapshotAndId>;
    nextIndex: number;
  } = decodeList(decodeIdeaSnapshotAndId)(
    projectIdAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      projectId: projectIdAndNextIndex.result,
      ideaSnapshotAndIdList: ideaSnapshotAndIdListAndNextIndex.result,
    },
    nextIndex: ideaSnapshotAndIdListAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeIdeaItem = (
  index: number,
  binary: Uint8Array
): { result: IdeaItem; nextIndex: number } => {
  const createUserIdAndNextIndex: {
    result: UserId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: UserId; nextIndex: number })(index, binary);
  const createTimeAndNextIndex: {
    result: Time;
    nextIndex: number;
  } = decodeTime(createUserIdAndNextIndex.nextIndex, binary);
  const bodyAndNextIndex: {
    result: ItemBody;
    nextIndex: number;
  } = decodeItemBody(createTimeAndNextIndex.nextIndex, binary);
  return {
    result: {
      createUserId: createUserIdAndNextIndex.result,
      createTime: createTimeAndNextIndex.result,
      body: bodyAndNextIndex.result,
    },
    nextIndex: bodyAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeItemBody = (
  index: number,
  binary: Uint8Array
): { result: ItemBody; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: { result: string; nextIndex: number } = decodeString(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: itemBodyComment(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: { result: SuggestionId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: SuggestionId; nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: itemBodySuggestionCreate(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    const result: { result: SuggestionId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: SuggestionId; nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: itemBodySuggestionToApprovalPending(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 3) {
    const result: { result: SuggestionId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: SuggestionId; nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: itemBodySuggestionCancelToApprovalPending(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 4) {
    const result: { result: SuggestionId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: SuggestionId; nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: itemBodySuggestionApprove(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 5) {
    const result: { result: SuggestionId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: SuggestionId; nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: itemBodySuggestionReject(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 6) {
    const result: { result: SuggestionId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: SuggestionId; nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: itemBodySuggestionCancelRejection(result.result),
      nextIndex: result.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeSuggestionSnapshot = (
  index: number,
  binary: Uint8Array
): { result: SuggestionSnapshot; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const createUserIdAndNextIndex: {
    result: UserId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: UserId; nextIndex: number })(
    nameAndNextIndex.nextIndex,
    binary
  );
  const reasonAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(createUserIdAndNextIndex.nextIndex, binary);
  const stateAndNextIndex: {
    result: SuggestionState;
    nextIndex: number;
  } = decodeSuggestionState(reasonAndNextIndex.nextIndex, binary);
  const changeListAndNextIndex: {
    result: ReadonlyArray<Change>;
    nextIndex: number;
  } = decodeList(decodeChange)(stateAndNextIndex.nextIndex, binary);
  const projectIdAndNextIndex: {
    result: ProjectId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: ProjectId; nextIndex: number })(
    changeListAndNextIndex.nextIndex,
    binary
  );
  const ideaIdAndNextIndex: {
    result: IdeaId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: IdeaId; nextIndex: number })(
    projectIdAndNextIndex.nextIndex,
    binary
  );
  const updateTimeAndNextIndex: {
    result: Time;
    nextIndex: number;
  } = decodeTime(ideaIdAndNextIndex.nextIndex, binary);
  const getTimeAndNextIndex: { result: Time; nextIndex: number } = decodeTime(
    updateTimeAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      name: nameAndNextIndex.result,
      createUserId: createUserIdAndNextIndex.result,
      reason: reasonAndNextIndex.result,
      state: stateAndNextIndex.result,
      changeList: changeListAndNextIndex.result,
      projectId: projectIdAndNextIndex.result,
      ideaId: ideaIdAndNextIndex.result,
      updateTime: updateTimeAndNextIndex.result,
      getTime: getTimeAndNextIndex.result,
    },
    nextIndex: getTimeAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeSuggestionSnapshotAndId = (
  index: number,
  binary: Uint8Array
): { result: SuggestionSnapshotAndId; nextIndex: number } => {
  const idAndNextIndex: {
    result: SuggestionId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: SuggestionId; nextIndex: number })(index, binary);
  const snapshotAndNextIndex: {
    result: SuggestionSnapshot;
    nextIndex: number;
  } = decodeSuggestionSnapshot(idAndNextIndex.nextIndex, binary);
  return {
    result: {
      id: idAndNextIndex.result,
      snapshot: snapshotAndNextIndex.result,
    },
    nextIndex: snapshotAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeSuggestionState = (
  index: number,
  binary: Uint8Array
): { result: SuggestionState; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return { result: "Creating", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: "ApprovalPending", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    return { result: "Approved", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 3) {
    return { result: "Rejected", nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeChange = (
  index: number,
  binary: Uint8Array
): { result: Change; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: { result: string; nextIndex: number } = decodeString(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: changeProjectName(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: { result: AddPart; nextIndex: number } = decodeAddPart(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: changeAddPart(result.result),
      nextIndex: result.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeAddPart = (
  index: number,
  binary: Uint8Array
): { result: AddPart; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const typeAndNextIndex: {
    result: SuggestionType;
    nextIndex: number;
  } = decodeSuggestionType(descriptionAndNextIndex.nextIndex, binary);
  const exprAndNextIndex: {
    result: SuggestionExpr;
    nextIndex: number;
  } = decodeSuggestionExpr(typeAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      type: typeAndNextIndex.result,
      expr: exprAndNextIndex.result,
    },
    nextIndex: exprAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeSuggestionType = (
  index: number,
  binary: Uint8Array
): { result: SuggestionType; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: {
      result: SuggestionTypeInputAndOutput;
      nextIndex: number;
    } = decodeSuggestionTypeInputAndOutput(patternIndex.nextIndex, binary);
    return {
      result: suggestionTypeFunction(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: {
      result: TypePartWithSuggestionTypeParameter;
      nextIndex: number;
    } = decodeTypePartWithSuggestionTypeParameter(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: suggestionTypeTypePartWithParameter(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    const result: {
      result: SuggestionTypePartWithSuggestionTypeParameter;
      nextIndex: number;
    } = decodeSuggestionTypePartWithSuggestionTypeParameter(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: suggestionTypeSuggestionTypePartWithParameter(result.result),
      nextIndex: result.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeSuggestionTypeInputAndOutput = (
  index: number,
  binary: Uint8Array
): { result: SuggestionTypeInputAndOutput; nextIndex: number } => {
  const inputTypeAndNextIndex: {
    result: SuggestionType;
    nextIndex: number;
  } = decodeSuggestionType(index, binary);
  const outputTypeAndNextIndex: {
    result: SuggestionType;
    nextIndex: number;
  } = decodeSuggestionType(inputTypeAndNextIndex.nextIndex, binary);
  return {
    result: {
      inputType: inputTypeAndNextIndex.result,
      outputType: outputTypeAndNextIndex.result,
    },
    nextIndex: outputTypeAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypePartWithSuggestionTypeParameter = (
  index: number,
  binary: Uint8Array
): { result: TypePartWithSuggestionTypeParameter; nextIndex: number } => {
  const typePartIdAndNextIndex: {
    result: TypePartId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: TypePartId; nextIndex: number })(index, binary);
  const parameterAndNextIndex: {
    result: ReadonlyArray<SuggestionType>;
    nextIndex: number;
  } = decodeList(decodeSuggestionType)(
    typePartIdAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      typePartId: typePartIdAndNextIndex.result,
      parameter: parameterAndNextIndex.result,
    },
    nextIndex: parameterAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeSuggestionTypePartWithSuggestionTypeParameter = (
  index: number,
  binary: Uint8Array
): {
  result: SuggestionTypePartWithSuggestionTypeParameter;
  nextIndex: number;
} => {
  const suggestionTypePartIndexAndNextIndex: {
    result: number;
    nextIndex: number;
  } = decodeInt32(index, binary);
  const parameterAndNextIndex: {
    result: ReadonlyArray<SuggestionType>;
    nextIndex: number;
  } = decodeList(decodeSuggestionType)(
    suggestionTypePartIndexAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      suggestionTypePartIndex: suggestionTypePartIndexAndNextIndex.result,
      parameter: parameterAndNextIndex.result,
    },
    nextIndex: parameterAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeSuggestionExpr = (
  index: number,
  binary: Uint8Array
): { result: SuggestionExpr; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: { result: KernelExpr; nextIndex: number } = decodeKernelExpr(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: suggestionExprKernel(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: { result: number; nextIndex: number } = decodeInt32(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: suggestionExprInt32Literal(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    const result: { result: PartId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: PartId; nextIndex: number })(patternIndex.nextIndex, binary);
    return {
      result: suggestionExprPartReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 3) {
    const result: { result: number; nextIndex: number } = decodeInt32(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: suggestionExprSuggestionPartReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 4) {
    const result: {
      result: LocalPartReference;
      nextIndex: number;
    } = decodeLocalPartReference(patternIndex.nextIndex, binary);
    return {
      result: suggestionExprLocalPartReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 5) {
    const result: {
      result: TagReference;
      nextIndex: number;
    } = decodeTagReference(patternIndex.nextIndex, binary);
    return {
      result: suggestionExprTagReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 6) {
    const result: {
      result: SuggestionTagReference;
      nextIndex: number;
    } = decodeSuggestionTagReference(patternIndex.nextIndex, binary);
    return {
      result: suggestionExprSuggestionTagReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 7) {
    const result: {
      result: SuggestionFunctionCall;
      nextIndex: number;
    } = decodeSuggestionFunctionCall(patternIndex.nextIndex, binary);
    return {
      result: suggestionExprFunctionCall(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 8) {
    const result: {
      result: SuggestionLambdaBranch;
      nextIndex: number;
    } = decodeSuggestionLambdaBranch(patternIndex.nextIndex, binary);
    return {
      result: suggestionExprLambda(result.result),
      nextIndex: result.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeSuggestionTagReference = (
  index: number,
  binary: Uint8Array
): { result: SuggestionTagReference; nextIndex: number } => {
  const suggestionTypePartIndexAndNextIndex: {
    result: number;
    nextIndex: number;
  } = decodeInt32(index, binary);
  const tagIndexAndNextIndex: {
    result: number;
    nextIndex: number;
  } = decodeInt32(suggestionTypePartIndexAndNextIndex.nextIndex, binary);
  return {
    result: {
      suggestionTypePartIndex: suggestionTypePartIndexAndNextIndex.result,
      tagIndex: tagIndexAndNextIndex.result,
    },
    nextIndex: tagIndexAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeSuggestionFunctionCall = (
  index: number,
  binary: Uint8Array
): { result: SuggestionFunctionCall; nextIndex: number } => {
  const functionAndNextIndex: {
    result: SuggestionExpr;
    nextIndex: number;
  } = decodeSuggestionExpr(index, binary);
  const parameterAndNextIndex: {
    result: SuggestionExpr;
    nextIndex: number;
  } = decodeSuggestionExpr(functionAndNextIndex.nextIndex, binary);
  return {
    result: {
      function: functionAndNextIndex.result,
      parameter: parameterAndNextIndex.result,
    },
    nextIndex: parameterAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeSuggestionLambdaBranch = (
  index: number,
  binary: Uint8Array
): { result: SuggestionLambdaBranch; nextIndex: number } => {
  const conditionAndNextIndex: {
    result: Condition;
    nextIndex: number;
  } = decodeCondition(index, binary);
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(conditionAndNextIndex.nextIndex, binary);
  const localPartListAndNextIndex: {
    result: ReadonlyArray<SuggestionBranchPartDefinition>;
    nextIndex: number;
  } = decodeList(decodeSuggestionBranchPartDefinition)(
    descriptionAndNextIndex.nextIndex,
    binary
  );
  const exprAndNextIndex: {
    result: Maybe<SuggestionExpr>;
    nextIndex: number;
  } = decodeMaybe(decodeSuggestionExpr)(
    localPartListAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      condition: conditionAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      localPartList: localPartListAndNextIndex.result,
      expr: exprAndNextIndex.result,
    },
    nextIndex: exprAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeSuggestionBranchPartDefinition = (
  index: number,
  binary: Uint8Array
): { result: SuggestionBranchPartDefinition; nextIndex: number } => {
  const localPartIdAndNextIndex: {
    result: LocalPartId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: LocalPartId; nextIndex: number })(index, binary);
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    localPartIdAndNextIndex.nextIndex,
    binary
  );
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const typeAndNextIndex: {
    result: SuggestionType;
    nextIndex: number;
  } = decodeSuggestionType(descriptionAndNextIndex.nextIndex, binary);
  const exprAndNextIndex: {
    result: SuggestionExpr;
    nextIndex: number;
  } = decodeSuggestionExpr(typeAndNextIndex.nextIndex, binary);
  return {
    result: {
      localPartId: localPartIdAndNextIndex.result,
      name: nameAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      type: typeAndNextIndex.result,
      expr: exprAndNextIndex.result,
    },
    nextIndex: exprAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypePartSnapshot = (
  index: number,
  binary: Uint8Array
): { result: TypePartSnapshot; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const parentListAndNextIndex: {
    result: ReadonlyArray<PartId>;
    nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: PartId; nextIndex: number }
  )(nameAndNextIndex.nextIndex, binary);
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(parentListAndNextIndex.nextIndex, binary);
  const projectIdAndNextIndex: {
    result: ProjectId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: ProjectId; nextIndex: number })(
    descriptionAndNextIndex.nextIndex,
    binary
  );
  const createSuggestionIdAndNextIndex: {
    result: SuggestionId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: SuggestionId; nextIndex: number })(
    projectIdAndNextIndex.nextIndex,
    binary
  );
  const getTimeAndNextIndex: { result: Time; nextIndex: number } = decodeTime(
    createSuggestionIdAndNextIndex.nextIndex,
    binary
  );
  const bodyAndNextIndex: {
    result: TypePartBody;
    nextIndex: number;
  } = decodeTypePartBody(getTimeAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      parentList: parentListAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      projectId: projectIdAndNextIndex.result,
      createSuggestionId: createSuggestionIdAndNextIndex.result,
      getTime: getTimeAndNextIndex.result,
      body: bodyAndNextIndex.result,
    },
    nextIndex: bodyAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodePartSnapshot = (
  index: number,
  binary: Uint8Array
): { result: PartSnapshot; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const parentListAndNextIndex: {
    result: ReadonlyArray<PartId>;
    nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: PartId; nextIndex: number }
  )(nameAndNextIndex.nextIndex, binary);
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(parentListAndNextIndex.nextIndex, binary);
  const typeAndNextIndex: { result: Type; nextIndex: number } = decodeType(
    descriptionAndNextIndex.nextIndex,
    binary
  );
  const exprAndNextIndex: {
    result: Maybe<Expr>;
    nextIndex: number;
  } = decodeMaybe(decodeExpr)(typeAndNextIndex.nextIndex, binary);
  const projectIdAndNextIndex: {
    result: ProjectId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: ProjectId; nextIndex: number })(
    exprAndNextIndex.nextIndex,
    binary
  );
  const createSuggestionIdAndNextIndex: {
    result: SuggestionId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: SuggestionId; nextIndex: number })(
    projectIdAndNextIndex.nextIndex,
    binary
  );
  const getTimeAndNextIndex: { result: Time; nextIndex: number } = decodeTime(
    createSuggestionIdAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      name: nameAndNextIndex.result,
      parentList: parentListAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      type: typeAndNextIndex.result,
      expr: exprAndNextIndex.result,
      projectId: projectIdAndNextIndex.result,
      createSuggestionId: createSuggestionIdAndNextIndex.result,
      getTime: getTimeAndNextIndex.result,
    },
    nextIndex: getTimeAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypePartBody = (
  index: number,
  binary: Uint8Array
): { result: TypePartBody; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: {
      result: ReadonlyArray<TypePartBodyProductMember>;
      nextIndex: number;
    } = decodeList(decodeTypePartBodyProductMember)(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: typePartBodyProduct(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: {
      result: ReadonlyArray<TypePartBodySumPattern>;
      nextIndex: number;
    } = decodeList(decodeTypePartBodySumPattern)(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: typePartBodySum(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    const result: {
      result: TypePartBodyKernel;
      nextIndex: number;
    } = decodeTypePartBodyKernel(patternIndex.nextIndex, binary);
    return {
      result: typePartBodyKernel(result.result),
      nextIndex: result.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypePartBodyProductMember = (
  index: number,
  binary: Uint8Array
): { result: TypePartBodyProductMember; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const memberTypeAndNextIndex: {
    result: Type;
    nextIndex: number;
  } = decodeType(descriptionAndNextIndex.nextIndex, binary);
  return {
    result: {
      name: nameAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      memberType: memberTypeAndNextIndex.result,
    },
    nextIndex: memberTypeAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypePartBodySumPattern = (
  index: number,
  binary: Uint8Array
): { result: TypePartBodySumPattern; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const parameterAndNextIndex: { result: Type; nextIndex: number } = decodeType(
    descriptionAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      name: nameAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      parameter: parameterAndNextIndex.result,
    },
    nextIndex: parameterAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypePartBodyKernel = (
  index: number,
  binary: Uint8Array
): { result: TypePartBodyKernel; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return { result: "Int32", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: "List", nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeType = (
  index: number,
  binary: Uint8Array
): { result: Type; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: {
      result: TypeInputAndOutput;
      nextIndex: number;
    } = decodeTypeInputAndOutput(patternIndex.nextIndex, binary);
    return { result: typeFunction(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 1) {
    const result: {
      result: TypePartIdWithParameter;
      nextIndex: number;
    } = decodeTypePartIdWithParameter(patternIndex.nextIndex, binary);
    return {
      result: typeTypePartWithParameter(result.result),
      nextIndex: result.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypeInputAndOutput = (
  index: number,
  binary: Uint8Array
): { result: TypeInputAndOutput; nextIndex: number } => {
  const inputTypeAndNextIndex: { result: Type; nextIndex: number } = decodeType(
    index,
    binary
  );
  const outputTypeAndNextIndex: {
    result: Type;
    nextIndex: number;
  } = decodeType(inputTypeAndNextIndex.nextIndex, binary);
  return {
    result: {
      inputType: inputTypeAndNextIndex.result,
      outputType: outputTypeAndNextIndex.result,
    },
    nextIndex: outputTypeAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypePartIdWithParameter = (
  index: number,
  binary: Uint8Array
): { result: TypePartIdWithParameter; nextIndex: number } => {
  const typePartIdAndNextIndex: {
    result: TypePartId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: TypePartId; nextIndex: number })(index, binary);
  const parameterAndNextIndex: {
    result: ReadonlyArray<Type>;
    nextIndex: number;
  } = decodeList(decodeType)(typePartIdAndNextIndex.nextIndex, binary);
  return {
    result: {
      typePartId: typePartIdAndNextIndex.result,
      parameter: parameterAndNextIndex.result,
    },
    nextIndex: parameterAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeExpr = (
  index: number,
  binary: Uint8Array
): { result: Expr; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: { result: KernelExpr; nextIndex: number } = decodeKernelExpr(
      patternIndex.nextIndex,
      binary
    );
    return { result: exprKernel(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 1) {
    const result: { result: number; nextIndex: number } = decodeInt32(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: exprInt32Literal(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    const result: { result: PartId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: PartId; nextIndex: number })(patternIndex.nextIndex, binary);
    return {
      result: exprPartReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 3) {
    const result: {
      result: LocalPartReference;
      nextIndex: number;
    } = decodeLocalPartReference(patternIndex.nextIndex, binary);
    return {
      result: exprLocalPartReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 4) {
    const result: {
      result: TagReference;
      nextIndex: number;
    } = decodeTagReference(patternIndex.nextIndex, binary);
    return {
      result: exprTagReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 5) {
    const result: {
      result: FunctionCall;
      nextIndex: number;
    } = decodeFunctionCall(patternIndex.nextIndex, binary);
    return {
      result: exprFunctionCall(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 6) {
    const result: {
      result: ReadonlyArray<LambdaBranch>;
      nextIndex: number;
    } = decodeList(decodeLambdaBranch)(patternIndex.nextIndex, binary);
    return { result: exprLambda(result.result), nextIndex: result.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeEvaluatedExpr = (
  index: number,
  binary: Uint8Array
): { result: EvaluatedExpr; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: { result: KernelExpr; nextIndex: number } = decodeKernelExpr(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: evaluatedExprKernel(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: { result: number; nextIndex: number } = decodeInt32(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: evaluatedExprInt32(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    const result: {
      result: LocalPartReference;
      nextIndex: number;
    } = decodeLocalPartReference(patternIndex.nextIndex, binary);
    return {
      result: evaluatedExprLocalPartReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 3) {
    const result: {
      result: TagReference;
      nextIndex: number;
    } = decodeTagReference(patternIndex.nextIndex, binary);
    return {
      result: evaluatedExprTagReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 4) {
    const result: {
      result: ReadonlyArray<LambdaBranch>;
      nextIndex: number;
    } = decodeList(decodeLambdaBranch)(patternIndex.nextIndex, binary);
    return {
      result: evaluatedExprLambda(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 5) {
    const result: { result: KernelCall; nextIndex: number } = decodeKernelCall(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: evaluatedExprKernelCall(result.result),
      nextIndex: result.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeKernelCall = (
  index: number,
  binary: Uint8Array
): { result: KernelCall; nextIndex: number } => {
  const kernelAndNextIndex: {
    result: KernelExpr;
    nextIndex: number;
  } = decodeKernelExpr(index, binary);
  const exprAndNextIndex: {
    result: EvaluatedExpr;
    nextIndex: number;
  } = decodeEvaluatedExpr(kernelAndNextIndex.nextIndex, binary);
  return {
    result: {
      kernel: kernelAndNextIndex.result,
      expr: exprAndNextIndex.result,
    },
    nextIndex: exprAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeKernelExpr = (
  index: number,
  binary: Uint8Array
): { result: KernelExpr; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    return { result: "Int32Add", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: "Int32Sub", nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    return { result: "Int32Mul", nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeLocalPartReference = (
  index: number,
  binary: Uint8Array
): { result: LocalPartReference; nextIndex: number } => {
  const partIdAndNextIndex: {
    result: PartId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: PartId; nextIndex: number })(index, binary);
  const localPartIdAndNextIndex: {
    result: LocalPartId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: LocalPartId; nextIndex: number })(
    partIdAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      partId: partIdAndNextIndex.result,
      localPartId: localPartIdAndNextIndex.result,
    },
    nextIndex: localPartIdAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTagReference = (
  index: number,
  binary: Uint8Array
): { result: TagReference; nextIndex: number } => {
  const typePartIdAndNextIndex: {
    result: TypePartId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: TypePartId; nextIndex: number })(index, binary);
  const tagIdAndNextIndex: { result: TagId; nextIndex: number } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: TagId; nextIndex: number })(
    typePartIdAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      typePartId: typePartIdAndNextIndex.result,
      tagId: tagIdAndNextIndex.result,
    },
    nextIndex: tagIdAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeFunctionCall = (
  index: number,
  binary: Uint8Array
): { result: FunctionCall; nextIndex: number } => {
  const functionAndNextIndex: { result: Expr; nextIndex: number } = decodeExpr(
    index,
    binary
  );
  const parameterAndNextIndex: { result: Expr; nextIndex: number } = decodeExpr(
    functionAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      function: functionAndNextIndex.result,
      parameter: parameterAndNextIndex.result,
    },
    nextIndex: parameterAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeLambdaBranch = (
  index: number,
  binary: Uint8Array
): { result: LambdaBranch; nextIndex: number } => {
  const conditionAndNextIndex: {
    result: Condition;
    nextIndex: number;
  } = decodeCondition(index, binary);
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(conditionAndNextIndex.nextIndex, binary);
  const localPartListAndNextIndex: {
    result: ReadonlyArray<BranchPartDefinition>;
    nextIndex: number;
  } = decodeList(decodeBranchPartDefinition)(
    descriptionAndNextIndex.nextIndex,
    binary
  );
  const exprAndNextIndex: {
    result: Maybe<Expr>;
    nextIndex: number;
  } = decodeMaybe(decodeExpr)(localPartListAndNextIndex.nextIndex, binary);
  return {
    result: {
      condition: conditionAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      localPartList: localPartListAndNextIndex.result,
      expr: exprAndNextIndex.result,
    },
    nextIndex: exprAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeCondition = (
  index: number,
  binary: Uint8Array
): { result: Condition; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: {
      result: ConditionTag;
      nextIndex: number;
    } = decodeConditionTag(patternIndex.nextIndex, binary);
    return {
      result: conditionByTag(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: {
      result: ConditionCapture;
      nextIndex: number;
    } = decodeConditionCapture(patternIndex.nextIndex, binary);
    return {
      result: conditionByCapture(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    return { result: conditionAny, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 3) {
    const result: { result: number; nextIndex: number } = decodeInt32(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: conditionInt32(result.result),
      nextIndex: result.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeConditionTag = (
  index: number,
  binary: Uint8Array
): { result: ConditionTag; nextIndex: number } => {
  const tagAndNextIndex: { result: TagId; nextIndex: number } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: TagId; nextIndex: number })(index, binary);
  const parameterAndNextIndex: {
    result: Maybe<Condition>;
    nextIndex: number;
  } = decodeMaybe(decodeCondition)(tagAndNextIndex.nextIndex, binary);
  return {
    result: {
      tag: tagAndNextIndex.result,
      parameter: parameterAndNextIndex.result,
    },
    nextIndex: parameterAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeConditionCapture = (
  index: number,
  binary: Uint8Array
): { result: ConditionCapture; nextIndex: number } => {
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    index,
    binary
  );
  const localPartIdAndNextIndex: {
    result: LocalPartId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: LocalPartId; nextIndex: number })(
    nameAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      name: nameAndNextIndex.result,
      localPartId: localPartIdAndNextIndex.result,
    },
    nextIndex: localPartIdAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeBranchPartDefinition = (
  index: number,
  binary: Uint8Array
): { result: BranchPartDefinition; nextIndex: number } => {
  const localPartIdAndNextIndex: {
    result: LocalPartId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: LocalPartId; nextIndex: number })(index, binary);
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    localPartIdAndNextIndex.nextIndex,
    binary
  );
  const descriptionAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const typeAndNextIndex: { result: Type; nextIndex: number } = decodeType(
    descriptionAndNextIndex.nextIndex,
    binary
  );
  const exprAndNextIndex: { result: Expr; nextIndex: number } = decodeExpr(
    typeAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      localPartId: localPartIdAndNextIndex.result,
      name: nameAndNextIndex.result,
      description: descriptionAndNextIndex.result,
      type: typeAndNextIndex.result,
      expr: exprAndNextIndex.result,
    },
    nextIndex: exprAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeEvaluateExprError = (
  index: number,
  binary: Uint8Array
): { result: EvaluateExprError; nextIndex: number } => {
  const patternIndex: { result: number; nextIndex: number } = decodeInt32(
    index,
    binary
  );
  if (patternIndex.result === 0) {
    const result: { result: PartId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: PartId; nextIndex: number })(patternIndex.nextIndex, binary);
    return {
      result: evaluateExprErrorNeedPartDefinition(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: { result: PartId; nextIndex: number } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { result: PartId; nextIndex: number })(patternIndex.nextIndex, binary);
    return {
      result: evaluateExprErrorPartExprIsNothing(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    const result: {
      result: LocalPartReference;
      nextIndex: number;
    } = decodeLocalPartReference(patternIndex.nextIndex, binary);
    return {
      result: evaluateExprErrorCannotFindLocalPartDefinition(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 3) {
    const result: { result: TypeError; nextIndex: number } = decodeTypeError(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: evaluateExprErrorTypeError(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 4) {
    return {
      result: evaluateExprErrorNotSupported,
      nextIndex: patternIndex.nextIndex,
    };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypeError = (
  index: number,
  binary: Uint8Array
): { result: TypeError; nextIndex: number } => {
  const messageAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(index, binary);
  return {
    result: { message: messageAndNextIndex.result },
    nextIndex: messageAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeCreateProjectParameter = (
  index: number,
  binary: Uint8Array
): { result: CreateProjectParameter; nextIndex: number } => {
  const accessTokenAndNextIndex: {
    result: AccessToken;
    nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { result: AccessToken; nextIndex: number })(index, binary);
  const projectNameAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(accessTokenAndNextIndex.nextIndex, binary);
  return {
    result: {
      accessToken: accessTokenAndNextIndex.result,
      projectName: projectNameAndNextIndex.result,
    },
    nextIndex: projectNameAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeCreateIdeaParameter = (
  index: number,
  binary: Uint8Array
): { result: CreateIdeaParameter; nextIndex: number } => {
  const accessTokenAndNextIndex: {
    result: AccessToken;
    nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { result: AccessToken; nextIndex: number })(index, binary);
  const ideaNameAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(accessTokenAndNextIndex.nextIndex, binary);
  const projectIdAndNextIndex: {
    result: ProjectId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: ProjectId; nextIndex: number })(
    ideaNameAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      accessToken: accessTokenAndNextIndex.result,
      ideaName: ideaNameAndNextIndex.result,
      projectId: projectIdAndNextIndex.result,
    },
    nextIndex: projectIdAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeAddCommentParameter = (
  index: number,
  binary: Uint8Array
): { result: AddCommentParameter; nextIndex: number } => {
  const accessTokenAndNextIndex: {
    result: AccessToken;
    nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { result: AccessToken; nextIndex: number })(index, binary);
  const ideaIdAndNextIndex: {
    result: IdeaId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: IdeaId; nextIndex: number })(
    accessTokenAndNextIndex.nextIndex,
    binary
  );
  const commentAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(ideaIdAndNextIndex.nextIndex, binary);
  return {
    result: {
      accessToken: accessTokenAndNextIndex.result,
      ideaId: ideaIdAndNextIndex.result,
      comment: commentAndNextIndex.result,
    },
    nextIndex: commentAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeAddSuggestionParameter = (
  index: number,
  binary: Uint8Array
): { result: AddSuggestionParameter; nextIndex: number } => {
  const accessTokenAndNextIndex: {
    result: AccessToken;
    nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { result: AccessToken; nextIndex: number })(index, binary);
  const ideaIdAndNextIndex: {
    result: IdeaId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: IdeaId; nextIndex: number })(
    accessTokenAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      accessToken: accessTokenAndNextIndex.result,
      ideaId: ideaIdAndNextIndex.result,
    },
    nextIndex: ideaIdAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeUpdateSuggestionParameter = (
  index: number,
  binary: Uint8Array
): { result: UpdateSuggestionParameter; nextIndex: number } => {
  const accessTokeAndNextIndex: {
    result: AccessToken;
    nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { result: AccessToken; nextIndex: number })(index, binary);
  const suggestionIdAndNextIndex: {
    result: SuggestionId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: SuggestionId; nextIndex: number })(
    accessTokeAndNextIndex.nextIndex,
    binary
  );
  const nameAndNextIndex: { result: string; nextIndex: number } = decodeString(
    suggestionIdAndNextIndex.nextIndex,
    binary
  );
  const reasonAndNextIndex: {
    result: string;
    nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const changeListAndNextIndex: {
    result: ReadonlyArray<Change>;
    nextIndex: number;
  } = decodeList(decodeChange)(reasonAndNextIndex.nextIndex, binary);
  return {
    result: {
      accessToke: accessTokeAndNextIndex.result,
      suggestionId: suggestionIdAndNextIndex.result,
      name: nameAndNextIndex.result,
      reason: reasonAndNextIndex.result,
      changeList: changeListAndNextIndex.result,
    },
    nextIndex: changeListAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeAccessTokenAndSuggestionId = (
  index: number,
  binary: Uint8Array
): { result: AccessTokenAndSuggestionId; nextIndex: number } => {
  const accessTokeAndNextIndex: {
    result: AccessToken;
    nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { result: AccessToken; nextIndex: number })(index, binary);
  const suggestionIdAndNextIndex: {
    result: SuggestionId;
    nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { result: SuggestionId; nextIndex: number })(
    accessTokeAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      accessToke: accessTokeAndNextIndex.result,
      suggestionId: suggestionIdAndNextIndex.result,
    },
    nextIndex: suggestionIdAndNextIndex.nextIndex,
  };
};
