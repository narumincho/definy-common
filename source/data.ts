import * as a from "util";

/**
 * Maybe
 */
export type Maybe<T> =
  | { readonly _: "Just"; readonly value: T }
  | { readonly _: "Nothing" };

/**
 * Result
 */
export type Result<ok, error> =
  | { readonly _: "Ok"; readonly ok: ok }
  | { readonly _: "Error"; readonly error: error };

/**
 * 日時. 0001-01-01T00:00:00.000Z to 9999-12-31T23:59:59.999Z 最小単位はミリ秒. ミリ秒の求め方は day*1000*60*60*24 + millisecond
 */
export type Time = {
  /**
   * 1970-01-01からの経過日数. マイナスになることもある
   */
  readonly day: number;
  /**
   * 日にちの中のミリ秒. 0 to 86399999 (=1000*60*60*24-1)
   */
  readonly millisecond: number;
};

/**
 * ログインのURLを発行するために必要なデータ
 */
export type RequestLogInUrlRequestData = {
  /**
   * ログインに使用するプロバイダー
   */
  readonly openIdConnectProvider: OpenIdConnectProvider;
  /**
   * ログインした後に返ってくるURLに必要なデータ
   */
  readonly urlData: UrlData;
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
  readonly clientMode: ClientMode;
  /**
   * 場所
   */
  readonly location: Location;
  /**
   * 言語
   */
  readonly language: Language;
};

/**
 * デバッグモードか, リリースモード
 */
export type ClientMode = "DebugMode" | "Release";

/**
 * DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる
 */
export type Location =
  | { readonly _: "Home" }
  | { readonly _: "CreateProject" }
  | { readonly _: "CreateIdea"; readonly projectId: ProjectId }
  | { readonly _: "User"; readonly userId: UserId }
  | { readonly _: "Project"; readonly projectId: ProjectId }
  | { readonly _: "Idea"; readonly ideaId: IdeaId }
  | { readonly _: "Suggestion"; readonly suggestionId: SuggestionId };

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
  readonly name: string;
  /**
   * プロフィール画像
   */
  readonly imageHash: ImageToken;
  /**
   * 自己紹介文. 改行文字を含めることができる. Twitterと同じ 0～160文字
   */
  readonly introduction: string;
  /**
   * Definyでユーザーが作成された日時
   */
  readonly createTime: Time;
  /**
   * プロジェクトに対する いいね
   */
  readonly likeProjectIdList: ReadonlyArray<ProjectId>;
  /**
   * 開発に参加した (書いたコードが使われた) プロジェクト
   */
  readonly developProjectIdList: ReadonlyArray<ProjectId>;
  /**
   * コメントをしたアイデア
   */
  readonly commentIdeaIdList: ReadonlyArray<IdeaId>;
  /**
   * 取得日時
   */
  readonly getTime: Time;
};

/**
 * 最初に自分の情報を得るときに返ってくるデータ
 */
export type UserSnapshotAndId = {
  /**
   * ユーザーID
   */
  readonly id: UserId;
  /**
   * ユーザーのスナップショット
   */
  readonly snapshot: UserSnapshot;
};

/**
 * Maybe プロジェクトのスナップショット と userId. TypeScript→Elmに渡す用
 */
export type UserResponse = {
  /**
   * ユーザーID
   */
  readonly id: UserId;
  /**
   * ユーザーのデータ
   */
  readonly snapshotMaybe: Maybe<UserSnapshot>;
};

/**
 * プロジェクト
 */
export type ProjectSnapshot = {
  /**
   * プロジェクト名
   */
  readonly name: string;
  /**
   * プロジェクトのアイコン画像
   */
  readonly iconHash: ImageToken;
  /**
   * プロジェクトのカバー画像
   */
  readonly imageHash: ImageToken;
  /**
   * 作成日時
   */
  readonly createTime: Time;
  /**
   * 作成アカウント
   */
  readonly createUser: UserId;
  /**
   * 更新日時
   */
  readonly updateTime: Time;
  /**
   * 取得日時
   */
  readonly getTime: Time;
  /**
   * 所属しているのパーツのIDのリスト
   */
  readonly partIdList: ReadonlyArray<PartId>;
  /**
   * 所属している型パーツのIDのリスト
   */
  readonly typePartIdList: ReadonlyArray<TypePartId>;
};

/**
 * プロジェクトを作成したときに返ってくるデータ
 */
export type ProjectSnapshotAndId = {
  /**
   * プロジェクトID
   */
  readonly id: ProjectId;
  /**
   * プロジェクトのスナップショット
   */
  readonly snapshot: ProjectSnapshot;
};

/**
 * Maybe プロジェクトのスナップショット と projectId. TypeScript→Elmに渡す用
 */
export type ProjectResponse = {
  /**
   * プロジェクトのID
   */
  readonly id: ProjectId;
  /**
   * プロジェクトのデータ
   */
  readonly snapshotMaybe: Maybe<ProjectSnapshot>;
};

/**
 * アイデア
 */
export type IdeaSnapshot = {
  /**
   * アイデア名
   */
  readonly name: string;
  /**
   * 言い出しっぺ
   */
  readonly createUser: UserId;
  /**
   * 作成日時
   */
  readonly createTime: Time;
  /**
   * 対象のプロジェクト
   */
  readonly projectId: ProjectId;
  /**
   * アイデアの要素
   */
  readonly itemList: ReadonlyArray<IdeaItem>;
  /**
   * 更新日時
   */
  readonly updateTime: Time;
  /**
   * 取得日時
   */
  readonly getTime: Time;
};

/**
 * アイデアとそのID. アイデア作成時に返ってくる
 */
export type IdeaSnapshotAndId = {
  /**
   * アイデアID
   */
  readonly id: IdeaId;
  /**
   * アイデアのスナップショット
   */
  readonly snapshot: IdeaSnapshot;
};

/**
 * Maybe アイデア と ideaId. TypeScript→Elmに渡す用
 */
export type IdeaResponse = {
  /**
   * アイデアID
   */
  readonly id: IdeaId;
  /**
   * アイデアのスナップショット
   */
  readonly snapshotMaybe: Maybe<IdeaSnapshot>;
};

/**
 * プロジェクトからアイデアの一覧を取得したときにElmに渡すもの
 */
export type IdeaListByProjectIdResponse = {
  /**
   * プロジェクトID
   */
  readonly projectId: ProjectId;
  /**
   * アイデアの一覧
   */
  readonly ideaSnapshotAndIdList: ReadonlyArray<IdeaSnapshotAndId>;
};

/**
 * アイデアのコメント
 */
export type IdeaItem = {
  /**
   * 作成者
   */
  readonly createUserId: UserId;
  /**
   * 作成日時
   */
  readonly createTime: Time;
  /**
   * 本文
   */
  readonly body: ItemBody;
};

/**
 * アイデアのアイテム
 */
export type ItemBody =
  | { readonly _: "Comment"; readonly string_: string }
  | { readonly _: "SuggestionCreate"; readonly suggestionId: SuggestionId }
  | {
      readonly _: "SuggestionToApprovalPending";
      readonly suggestionId: SuggestionId;
    }
  | {
      readonly _: "SuggestionCancelToApprovalPending";
      readonly suggestionId: SuggestionId;
    }
  | { readonly _: "SuggestionApprove"; readonly suggestionId: SuggestionId }
  | { readonly _: "SuggestionReject"; readonly suggestionId: SuggestionId }
  | {
      readonly _: "SuggestionCancelRejection";
      readonly suggestionId: SuggestionId;
    };

/**
 * 提案
 */
export type SuggestionSnapshot = {
  /**
   * 変更概要
   */
  readonly name: string;
  /**
   * 作成者
   */
  readonly createUserId: UserId;
  /**
   * 変更理由
   */
  readonly reason: string;
  /**
   * 承認状態
   */
  readonly state: SuggestionState;
  /**
   * 変更
   */
  readonly changeList: ReadonlyArray<Change>;
  /**
   * 変更をするプロジェクト
   */
  readonly projectId: ProjectId;
  /**
   * 投稿したアイデアID
   */
  readonly ideaId: IdeaId;
  /**
   * 更新日時
   */
  readonly updateTime: Time;
  /**
   * 取得日時
   */
  readonly getTime: Time;
};

/**
 * Id付きのSuggestion
 */
export type SuggestionSnapshotAndId = {
  /**
   * SuggestionId
   */
  readonly id: SuggestionId;
  /**
   * SuggestionSnapshot
   */
  readonly snapshot: SuggestionSnapshot;
};

/**
 * Maybe SuggestionSnapshotとSuggestionId TypeScript→Elmに渡す用
 */
export type SuggestionResponse = {
  /**
   * SuggestionId
   */
  readonly id: SuggestionId;
  /**
   * SuggestionSnapshot Maybe
   */
  readonly snapshotMaybe: Maybe<SuggestionSnapshot>;
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
  | { readonly _: "ProjectName"; readonly string_: string }
  | { readonly _: "AddPart"; readonly addPart: AddPart };

/**
 * パーツを追加するのに必要なもの
 */
export type AddPart = {
  /**
   * ブラウザで生成した今回作成した提案内で参照するためのID
   */
  readonly id: number;
  /**
   * 新しいパーツの名前
   */
  readonly name: string;
  /**
   * 新しいパーツの説明
   */
  readonly description: string;
  /**
   * 新しいパーツの型
   */
  readonly type: SuggestionType;
  /**
   * 新しいパーツの式
   */
  readonly expr: SuggestionExpr;
};

/**
 * ChangeのAddPartなどで使われる提案で作成した型を使えるType
 */
export type SuggestionType =
  | {
      readonly _: "Function";
      readonly suggestionTypeInputAndOutput: SuggestionTypeInputAndOutput;
    }
  | {
      readonly _: "TypePartWithParameter";
      readonly typePartWithSuggestionTypeParameter: TypePartWithSuggestionTypeParameter;
    }
  | {
      readonly _: "SuggestionTypePartWithParameter";
      readonly suggestionTypePartWithSuggestionTypeParameter: SuggestionTypePartWithSuggestionTypeParameter;
    };

export type SuggestionTypeInputAndOutput = {
  /**
   * 入力の型
   */
  readonly inputType: SuggestionType;
  /**
   * 出力の型
   */
  readonly outputType: SuggestionType;
};

export type TypePartWithSuggestionTypeParameter = {
  /**
   * 型の参照
   */
  readonly typePartId: TypePartId;
  /**
   * 型のパラメーター
   */
  readonly parameter: ReadonlyArray<SuggestionType>;
};

export type SuggestionTypePartWithSuggestionTypeParameter = {
  /**
   * 提案内での定義した型パーツのID
   */
  readonly suggestionTypePartIndex: number;
  /**
   * 型のパラメーター
   */
  readonly parameter: ReadonlyArray<SuggestionType>;
};

/**
 * 提案時に含まれるパーツを参照できる式
 */
export type SuggestionExpr =
  | { readonly _: "Kernel"; readonly kernelExpr: KernelExpr }
  | { readonly _: "Int32Literal"; readonly int32: number }
  | { readonly _: "PartReference"; readonly partId: PartId }
  | { readonly _: "SuggestionPartReference"; readonly int32: number }
  | {
      readonly _: "LocalPartReference";
      readonly localPartReference: LocalPartReference;
    }
  | { readonly _: "TagReference"; readonly tagReference: TagReference }
  | {
      readonly _: "SuggestionTagReference";
      readonly suggestionTagReference: SuggestionTagReference;
    }
  | {
      readonly _: "FunctionCall";
      readonly suggestionFunctionCall: SuggestionFunctionCall;
    }
  | {
      readonly _: "Lambda";
      readonly suggestionLambdaBranchList: ReadonlyArray<
        SuggestionLambdaBranch
      >;
    }
  | { readonly _: "Blank" };

/**
 * 提案内で定義された型のタグ
 */
export type SuggestionTagReference = {
  /**
   * 提案内での定義した型パーツの番号
   */
  readonly suggestionTypePartIndex: number;
  /**
   * タグIndex
   */
  readonly tagIndex: number;
};

/**
 * 関数呼び出し (中に含まれる型はSuggestionExpr)
 */
export type SuggestionFunctionCall = {
  /**
   * 関数
   */
  readonly function: SuggestionExpr;
  /**
   * パラメーター
   */
  readonly parameter: SuggestionExpr;
};

/**
 * suggestionExprの入ったLambdaBranch
 */
export type SuggestionLambdaBranch = {
  /**
   * 入力値の条件を書くところ
   */
  readonly condition: Condition;
  /**
   * ブランチの説明
   */
  readonly description: string;
  readonly localPartList: ReadonlyArray<SuggestionBranchPartDefinition>;
  /**
   * 式
   */
  readonly expr: SuggestionExpr;
};

/**
 * ラムダのブランチで使えるパーツを定義する部分 (SuggestionExpr バージョン)
 */
export type SuggestionBranchPartDefinition = {
  /**
   * ローカルパーツID
   */
  readonly localPartId: LocalPartId;
  /**
   * ブランチパーツの名前
   */
  readonly name: string;
  /**
   * ブランチパーツの説明
   */
  readonly description: string;
  /**
   * ローカルパーツの型
   */
  readonly type: SuggestionType;
  /**
   * ローカルパーツの式
   */
  readonly expr: SuggestionExpr;
};

/**
 * 型パーツ
 */
export type TypePartSnapshot = {
  /**
   * 型パーツの名前
   */
  readonly name: string;
  /**
   * この型パーツの元
   */
  readonly parentList: ReadonlyArray<PartId>;
  /**
   * 型パーツの説明
   */
  readonly description: string;
  /**
   * 所属しているプロジェクトのID
   */
  readonly projectId: ProjectId;
  /**
   * この型パーツが作成された提案
   */
  readonly createSuggestionId: SuggestionId;
  /**
   * 取得日時
   */
  readonly getTime: Time;
  /**
   * 定義本体
   */
  readonly body: TypePartBody;
};

/**
 * パーツの定義
 */
export type PartSnapshot = {
  /**
   * パーツの名前
   */
  readonly name: string;
  /**
   * このパーツの元
   */
  readonly parentList: ReadonlyArray<PartId>;
  /**
   * パーツの説明
   */
  readonly description: string;
  /**
   * パーツの型
   */
  readonly type: Type;
  /**
   * パーツの式
   */
  readonly expr: Expr;
  /**
   * 所属しているプロジェクトのID
   */
  readonly projectId: ProjectId;
  /**
   * このパーツが作成された提案
   */
  readonly createSuggestionId: SuggestionId;
  /**
   * 取得日時
   */
  readonly getTime: Time;
};

/**
 * 型の定義本体
 */
export type TypePartBody =
  | {
      readonly _: "Product";
      readonly typePartBodyProductMemberList: ReadonlyArray<
        TypePartBodyProductMember
      >;
    }
  | {
      readonly _: "Sum";
      readonly typePartBodySumPatternList: ReadonlyArray<
        TypePartBodySumPattern
      >;
    }
  | { readonly _: "Kernel"; readonly typePartBodyKernel: TypePartBodyKernel };

/**
 * 直積型のメンバー
 */
export type TypePartBodyProductMember = {
  /**
   * メンバー名
   */
  readonly name: string;
  /**
   * 説明文
   */
  readonly description: string;
  /**
   * メンバー値の型
   */
  readonly memberType: Type;
};

/**
 * 直積型のパターン
 */
export type TypePartBodySumPattern = {
  /**
   * タグ名
   */
  readonly name: string;
  /**
   * 説明文
   */
  readonly description: string;
  /**
   * パラメーター
   */
  readonly parameter: Type;
};

/**
 * Definyだけでは表現できないデータ型
 */
export type TypePartBodyKernel = "Int32" | "List";

/**
 * 型
 */
export type Type =
  | { readonly _: "Function"; readonly typeInputAndOutput: TypeInputAndOutput }
  | {
      readonly _: "TypePartWithParameter";
      readonly typePartIdWithParameter: TypePartIdWithParameter;
    };

export type TypeInputAndOutput = {
  /**
   * 入力の型
   */
  readonly inputType: Type;
  /**
   * 出力の型
   */
  readonly outputType: Type;
};

export type TypePartIdWithParameter = {
  /**
   * 型の参照
   */
  readonly typePartId: TypePartId;
  /**
   * 型のパラメーター
   */
  readonly parameter: ReadonlyArray<Type>;
};

/**
 * 式
 */
export type Expr =
  | { readonly _: "Kernel"; readonly kernelExpr: KernelExpr }
  | { readonly _: "Int32Literal"; readonly int32: number }
  | { readonly _: "PartReference"; readonly partId: PartId }
  | {
      readonly _: "LocalPartReference";
      readonly localPartReference: LocalPartReference;
    }
  | { readonly _: "TagReference"; readonly tagReference: TagReference }
  | { readonly _: "FunctionCall"; readonly functionCall: FunctionCall }
  | {
      readonly _: "Lambda";
      readonly lambdaBranchList: ReadonlyArray<LambdaBranch>;
    };

/**
 * 評価しきった式
 */
export type EvaluatedExpr =
  | { readonly _: "Kernel"; readonly kernelExpr: KernelExpr }
  | { readonly _: "Int32"; readonly int32: number }
  | {
      readonly _: "LocalPartReference";
      readonly localPartReference: LocalPartReference;
    }
  | { readonly _: "TagReference"; readonly tagReference: TagReference }
  | {
      readonly _: "Lambda";
      readonly lambdaBranchList: ReadonlyArray<LambdaBranch>;
    }
  | { readonly _: "KernelCall"; readonly kernelCall: KernelCall };

/**
 * 複数の引数が必要な内部関数の部分呼び出し
 */
export type KernelCall = {
  /**
   * 関数
   */
  readonly kernel: KernelExpr;
  /**
   * 呼び出すパラメーター
   */
  readonly expr: EvaluatedExpr;
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
  readonly partId: PartId;
  /**
   * ローカルパーツID
   */
  readonly localPartId: LocalPartId;
};

/**
 * タグの参照を表す
 */
export type TagReference = {
  /**
   * 型ID
   */
  readonly typePartId: TypePartId;
  /**
   * タグID
   */
  readonly tagId: TagId;
};

/**
 * 関数呼び出し
 */
export type FunctionCall = {
  /**
   * 関数
   */
  readonly function: Expr;
  /**
   * パラメーター
   */
  readonly parameter: Expr;
};

/**
 * ラムダのブランチ. Just x -> data x のようなところ
 */
export type LambdaBranch = {
  /**
   * 入力値の条件を書くところ. Just x
   */
  readonly condition: Condition;
  /**
   * ブランチの説明
   */
  readonly description: string;
  readonly localPartList: ReadonlyArray<BranchPartDefinition>;
  /**
   * 式
   */
  readonly expr: Expr;
};

/**
 * ブランチの式を使う条件
 */
export type Condition =
  | { readonly _: "ByTag"; readonly conditionTag: ConditionTag }
  | { readonly _: "ByCapture"; readonly conditionCapture: ConditionCapture }
  | { readonly _: "Any" }
  | { readonly _: "Int32"; readonly int32: number };

/**
 * タグによる条件
 */
export type ConditionTag = {
  /**
   * タグ
   */
  readonly tag: TagId;
  /**
   * パラメーター
   */
  readonly parameter: Maybe<Condition>;
};

/**
 * キャプチャパーツへのキャプチャ
 */
export type ConditionCapture = {
  /**
   * キャプチャパーツの名前
   */
  readonly name: string;
  /**
   * ローカルパーツId
   */
  readonly localPartId: LocalPartId;
};

/**
 * ラムダのブランチで使えるパーツを定義する部分
 */
export type BranchPartDefinition = {
  /**
   * ローカルパーツID
   */
  readonly localPartId: LocalPartId;
  /**
   * ブランチパーツの名前
   */
  readonly name: string;
  /**
   * ブランチパーツの説明
   */
  readonly description: string;
  /**
   * ローカルパーツの型
   */
  readonly type: Type;
  /**
   * ローカルパーツの式
   */
  readonly expr: Expr;
};

/**
 * 評価したときに失敗した原因を表すもの
 */
export type EvaluateExprError =
  | { readonly _: "NeedPartDefinition"; readonly partId: PartId }
  | { readonly _: "NeedSuggestionPart"; readonly int32: number }
  | { readonly _: "Blank" }
  | {
      readonly _: "CannotFindLocalPartDefinition";
      readonly localPartReference: LocalPartReference;
    }
  | { readonly _: "TypeError"; readonly typeError: TypeError }
  | { readonly _: "NotSupported" };

/**
 * 型エラー
 */
export type TypeError = {
  /**
   * 型エラーの説明
   */
  readonly message: string;
};

/**
 * 評価する上で必要なソースコード
 */
export type EvalParameter = {
  /**
   * パーツのリスト
   */
  readonly partList: ReadonlyArray<PartWithId>;
  /**
   * 型パーツのリスト
   */
  readonly typePartList: ReadonlyArray<TypePartWithId>;
  /**
   * 変更点
   */
  readonly changeList: ReadonlyArray<Change>;
  /**
   * 評価してほしい式
   */
  readonly expr: SuggestionExpr;
};

/**
 * パーツとPartId
 */
export type PartWithId = {
  /**
   * PartId
   */
  readonly id: PartId;
  /**
   * PartSnapshot
   */
  readonly part: PartSnapshot;
};

/**
 * 型パーツとTypePartId
 */
export type TypePartWithId = {
  /**
   * TypePartId
   */
  readonly id: TypePartId;
  /**
   * TypePartSnapshot
   */
  readonly typePart: TypePartSnapshot;
};

/**
 * プロジェクト作成時に必要なパラメーター
 */
export type CreateProjectParameter = {
  /**
   * プロジェクトを作るときのアカウント
   */
  readonly accessToken: AccessToken;
  /**
   * プロジェクト名
   */
  readonly projectName: string;
};

/**
 * アイデアを作成時に必要なパラメーター
 */
export type CreateIdeaParameter = {
  /**
   * プロジェクトを作るときのアカウント
   */
  readonly accessToken: AccessToken;
  /**
   * アイデア名
   */
  readonly ideaName: string;
  /**
   * 対象のプロジェクトID
   */
  readonly projectId: ProjectId;
};

/**
 * アイデアにコメントを追加するときに必要なパラメーター
 */
export type AddCommentParameter = {
  /**
   * プロジェクトを作るときのアカウント
   */
  readonly accessToken: AccessToken;
  /**
   * コメントを追加するアイデア
   */
  readonly ideaId: IdeaId;
  /**
   * コメント本文
   */
  readonly comment: string;
};

/**
 * 提案を作成するときに必要なパラメーター
 */
export type AddSuggestionParameter = {
  /**
   * 提案を作成するアカウント
   */
  readonly accessToken: AccessToken;
  /**
   * 提案に関連付けられるアイデア
   */
  readonly ideaId: IdeaId;
};

/**
 * 提案を更新するときに必要なパラメーター
 */
export type UpdateSuggestionParameter = {
  /**
   * 提案を更新するアカウント
   */
  readonly accessToken: AccessToken;
  /**
   * 書き換える提案
   */
  readonly suggestionId: SuggestionId;
  /**
   * 提案の名前
   */
  readonly name: string;
  /**
   * 変更理由
   */
  readonly reason: string;
  /**
   * 提案の変更
   */
  readonly changeList: ReadonlyArray<Change>;
};

/**
 * 提案を承認待ちにしたり許可したりするときなどに使う
 */
export type AccessTokenAndSuggestionId = {
  /**
   * アクセストークン
   */
  readonly accessToken: AccessToken;
  /**
   * SuggestionId
   */
  readonly suggestionId: SuggestionId;
};

export type ProjectId = string & { readonly _projectId: never };

export type UserId = string & { readonly _userId: never };

export type IdeaId = string & { readonly _ideaId: never };

export type SuggestionId = string & { readonly _suggestionId: never };

export type ImageToken = string & { readonly _imageToken: never };

export type PartId = string & { readonly _partId: never };

export type TypePartId = string & { readonly _typePartId: never };

export type LocalPartId = string & { readonly _localPartId: never };

export type TagId = string & { readonly _tagId: never };

export type AccessToken = string & { readonly _accessToken: never };

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
 * 提案内で定義されたパーツのID
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
  suggestionLambdaBranchList: ReadonlyArray<SuggestionLambdaBranch>
): SuggestionExpr => ({
  _: "Lambda",
  suggestionLambdaBranchList: suggestionLambdaBranchList,
});

/**
 * 空白
 */
export const suggestionExprBlank: SuggestionExpr = { _: "Blank" };

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
 * 式を評価するために必要なSuggestionPartが見つからない
 */
export const evaluateExprErrorNeedSuggestionPart = (
  int32: number
): EvaluateExprError => ({ _: "NeedSuggestionPart", int32: int32 });

/**
 * 計算結果にblankが含まれている
 */
export const evaluateExprErrorBlank: EvaluateExprError = { _: "Blank" };

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

export const encodeSuggestionResponse = (
  suggestionResponse: SuggestionResponse
): ReadonlyArray<number> =>
  encodeId(suggestionResponse.id).concat(
    encodeMaybe(encodeSuggestionSnapshot)(suggestionResponse.snapshotMaybe)
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
  encodeInt32(addPart.id)
    .concat(encodeString(addPart.name))
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
        encodeList(encodeSuggestionLambdaBranch)(
          suggestionExpr.suggestionLambdaBranchList
        )
      );
    }
    case "Blank": {
      return [9];
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
    .concat(encodeSuggestionExpr(suggestionLambdaBranch.expr));

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
    .concat(encodeExpr(partSnapshot.expr))
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
    .concat(encodeExpr(lambdaBranch.expr));

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
    case "NeedSuggestionPart": {
      return [1].concat(encodeInt32(evaluateExprError.int32));
    }
    case "Blank": {
      return [2];
    }
    case "CannotFindLocalPartDefinition": {
      return [3].concat(
        encodeLocalPartReference(evaluateExprError.localPartReference)
      );
    }
    case "TypeError": {
      return [4].concat(encodeTypeError(evaluateExprError.typeError));
    }
    case "NotSupported": {
      return [5];
    }
  }
};

export const encodeTypeError = (typeError: TypeError): ReadonlyArray<number> =>
  encodeString(typeError.message);

export const encodeEvalParameter = (
  evalParameter: EvalParameter
): ReadonlyArray<number> =>
  encodeList(encodePartWithId)(evalParameter.partList)
    .concat(encodeList(encodeTypePartWithId)(evalParameter.typePartList))
    .concat(encodeList(encodeChange)(evalParameter.changeList))
    .concat(encodeSuggestionExpr(evalParameter.expr));

export const encodePartWithId = (
  partWithId: PartWithId
): ReadonlyArray<number> =>
  encodeId(partWithId.id).concat(encodePartSnapshot(partWithId.part));

export const encodeTypePartWithId = (
  typePartWithId: TypePartWithId
): ReadonlyArray<number> =>
  encodeId(typePartWithId.id).concat(
    encodeTypePartSnapshot(typePartWithId.typePart)
  );

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
  encodeToken(updateSuggestionParameter.accessToken)
    .concat(encodeId(updateSuggestionParameter.suggestionId))
    .concat(encodeString(updateSuggestionParameter.name))
    .concat(encodeString(updateSuggestionParameter.reason))
    .concat(encodeList(encodeChange)(updateSuggestionParameter.changeList));

export const encodeAccessTokenAndSuggestionId = (
  accessTokenAndSuggestionId: AccessTokenAndSuggestionId
): ReadonlyArray<number> =>
  encodeToken(accessTokenAndSuggestionId.accessToken).concat(
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
): { readonly result: number; readonly nextIndex: number } => {
  let result = 0;
  let offset = 0;
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
): { readonly result: string; readonly nextIndex: number } => {
  const length: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
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
): { readonly result: boolean; readonly nextIndex: number } => ({
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
): { readonly result: Uint8Array; readonly nextIndex: number } => {
  const length: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  const nextIndex: number = length.nextIndex + length.result;
  return {
    result: binary.slice(length.nextIndex, nextIndex),
    nextIndex: nextIndex,
  };
};

export const decodeList = <T>(
  decodeFunction: (
    a: number,
    b: Uint8Array
  ) => { readonly result: T; readonly nextIndex: number }
): ((
  a: number,
  b: Uint8Array
) => { readonly result: ReadonlyArray<T>; readonly nextIndex: number }) => (
  index: number,
  binary: Uint8Array
): { readonly result: ReadonlyArray<T>; readonly nextIndex: number } => {
  const lengthResult: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  index = lengthResult.nextIndex;
  const result: Array<T> = [];
  for (let i = 0; i < lengthResult.result; i += 1) {
    const resultAndNextIndex: {
      readonly result: T;
      readonly nextIndex: number;
    } = decodeFunction(index, binary);
    result.push(resultAndNextIndex.result);
    index = resultAndNextIndex.nextIndex;
  }
  return { result: result, nextIndex: index };
};

export const decodeMaybe = <T>(
  decodeFunction: (
    a: number,
    b: Uint8Array
  ) => { readonly result: T; readonly nextIndex: number }
): ((
  a: number,
  b: Uint8Array
) => { readonly result: Maybe<T>; readonly nextIndex: number }) => (
  index: number,
  binary: Uint8Array
): { readonly result: Maybe<T>; readonly nextIndex: number } => {
  const patternIndexAndNextIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndexAndNextIndex.result === 0) {
    const valueAndNextIndex: {
      readonly result: T;
      readonly nextIndex: number;
    } = decodeFunction(patternIndexAndNextIndex.nextIndex, binary);
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
  ) => { readonly result: ok; readonly nextIndex: number },
  errorDecodeFunction: (
    a: number,
    b: Uint8Array
  ) => { readonly result: error; readonly nextIndex: number }
): ((
  a: number,
  b: Uint8Array
) => { readonly result: Result<ok, error>; readonly nextIndex: number }) => (
  index: number,
  binary: Uint8Array
): { readonly result: Result<ok, error>; readonly nextIndex: number } => {
  const patternIndexAndNextIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndexAndNextIndex.result === 0) {
    const okAndNextIndex: {
      readonly result: ok;
      readonly nextIndex: number;
    } = okDecodeFunction(patternIndexAndNextIndex.nextIndex, binary);
    return {
      result: resultOk(okAndNextIndex.result),
      nextIndex: okAndNextIndex.nextIndex,
    };
  }
  if (patternIndexAndNextIndex.result === 1) {
    const errorAndNextIndex: {
      readonly result: error;
      readonly nextIndex: number;
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
): { readonly result: string; readonly nextIndex: number } => ({
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
): { readonly result: string; readonly nextIndex: number } => ({
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
): { readonly result: Time; readonly nextIndex: number } => {
  const dayAndNextIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  const millisecondAndNextIndex: {
    readonly result: number;
    readonly nextIndex: number;
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
): {
  readonly result: RequestLogInUrlRequestData;
  readonly nextIndex: number;
} => {
  const openIdConnectProviderAndNextIndex: {
    readonly result: OpenIdConnectProvider;
    readonly nextIndex: number;
  } = decodeOpenIdConnectProvider(index, binary);
  const urlDataAndNextIndex: {
    readonly result: UrlData;
    readonly nextIndex: number;
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
): { readonly result: OpenIdConnectProvider; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
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
): { readonly result: UrlData; readonly nextIndex: number } => {
  const clientModeAndNextIndex: {
    readonly result: ClientMode;
    readonly nextIndex: number;
  } = decodeClientMode(index, binary);
  const locationAndNextIndex: {
    readonly result: Location;
    readonly nextIndex: number;
  } = decodeLocation(clientModeAndNextIndex.nextIndex, binary);
  const languageAndNextIndex: {
    readonly result: Language;
    readonly nextIndex: number;
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
): { readonly result: ClientMode; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
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
): { readonly result: Location; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndex.result === 0) {
    return { result: locationHome, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: locationCreateProject, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    const result: {
      readonly result: ProjectId;
      readonly nextIndex: number;
    } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: ProjectId; readonly nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: locationCreateIdea(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 3) {
    const result: {
      readonly result: UserId;
      readonly nextIndex: number;
    } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: UserId; readonly nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return { result: locationUser(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 4) {
    const result: {
      readonly result: ProjectId;
      readonly nextIndex: number;
    } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: ProjectId; readonly nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: locationProject(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 5) {
    const result: {
      readonly result: IdeaId;
      readonly nextIndex: number;
    } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: IdeaId; readonly nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return { result: locationIdea(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 6) {
    const result: {
      readonly result: SuggestionId;
      readonly nextIndex: number;
    } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: SuggestionId; readonly nextIndex: number })(
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
): { readonly result: Language; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
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
): { readonly result: UserSnapshot; readonly nextIndex: number } => {
  const nameAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(index, binary);
  const imageHashAndNextIndex: {
    readonly result: ImageToken;
    readonly nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { readonly result: ImageToken; readonly nextIndex: number })(
    nameAndNextIndex.nextIndex,
    binary
  );
  const introductionAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(imageHashAndNextIndex.nextIndex, binary);
  const createTimeAndNextIndex: {
    readonly result: Time;
    readonly nextIndex: number;
  } = decodeTime(introductionAndNextIndex.nextIndex, binary);
  const likeProjectIdListAndNextIndex: {
    readonly result: ReadonlyArray<ProjectId>;
    readonly nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: ProjectId; readonly nextIndex: number }
  )(createTimeAndNextIndex.nextIndex, binary);
  const developProjectIdListAndNextIndex: {
    readonly result: ReadonlyArray<ProjectId>;
    readonly nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: ProjectId; readonly nextIndex: number }
  )(likeProjectIdListAndNextIndex.nextIndex, binary);
  const commentIdeaIdListAndNextIndex: {
    readonly result: ReadonlyArray<IdeaId>;
    readonly nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: IdeaId; readonly nextIndex: number }
  )(developProjectIdListAndNextIndex.nextIndex, binary);
  const getTimeAndNextIndex: {
    readonly result: Time;
    readonly nextIndex: number;
  } = decodeTime(commentIdeaIdListAndNextIndex.nextIndex, binary);
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
): { readonly result: UserSnapshotAndId; readonly nextIndex: number } => {
  const idAndNextIndex: {
    readonly result: UserId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: UserId; readonly nextIndex: number })(index, binary);
  const snapshotAndNextIndex: {
    readonly result: UserSnapshot;
    readonly nextIndex: number;
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
): { readonly result: UserResponse; readonly nextIndex: number } => {
  const idAndNextIndex: {
    readonly result: UserId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: UserId; readonly nextIndex: number })(index, binary);
  const snapshotMaybeAndNextIndex: {
    readonly result: Maybe<UserSnapshot>;
    readonly nextIndex: number;
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
): { readonly result: ProjectSnapshot; readonly nextIndex: number } => {
  const nameAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(index, binary);
  const iconHashAndNextIndex: {
    readonly result: ImageToken;
    readonly nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { readonly result: ImageToken; readonly nextIndex: number })(
    nameAndNextIndex.nextIndex,
    binary
  );
  const imageHashAndNextIndex: {
    readonly result: ImageToken;
    readonly nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { readonly result: ImageToken; readonly nextIndex: number })(
    iconHashAndNextIndex.nextIndex,
    binary
  );
  const createTimeAndNextIndex: {
    readonly result: Time;
    readonly nextIndex: number;
  } = decodeTime(imageHashAndNextIndex.nextIndex, binary);
  const createUserAndNextIndex: {
    readonly result: UserId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: UserId; readonly nextIndex: number })(
    createTimeAndNextIndex.nextIndex,
    binary
  );
  const updateTimeAndNextIndex: {
    readonly result: Time;
    readonly nextIndex: number;
  } = decodeTime(createUserAndNextIndex.nextIndex, binary);
  const getTimeAndNextIndex: {
    readonly result: Time;
    readonly nextIndex: number;
  } = decodeTime(updateTimeAndNextIndex.nextIndex, binary);
  const partIdListAndNextIndex: {
    readonly result: ReadonlyArray<PartId>;
    readonly nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: PartId; readonly nextIndex: number }
  )(getTimeAndNextIndex.nextIndex, binary);
  const typePartIdListAndNextIndex: {
    readonly result: ReadonlyArray<TypePartId>;
    readonly nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: TypePartId; readonly nextIndex: number }
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
): { readonly result: ProjectSnapshotAndId; readonly nextIndex: number } => {
  const idAndNextIndex: {
    readonly result: ProjectId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: ProjectId; readonly nextIndex: number })(
    index,
    binary
  );
  const snapshotAndNextIndex: {
    readonly result: ProjectSnapshot;
    readonly nextIndex: number;
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
): { readonly result: ProjectResponse; readonly nextIndex: number } => {
  const idAndNextIndex: {
    readonly result: ProjectId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: ProjectId; readonly nextIndex: number })(
    index,
    binary
  );
  const snapshotMaybeAndNextIndex: {
    readonly result: Maybe<ProjectSnapshot>;
    readonly nextIndex: number;
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
): { readonly result: IdeaSnapshot; readonly nextIndex: number } => {
  const nameAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(index, binary);
  const createUserAndNextIndex: {
    readonly result: UserId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: UserId; readonly nextIndex: number })(
    nameAndNextIndex.nextIndex,
    binary
  );
  const createTimeAndNextIndex: {
    readonly result: Time;
    readonly nextIndex: number;
  } = decodeTime(createUserAndNextIndex.nextIndex, binary);
  const projectIdAndNextIndex: {
    readonly result: ProjectId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: ProjectId; readonly nextIndex: number })(
    createTimeAndNextIndex.nextIndex,
    binary
  );
  const itemListAndNextIndex: {
    readonly result: ReadonlyArray<IdeaItem>;
    readonly nextIndex: number;
  } = decodeList(decodeIdeaItem)(projectIdAndNextIndex.nextIndex, binary);
  const updateTimeAndNextIndex: {
    readonly result: Time;
    readonly nextIndex: number;
  } = decodeTime(itemListAndNextIndex.nextIndex, binary);
  const getTimeAndNextIndex: {
    readonly result: Time;
    readonly nextIndex: number;
  } = decodeTime(updateTimeAndNextIndex.nextIndex, binary);
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
): { readonly result: IdeaSnapshotAndId; readonly nextIndex: number } => {
  const idAndNextIndex: {
    readonly result: IdeaId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: IdeaId; readonly nextIndex: number })(index, binary);
  const snapshotAndNextIndex: {
    readonly result: IdeaSnapshot;
    readonly nextIndex: number;
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
): { readonly result: IdeaResponse; readonly nextIndex: number } => {
  const idAndNextIndex: {
    readonly result: IdeaId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: IdeaId; readonly nextIndex: number })(index, binary);
  const snapshotMaybeAndNextIndex: {
    readonly result: Maybe<IdeaSnapshot>;
    readonly nextIndex: number;
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
): {
  readonly result: IdeaListByProjectIdResponse;
  readonly nextIndex: number;
} => {
  const projectIdAndNextIndex: {
    readonly result: ProjectId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: ProjectId; readonly nextIndex: number })(
    index,
    binary
  );
  const ideaSnapshotAndIdListAndNextIndex: {
    readonly result: ReadonlyArray<IdeaSnapshotAndId>;
    readonly nextIndex: number;
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
): { readonly result: IdeaItem; readonly nextIndex: number } => {
  const createUserIdAndNextIndex: {
    readonly result: UserId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: UserId; readonly nextIndex: number })(index, binary);
  const createTimeAndNextIndex: {
    readonly result: Time;
    readonly nextIndex: number;
  } = decodeTime(createUserIdAndNextIndex.nextIndex, binary);
  const bodyAndNextIndex: {
    readonly result: ItemBody;
    readonly nextIndex: number;
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
): { readonly result: ItemBody; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndex.result === 0) {
    const result: {
      readonly result: string;
      readonly nextIndex: number;
    } = decodeString(patternIndex.nextIndex, binary);
    return {
      result: itemBodyComment(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: {
      readonly result: SuggestionId;
      readonly nextIndex: number;
    } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: SuggestionId; readonly nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: itemBodySuggestionCreate(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    const result: {
      readonly result: SuggestionId;
      readonly nextIndex: number;
    } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: SuggestionId; readonly nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: itemBodySuggestionToApprovalPending(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 3) {
    const result: {
      readonly result: SuggestionId;
      readonly nextIndex: number;
    } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: SuggestionId; readonly nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: itemBodySuggestionCancelToApprovalPending(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 4) {
    const result: {
      readonly result: SuggestionId;
      readonly nextIndex: number;
    } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: SuggestionId; readonly nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: itemBodySuggestionApprove(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 5) {
    const result: {
      readonly result: SuggestionId;
      readonly nextIndex: number;
    } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: SuggestionId; readonly nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: itemBodySuggestionReject(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 6) {
    const result: {
      readonly result: SuggestionId;
      readonly nextIndex: number;
    } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: SuggestionId; readonly nextIndex: number })(
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
): { readonly result: SuggestionSnapshot; readonly nextIndex: number } => {
  const nameAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(index, binary);
  const createUserIdAndNextIndex: {
    readonly result: UserId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: UserId; readonly nextIndex: number })(
    nameAndNextIndex.nextIndex,
    binary
  );
  const reasonAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(createUserIdAndNextIndex.nextIndex, binary);
  const stateAndNextIndex: {
    readonly result: SuggestionState;
    readonly nextIndex: number;
  } = decodeSuggestionState(reasonAndNextIndex.nextIndex, binary);
  const changeListAndNextIndex: {
    readonly result: ReadonlyArray<Change>;
    readonly nextIndex: number;
  } = decodeList(decodeChange)(stateAndNextIndex.nextIndex, binary);
  const projectIdAndNextIndex: {
    readonly result: ProjectId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: ProjectId; readonly nextIndex: number })(
    changeListAndNextIndex.nextIndex,
    binary
  );
  const ideaIdAndNextIndex: {
    readonly result: IdeaId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: IdeaId; readonly nextIndex: number })(
    projectIdAndNextIndex.nextIndex,
    binary
  );
  const updateTimeAndNextIndex: {
    readonly result: Time;
    readonly nextIndex: number;
  } = decodeTime(ideaIdAndNextIndex.nextIndex, binary);
  const getTimeAndNextIndex: {
    readonly result: Time;
    readonly nextIndex: number;
  } = decodeTime(updateTimeAndNextIndex.nextIndex, binary);
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
): { readonly result: SuggestionSnapshotAndId; readonly nextIndex: number } => {
  const idAndNextIndex: {
    readonly result: SuggestionId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: SuggestionId; readonly nextIndex: number })(
    index,
    binary
  );
  const snapshotAndNextIndex: {
    readonly result: SuggestionSnapshot;
    readonly nextIndex: number;
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
export const decodeSuggestionResponse = (
  index: number,
  binary: Uint8Array
): { readonly result: SuggestionResponse; readonly nextIndex: number } => {
  const idAndNextIndex: {
    readonly result: SuggestionId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: SuggestionId; readonly nextIndex: number })(
    index,
    binary
  );
  const snapshotMaybeAndNextIndex: {
    readonly result: Maybe<SuggestionSnapshot>;
    readonly nextIndex: number;
  } = decodeMaybe(decodeSuggestionSnapshot)(idAndNextIndex.nextIndex, binary);
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
export const decodeSuggestionState = (
  index: number,
  binary: Uint8Array
): { readonly result: SuggestionState; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
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
): { readonly result: Change; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndex.result === 0) {
    const result: {
      readonly result: string;
      readonly nextIndex: number;
    } = decodeString(patternIndex.nextIndex, binary);
    return {
      result: changeProjectName(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: {
      readonly result: AddPart;
      readonly nextIndex: number;
    } = decodeAddPart(patternIndex.nextIndex, binary);
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
): { readonly result: AddPart; readonly nextIndex: number } => {
  const idAndNextIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  const nameAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(idAndNextIndex.nextIndex, binary);
  const descriptionAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const typeAndNextIndex: {
    readonly result: SuggestionType;
    readonly nextIndex: number;
  } = decodeSuggestionType(descriptionAndNextIndex.nextIndex, binary);
  const exprAndNextIndex: {
    readonly result: SuggestionExpr;
    readonly nextIndex: number;
  } = decodeSuggestionExpr(typeAndNextIndex.nextIndex, binary);
  return {
    result: {
      id: idAndNextIndex.result,
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
): { readonly result: SuggestionType; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndex.result === 0) {
    const result: {
      readonly result: SuggestionTypeInputAndOutput;
      readonly nextIndex: number;
    } = decodeSuggestionTypeInputAndOutput(patternIndex.nextIndex, binary);
    return {
      result: suggestionTypeFunction(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: {
      readonly result: TypePartWithSuggestionTypeParameter;
      readonly nextIndex: number;
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
      readonly result: SuggestionTypePartWithSuggestionTypeParameter;
      readonly nextIndex: number;
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
): {
  readonly result: SuggestionTypeInputAndOutput;
  readonly nextIndex: number;
} => {
  const inputTypeAndNextIndex: {
    readonly result: SuggestionType;
    readonly nextIndex: number;
  } = decodeSuggestionType(index, binary);
  const outputTypeAndNextIndex: {
    readonly result: SuggestionType;
    readonly nextIndex: number;
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
): {
  readonly result: TypePartWithSuggestionTypeParameter;
  readonly nextIndex: number;
} => {
  const typePartIdAndNextIndex: {
    readonly result: TypePartId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: TypePartId; readonly nextIndex: number })(
    index,
    binary
  );
  const parameterAndNextIndex: {
    readonly result: ReadonlyArray<SuggestionType>;
    readonly nextIndex: number;
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
  readonly result: SuggestionTypePartWithSuggestionTypeParameter;
  readonly nextIndex: number;
} => {
  const suggestionTypePartIndexAndNextIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  const parameterAndNextIndex: {
    readonly result: ReadonlyArray<SuggestionType>;
    readonly nextIndex: number;
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
): { readonly result: SuggestionExpr; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndex.result === 0) {
    const result: {
      readonly result: KernelExpr;
      readonly nextIndex: number;
    } = decodeKernelExpr(patternIndex.nextIndex, binary);
    return {
      result: suggestionExprKernel(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: {
      readonly result: number;
      readonly nextIndex: number;
    } = decodeInt32(patternIndex.nextIndex, binary);
    return {
      result: suggestionExprInt32Literal(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    const result: {
      readonly result: PartId;
      readonly nextIndex: number;
    } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: PartId; readonly nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: suggestionExprPartReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 3) {
    const result: {
      readonly result: number;
      readonly nextIndex: number;
    } = decodeInt32(patternIndex.nextIndex, binary);
    return {
      result: suggestionExprSuggestionPartReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 4) {
    const result: {
      readonly result: LocalPartReference;
      readonly nextIndex: number;
    } = decodeLocalPartReference(patternIndex.nextIndex, binary);
    return {
      result: suggestionExprLocalPartReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 5) {
    const result: {
      readonly result: TagReference;
      readonly nextIndex: number;
    } = decodeTagReference(patternIndex.nextIndex, binary);
    return {
      result: suggestionExprTagReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 6) {
    const result: {
      readonly result: SuggestionTagReference;
      readonly nextIndex: number;
    } = decodeSuggestionTagReference(patternIndex.nextIndex, binary);
    return {
      result: suggestionExprSuggestionTagReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 7) {
    const result: {
      readonly result: SuggestionFunctionCall;
      readonly nextIndex: number;
    } = decodeSuggestionFunctionCall(patternIndex.nextIndex, binary);
    return {
      result: suggestionExprFunctionCall(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 8) {
    const result: {
      readonly result: ReadonlyArray<SuggestionLambdaBranch>;
      readonly nextIndex: number;
    } = decodeList(decodeSuggestionLambdaBranch)(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: suggestionExprLambda(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 9) {
    return { result: suggestionExprBlank, nextIndex: patternIndex.nextIndex };
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
): { readonly result: SuggestionTagReference; readonly nextIndex: number } => {
  const suggestionTypePartIndexAndNextIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  const tagIndexAndNextIndex: {
    readonly result: number;
    readonly nextIndex: number;
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
): { readonly result: SuggestionFunctionCall; readonly nextIndex: number } => {
  const functionAndNextIndex: {
    readonly result: SuggestionExpr;
    readonly nextIndex: number;
  } = decodeSuggestionExpr(index, binary);
  const parameterAndNextIndex: {
    readonly result: SuggestionExpr;
    readonly nextIndex: number;
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
): { readonly result: SuggestionLambdaBranch; readonly nextIndex: number } => {
  const conditionAndNextIndex: {
    readonly result: Condition;
    readonly nextIndex: number;
  } = decodeCondition(index, binary);
  const descriptionAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(conditionAndNextIndex.nextIndex, binary);
  const localPartListAndNextIndex: {
    readonly result: ReadonlyArray<SuggestionBranchPartDefinition>;
    readonly nextIndex: number;
  } = decodeList(decodeSuggestionBranchPartDefinition)(
    descriptionAndNextIndex.nextIndex,
    binary
  );
  const exprAndNextIndex: {
    readonly result: SuggestionExpr;
    readonly nextIndex: number;
  } = decodeSuggestionExpr(localPartListAndNextIndex.nextIndex, binary);
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
): {
  readonly result: SuggestionBranchPartDefinition;
  readonly nextIndex: number;
} => {
  const localPartIdAndNextIndex: {
    readonly result: LocalPartId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: LocalPartId; readonly nextIndex: number })(
    index,
    binary
  );
  const nameAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(localPartIdAndNextIndex.nextIndex, binary);
  const descriptionAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const typeAndNextIndex: {
    readonly result: SuggestionType;
    readonly nextIndex: number;
  } = decodeSuggestionType(descriptionAndNextIndex.nextIndex, binary);
  const exprAndNextIndex: {
    readonly result: SuggestionExpr;
    readonly nextIndex: number;
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
): { readonly result: TypePartSnapshot; readonly nextIndex: number } => {
  const nameAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(index, binary);
  const parentListAndNextIndex: {
    readonly result: ReadonlyArray<PartId>;
    readonly nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: PartId; readonly nextIndex: number }
  )(nameAndNextIndex.nextIndex, binary);
  const descriptionAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(parentListAndNextIndex.nextIndex, binary);
  const projectIdAndNextIndex: {
    readonly result: ProjectId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: ProjectId; readonly nextIndex: number })(
    descriptionAndNextIndex.nextIndex,
    binary
  );
  const createSuggestionIdAndNextIndex: {
    readonly result: SuggestionId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: SuggestionId; readonly nextIndex: number })(
    projectIdAndNextIndex.nextIndex,
    binary
  );
  const getTimeAndNextIndex: {
    readonly result: Time;
    readonly nextIndex: number;
  } = decodeTime(createSuggestionIdAndNextIndex.nextIndex, binary);
  const bodyAndNextIndex: {
    readonly result: TypePartBody;
    readonly nextIndex: number;
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
): { readonly result: PartSnapshot; readonly nextIndex: number } => {
  const nameAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(index, binary);
  const parentListAndNextIndex: {
    readonly result: ReadonlyArray<PartId>;
    readonly nextIndex: number;
  } = decodeList(
    decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: PartId; readonly nextIndex: number }
  )(nameAndNextIndex.nextIndex, binary);
  const descriptionAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(parentListAndNextIndex.nextIndex, binary);
  const typeAndNextIndex: {
    readonly result: Type;
    readonly nextIndex: number;
  } = decodeType(descriptionAndNextIndex.nextIndex, binary);
  const exprAndNextIndex: {
    readonly result: Expr;
    readonly nextIndex: number;
  } = decodeExpr(typeAndNextIndex.nextIndex, binary);
  const projectIdAndNextIndex: {
    readonly result: ProjectId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: ProjectId; readonly nextIndex: number })(
    exprAndNextIndex.nextIndex,
    binary
  );
  const createSuggestionIdAndNextIndex: {
    readonly result: SuggestionId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: SuggestionId; readonly nextIndex: number })(
    projectIdAndNextIndex.nextIndex,
    binary
  );
  const getTimeAndNextIndex: {
    readonly result: Time;
    readonly nextIndex: number;
  } = decodeTime(createSuggestionIdAndNextIndex.nextIndex, binary);
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
): { readonly result: TypePartBody; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndex.result === 0) {
    const result: {
      readonly result: ReadonlyArray<TypePartBodyProductMember>;
      readonly nextIndex: number;
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
      readonly result: ReadonlyArray<TypePartBodySumPattern>;
      readonly nextIndex: number;
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
      readonly result: TypePartBodyKernel;
      readonly nextIndex: number;
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
): {
  readonly result: TypePartBodyProductMember;
  readonly nextIndex: number;
} => {
  const nameAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(index, binary);
  const descriptionAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const memberTypeAndNextIndex: {
    readonly result: Type;
    readonly nextIndex: number;
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
): { readonly result: TypePartBodySumPattern; readonly nextIndex: number } => {
  const nameAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(index, binary);
  const descriptionAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const parameterAndNextIndex: {
    readonly result: Type;
    readonly nextIndex: number;
  } = decodeType(descriptionAndNextIndex.nextIndex, binary);
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
): { readonly result: TypePartBodyKernel; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
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
): { readonly result: Type; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndex.result === 0) {
    const result: {
      readonly result: TypeInputAndOutput;
      readonly nextIndex: number;
    } = decodeTypeInputAndOutput(patternIndex.nextIndex, binary);
    return { result: typeFunction(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 1) {
    const result: {
      readonly result: TypePartIdWithParameter;
      readonly nextIndex: number;
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
): { readonly result: TypeInputAndOutput; readonly nextIndex: number } => {
  const inputTypeAndNextIndex: {
    readonly result: Type;
    readonly nextIndex: number;
  } = decodeType(index, binary);
  const outputTypeAndNextIndex: {
    readonly result: Type;
    readonly nextIndex: number;
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
): { readonly result: TypePartIdWithParameter; readonly nextIndex: number } => {
  const typePartIdAndNextIndex: {
    readonly result: TypePartId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: TypePartId; readonly nextIndex: number })(
    index,
    binary
  );
  const parameterAndNextIndex: {
    readonly result: ReadonlyArray<Type>;
    readonly nextIndex: number;
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
): { readonly result: Expr; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndex.result === 0) {
    const result: {
      readonly result: KernelExpr;
      readonly nextIndex: number;
    } = decodeKernelExpr(patternIndex.nextIndex, binary);
    return { result: exprKernel(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 1) {
    const result: {
      readonly result: number;
      readonly nextIndex: number;
    } = decodeInt32(patternIndex.nextIndex, binary);
    return {
      result: exprInt32Literal(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    const result: {
      readonly result: PartId;
      readonly nextIndex: number;
    } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: PartId; readonly nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: exprPartReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 3) {
    const result: {
      readonly result: LocalPartReference;
      readonly nextIndex: number;
    } = decodeLocalPartReference(patternIndex.nextIndex, binary);
    return {
      result: exprLocalPartReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 4) {
    const result: {
      readonly result: TagReference;
      readonly nextIndex: number;
    } = decodeTagReference(patternIndex.nextIndex, binary);
    return {
      result: exprTagReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 5) {
    const result: {
      readonly result: FunctionCall;
      readonly nextIndex: number;
    } = decodeFunctionCall(patternIndex.nextIndex, binary);
    return {
      result: exprFunctionCall(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 6) {
    const result: {
      readonly result: ReadonlyArray<LambdaBranch>;
      readonly nextIndex: number;
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
): { readonly result: EvaluatedExpr; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndex.result === 0) {
    const result: {
      readonly result: KernelExpr;
      readonly nextIndex: number;
    } = decodeKernelExpr(patternIndex.nextIndex, binary);
    return {
      result: evaluatedExprKernel(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: {
      readonly result: number;
      readonly nextIndex: number;
    } = decodeInt32(patternIndex.nextIndex, binary);
    return {
      result: evaluatedExprInt32(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    const result: {
      readonly result: LocalPartReference;
      readonly nextIndex: number;
    } = decodeLocalPartReference(patternIndex.nextIndex, binary);
    return {
      result: evaluatedExprLocalPartReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 3) {
    const result: {
      readonly result: TagReference;
      readonly nextIndex: number;
    } = decodeTagReference(patternIndex.nextIndex, binary);
    return {
      result: evaluatedExprTagReference(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 4) {
    const result: {
      readonly result: ReadonlyArray<LambdaBranch>;
      readonly nextIndex: number;
    } = decodeList(decodeLambdaBranch)(patternIndex.nextIndex, binary);
    return {
      result: evaluatedExprLambda(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 5) {
    const result: {
      readonly result: KernelCall;
      readonly nextIndex: number;
    } = decodeKernelCall(patternIndex.nextIndex, binary);
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
): { readonly result: KernelCall; readonly nextIndex: number } => {
  const kernelAndNextIndex: {
    readonly result: KernelExpr;
    readonly nextIndex: number;
  } = decodeKernelExpr(index, binary);
  const exprAndNextIndex: {
    readonly result: EvaluatedExpr;
    readonly nextIndex: number;
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
): { readonly result: KernelExpr; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
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
): { readonly result: LocalPartReference; readonly nextIndex: number } => {
  const partIdAndNextIndex: {
    readonly result: PartId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: PartId; readonly nextIndex: number })(index, binary);
  const localPartIdAndNextIndex: {
    readonly result: LocalPartId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: LocalPartId; readonly nextIndex: number })(
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
): { readonly result: TagReference; readonly nextIndex: number } => {
  const typePartIdAndNextIndex: {
    readonly result: TypePartId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: TypePartId; readonly nextIndex: number })(
    index,
    binary
  );
  const tagIdAndNextIndex: {
    readonly result: TagId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: TagId; readonly nextIndex: number })(
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
): { readonly result: FunctionCall; readonly nextIndex: number } => {
  const functionAndNextIndex: {
    readonly result: Expr;
    readonly nextIndex: number;
  } = decodeExpr(index, binary);
  const parameterAndNextIndex: {
    readonly result: Expr;
    readonly nextIndex: number;
  } = decodeExpr(functionAndNextIndex.nextIndex, binary);
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
): { readonly result: LambdaBranch; readonly nextIndex: number } => {
  const conditionAndNextIndex: {
    readonly result: Condition;
    readonly nextIndex: number;
  } = decodeCondition(index, binary);
  const descriptionAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(conditionAndNextIndex.nextIndex, binary);
  const localPartListAndNextIndex: {
    readonly result: ReadonlyArray<BranchPartDefinition>;
    readonly nextIndex: number;
  } = decodeList(decodeBranchPartDefinition)(
    descriptionAndNextIndex.nextIndex,
    binary
  );
  const exprAndNextIndex: {
    readonly result: Expr;
    readonly nextIndex: number;
  } = decodeExpr(localPartListAndNextIndex.nextIndex, binary);
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
): { readonly result: Condition; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndex.result === 0) {
    const result: {
      readonly result: ConditionTag;
      readonly nextIndex: number;
    } = decodeConditionTag(patternIndex.nextIndex, binary);
    return {
      result: conditionByTag(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: {
      readonly result: ConditionCapture;
      readonly nextIndex: number;
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
    const result: {
      readonly result: number;
      readonly nextIndex: number;
    } = decodeInt32(patternIndex.nextIndex, binary);
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
): { readonly result: ConditionTag; readonly nextIndex: number } => {
  const tagAndNextIndex: {
    readonly result: TagId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: TagId; readonly nextIndex: number })(index, binary);
  const parameterAndNextIndex: {
    readonly result: Maybe<Condition>;
    readonly nextIndex: number;
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
): { readonly result: ConditionCapture; readonly nextIndex: number } => {
  const nameAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(index, binary);
  const localPartIdAndNextIndex: {
    readonly result: LocalPartId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: LocalPartId; readonly nextIndex: number })(
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
): { readonly result: BranchPartDefinition; readonly nextIndex: number } => {
  const localPartIdAndNextIndex: {
    readonly result: LocalPartId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: LocalPartId; readonly nextIndex: number })(
    index,
    binary
  );
  const nameAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(localPartIdAndNextIndex.nextIndex, binary);
  const descriptionAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const typeAndNextIndex: {
    readonly result: Type;
    readonly nextIndex: number;
  } = decodeType(descriptionAndNextIndex.nextIndex, binary);
  const exprAndNextIndex: {
    readonly result: Expr;
    readonly nextIndex: number;
  } = decodeExpr(typeAndNextIndex.nextIndex, binary);
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
): { readonly result: EvaluateExprError; readonly nextIndex: number } => {
  const patternIndex: {
    readonly result: number;
    readonly nextIndex: number;
  } = decodeInt32(index, binary);
  if (patternIndex.result === 0) {
    const result: {
      readonly result: PartId;
      readonly nextIndex: number;
    } = (decodeId as (
      a: number,
      b: Uint8Array
    ) => { readonly result: PartId; readonly nextIndex: number })(
      patternIndex.nextIndex,
      binary
    );
    return {
      result: evaluateExprErrorNeedPartDefinition(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 1) {
    const result: {
      readonly result: number;
      readonly nextIndex: number;
    } = decodeInt32(patternIndex.nextIndex, binary);
    return {
      result: evaluateExprErrorNeedSuggestionPart(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 2) {
    return {
      result: evaluateExprErrorBlank,
      nextIndex: patternIndex.nextIndex,
    };
  }
  if (patternIndex.result === 3) {
    const result: {
      readonly result: LocalPartReference;
      readonly nextIndex: number;
    } = decodeLocalPartReference(patternIndex.nextIndex, binary);
    return {
      result: evaluateExprErrorCannotFindLocalPartDefinition(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 4) {
    const result: {
      readonly result: TypeError;
      readonly nextIndex: number;
    } = decodeTypeError(patternIndex.nextIndex, binary);
    return {
      result: evaluateExprErrorTypeError(result.result),
      nextIndex: result.nextIndex,
    };
  }
  if (patternIndex.result === 5) {
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
): { readonly result: TypeError; readonly nextIndex: number } => {
  const messageAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
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
export const decodeEvalParameter = (
  index: number,
  binary: Uint8Array
): { readonly result: EvalParameter; readonly nextIndex: number } => {
  const partListAndNextIndex: {
    readonly result: ReadonlyArray<PartWithId>;
    readonly nextIndex: number;
  } = decodeList(decodePartWithId)(index, binary);
  const typePartListAndNextIndex: {
    readonly result: ReadonlyArray<TypePartWithId>;
    readonly nextIndex: number;
  } = decodeList(decodeTypePartWithId)(partListAndNextIndex.nextIndex, binary);
  const changeListAndNextIndex: {
    readonly result: ReadonlyArray<Change>;
    readonly nextIndex: number;
  } = decodeList(decodeChange)(typePartListAndNextIndex.nextIndex, binary);
  const exprAndNextIndex: {
    readonly result: SuggestionExpr;
    readonly nextIndex: number;
  } = decodeSuggestionExpr(changeListAndNextIndex.nextIndex, binary);
  return {
    result: {
      partList: partListAndNextIndex.result,
      typePartList: typePartListAndNextIndex.result,
      changeList: changeListAndNextIndex.result,
      expr: exprAndNextIndex.result,
    },
    nextIndex: exprAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodePartWithId = (
  index: number,
  binary: Uint8Array
): { readonly result: PartWithId; readonly nextIndex: number } => {
  const idAndNextIndex: {
    readonly result: PartId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: PartId; readonly nextIndex: number })(index, binary);
  const partAndNextIndex: {
    readonly result: PartSnapshot;
    readonly nextIndex: number;
  } = decodePartSnapshot(idAndNextIndex.nextIndex, binary);
  return {
    result: { id: idAndNextIndex.result, part: partAndNextIndex.result },
    nextIndex: partAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeTypePartWithId = (
  index: number,
  binary: Uint8Array
): { readonly result: TypePartWithId; readonly nextIndex: number } => {
  const idAndNextIndex: {
    readonly result: TypePartId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: TypePartId; readonly nextIndex: number })(
    index,
    binary
  );
  const typePartAndNextIndex: {
    readonly result: TypePartSnapshot;
    readonly nextIndex: number;
  } = decodeTypePartSnapshot(idAndNextIndex.nextIndex, binary);
  return {
    result: {
      id: idAndNextIndex.result,
      typePart: typePartAndNextIndex.result,
    },
    nextIndex: typePartAndNextIndex.nextIndex,
  };
};

/**
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeCreateProjectParameter = (
  index: number,
  binary: Uint8Array
): { readonly result: CreateProjectParameter; readonly nextIndex: number } => {
  const accessTokenAndNextIndex: {
    readonly result: AccessToken;
    readonly nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { readonly result: AccessToken; readonly nextIndex: number })(
    index,
    binary
  );
  const projectNameAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
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
): { readonly result: CreateIdeaParameter; readonly nextIndex: number } => {
  const accessTokenAndNextIndex: {
    readonly result: AccessToken;
    readonly nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { readonly result: AccessToken; readonly nextIndex: number })(
    index,
    binary
  );
  const ideaNameAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(accessTokenAndNextIndex.nextIndex, binary);
  const projectIdAndNextIndex: {
    readonly result: ProjectId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: ProjectId; readonly nextIndex: number })(
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
): { readonly result: AddCommentParameter; readonly nextIndex: number } => {
  const accessTokenAndNextIndex: {
    readonly result: AccessToken;
    readonly nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { readonly result: AccessToken; readonly nextIndex: number })(
    index,
    binary
  );
  const ideaIdAndNextIndex: {
    readonly result: IdeaId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: IdeaId; readonly nextIndex: number })(
    accessTokenAndNextIndex.nextIndex,
    binary
  );
  const commentAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
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
): { readonly result: AddSuggestionParameter; readonly nextIndex: number } => {
  const accessTokenAndNextIndex: {
    readonly result: AccessToken;
    readonly nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { readonly result: AccessToken; readonly nextIndex: number })(
    index,
    binary
  );
  const ideaIdAndNextIndex: {
    readonly result: IdeaId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: IdeaId; readonly nextIndex: number })(
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
): {
  readonly result: UpdateSuggestionParameter;
  readonly nextIndex: number;
} => {
  const accessTokenAndNextIndex: {
    readonly result: AccessToken;
    readonly nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { readonly result: AccessToken; readonly nextIndex: number })(
    index,
    binary
  );
  const suggestionIdAndNextIndex: {
    readonly result: SuggestionId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: SuggestionId; readonly nextIndex: number })(
    accessTokenAndNextIndex.nextIndex,
    binary
  );
  const nameAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(suggestionIdAndNextIndex.nextIndex, binary);
  const reasonAndNextIndex: {
    readonly result: string;
    readonly nextIndex: number;
  } = decodeString(nameAndNextIndex.nextIndex, binary);
  const changeListAndNextIndex: {
    readonly result: ReadonlyArray<Change>;
    readonly nextIndex: number;
  } = decodeList(decodeChange)(reasonAndNextIndex.nextIndex, binary);
  return {
    result: {
      accessToken: accessTokenAndNextIndex.result,
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
): {
  readonly result: AccessTokenAndSuggestionId;
  readonly nextIndex: number;
} => {
  const accessTokenAndNextIndex: {
    readonly result: AccessToken;
    readonly nextIndex: number;
  } = (decodeToken as (
    a: number,
    b: Uint8Array
  ) => { readonly result: AccessToken; readonly nextIndex: number })(
    index,
    binary
  );
  const suggestionIdAndNextIndex: {
    readonly result: SuggestionId;
    readonly nextIndex: number;
  } = (decodeId as (
    a: number,
    b: Uint8Array
  ) => { readonly result: SuggestionId; readonly nextIndex: number })(
    accessTokenAndNextIndex.nextIndex,
    binary
  );
  return {
    result: {
      accessToken: accessTokenAndNextIndex.result,
      suggestionId: suggestionIdAndNextIndex.result,
    },
    nextIndex: suggestionIdAndNextIndex.nextIndex,
  };
};
