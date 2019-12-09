import * as firestore from "@firebase/firestore-types";

/**
 * firestoreのに保存する形式
 */
export type Firestore = {
  user: { doc: User; col: {} };
  accessToken: { doc: AccessTokenData; col: {} };
  project: { doc: Project; col: {} };
  googleState: { doc: State; col: {} };
  gitHubState: { doc: State; col: {} };
  lineState: { doc: State; col: {} };
  branch: { doc: Branch; col: {} };
  commit: { doc: Commit; col: {} };
  draftCommit: { doc: DraftCommit; col: {} };
  moduleSnapshot: { doc: ModuleSnapshot; col: {} };
  partDefSnapshot: { doc: PartDefSnapshot; col: {} };
  typeDefSnapshot: { doc: TypeDefSnapshot; col: {} };
};

export type UserId = string & { _userId: never };
/**
 *  画像のハッシュ値。
 *  gs://definy-lang.appspot.com/ハッシュ値
 *  に保存してある
 */
export type ImageHash = string & { _imageHash: never };

/**
 * アクセストークン。個人的なデータにアクセスするための鍵。
 * getLogInUrlで取得したログインURLのページからリダイレクトするときのクエリパラメータについてくる。
 * 使う文字は0123456789abcdef。長さは48文字
 * functions内で生成してブラウザのindexed DBに保存する
 */
export type AccessToken = string & { _accessToken: never };
/**
 * アクセストークンのハッシュ値。
 * firestoreに保存して、functions内でブラウザから送られてきたアクセストークンのハッシュ値を求めて比較して秘密のリソースをブラウザに渡す
 */
export type AccessTokenHash = string & { _accessTokenHash: never };

export type ProjectId = string & { _projectId: never };

export type BranchId = string & { _accessTokenHash: never };

/**
 * Definyでよく使う識別子 最初の1文字はアルファベット、それ以降は数字と大文字アルファベット、小文字のアルファベット。1文字以上63文字以下
 */
export type Label = string & { _Label: never };

export type CommitHash = string & { _commitHash: never };

export type LogInServiceAndId = {
  readonly service: SocialLoginService;
  /** サービス内でのアカウントID */
  readonly accountId: string;
};

export type SocialLoginService = "google" | "gitHub" | "line";

export type User = {
  /** ユーザー名
   * 表示される名前。他のユーザーとかぶっても良い。絵文字も使える
   * 全角英数は半角英数、半角カタカナは全角カタカナ、(株)の合字を分解するなどのNFKCの正規化がされる
   * U+0000-U+0019 と U+007F-U+00A0 の範囲の文字は入らない
   * 前後に空白を含められない
   * 間の空白は2文字以上連続しない
   * 文字数のカウント方法は正規化されたあとのCodePoint単位
   * Twitterと同じ、1文字以上50文字以下
   */
  readonly name: string;
  /**
   * プロフィール画像
   */
  readonly imageHash: ImageHash;
  /**
   * 自己紹介文。改行文字を含めることができる。
   *
   * Twitterと同じ 0～160文字
   */
  readonly introduction: string;
  /** 所有者になっているブランチ */
  readonly branchIds: ReadonlyArray<BranchId>;
  /** ユーザーが作成された日時 */
  readonly createdAt: firestore.Timestamp;
  /** プロジェクトに対する いいね */
  readonly likedProjectIds: ReadonlyArray<ProjectId>;
};

/**
 * 他のユーザーから読めない、ユーザーの隠された情報
 */
export type UserSecret = {
  /** 他のユーザーから見られたくない、個人的なプロジェクトに対する いいね */
  readonly bookmarkedProjectIds: ReadonlyArray<ProjectId>;
  /** 最後にログインしたアクセストークンのハッシュ値 */
  readonly lastAccessTokenHash: AccessTokenHash;
  /** ユーザーのログイン */
  readonly logInServiceAndId: LogInServiceAndId;
};

export type AccessTokenData = {
  readonly userId: UserId;
  readonly issuedAt: firestore.Timestamp;
};

/**
 *
 */
export type Project = {
  /** マスターブランチ、型チェックが通ったもののみコミットできる */
  readonly masterBranch: BranchId;
  /** プロジェクトが持つブランチ */
  readonly branches: ReadonlyArray<BranchId>;
  /** 安定版としてリソースされたコミット */
  readonly statableReleasedCommitHashes: ReadonlyArray<CommitHash>;
  /** ベータ版としてリソースされたコミット */
  readonly betaReleasedCommitHashes: ReadonlyArray<CommitHash>;
};

/**
 * OpenId ConnectのState
 * リプレイアタックを防いだり、他のサーバーがDefinyのクライアントIDを使って発行してもDefinyのサーバーが発行したものと見比べて、Definyのサーバーが発行したものだけを有効にするために必要
 */
export type State = {
  readonly createdAt: firestore.Timestamp;
};

/**
 * ブランチ。コミットの流れをまとめたもの
 */
export type Branch = {
  /**
   * ブランチの名前
   */
  readonly name: Label;
  /**
   * ブランチ所有者 (変わらない)
   */
  readonly ownerId: UserId;
  /**
   * ブランチが所属しているプロジェクト (変わらない)
   */
  readonly projectId: ProjectId;
  /**
   * ブランチの説明
   */
  readonly description: string;
  /**
   * ブランチの最新のコミット
   */
  readonly headHash: CommitHash;
  /**
   * 下書きのコミット
   */
  readonly draftCommit: DraftCommitHash;
};

export type DraftCommitHash = string & { _draftCommitHash: never };

/** ブランチに対して1つまで? indexともいう。他人のドラフトコミットは見れない。プロジェクト名を決めずにやれると速くて便利
 * 作者はブランチの所有者と同じになるのでいらない
 * ドキュメントサイズ最大 1,048,576byte
 */
export type DraftCommit = {
  readonly hash: DraftCommitHash;
  /** 作成日時 (この値を使ってハッシュ値を求めてしまうと編集していないのに変更したと判定されてしまう) */
  readonly date: Date;
  /** コミットの説明 最大1000文字 */
  readonly description: string;
  /** リリースとして公開する予定か */
  readonly isRelease: boolean;
  /** プロジェクト名 最大50文字 */
  readonly projectName: string;
  /** プロジェクトのアイコン */
  readonly projectIcon: ImageHash;
  /** プロジェクトの画像 */
  readonly projectImage: ImageHash;
  /** プロジェクトの簡潔な説明 最大150文字 */
  readonly projectSummary: string;
  /** プロジェクトの詳しい説明 最大1000文字 */
  readonly projectDescription: string;
  /** 直下以外のモジュール 最大3000こ */
  readonly children: ReadonlyArray<{
    id: ModuleId;
    snapshot: ModuleSnapshot;
  }>;
  /** 直下の型定義 最大300こ */
  readonly typeDefs: ReadonlyArray<{
    id: TypeId;
    snapshot: TypeDefSnapshot;
  }>;
  /** 直下のパーツ定義 最大5000こ */
  readonly partDefs: ReadonlyArray<{
    id: PartId;
    snapshot: PartDefSnapshot;
  }>;
  /** 依存プロジェクト 最大1000こ */
  dependencies: ReadonlyArray<CommitHash>;
};

/**
 * プロジェクトのデータのスナップショット。このデータは一度作ったら変えない
 */
export type Commit = {
  /**
   * 前のコミットのコミット
   */
  readonly parentCommitHashes: ReadonlyArray<CommitHash>;
  /**
   * 作られていたときに所属していたブランチ
   */
  readonly branchId: BranchId;
  /**
   * 作成日時
   */
  readonly date: firestore.Timestamp;
  /**
   * どんな変更をしたのかの説明
   */
  readonly commitDescription: string;
  /**
   * プロジェクト名
   */
  readonly projectName: string;
  /**
   * プロジェクトのアイコン画像
   */
  readonly projectIconHash: ImageHash | null;
  /**
   * プロジェクトのカバー画像
   */
  readonly projectImageHash: ImageHash | null;
  /**
   * プロジェクトの簡潔な説明 キャッチコピー
   */
  readonly projectSummary: string;
  /**
   * プロジェクトの詳しい説明
   */
  readonly projectDescription: string;
  /**
   *  直下以外のモジュール 最大3000こ
   */
  readonly children: ReadonlyArray<{
    readonly id: ModuleId;
    readonly hash: ModuleSnapshotHash;
  }>;
  /** 直下の型定義 最大300こ */
  readonly typeDefs: ReadonlyArray<{
    readonly id: TypeId;
    readonly hash: TypeDefSnapshotHash;
  }>;
  /** 直下のパーツ定義 最大5000こ */
  readonly partDefs: ReadonlyArray<{
    readonly id: PartId;
    readonly hash: PartDefSnapshotHash;
  }>;
  /** 依存プロジェクト 最大1000こ */
  readonly dependencies: ReadonlyArray<CommitHash>;
};

/** 0～fで64文字 256bit SHA-256のハッシュ値 */
export type ModuleSnapshotHash = string & { _moduleSnapshot: never };

export type ModuleSnapshot = {
  /** モジュールの名前 */
  name: Label;
  /**
   *  下のモジュール 最大3000こ
   */
  children: ReadonlyArray<{
    id: ModuleId;
    snapshot: ModuleSnapshot;
  }>;
  /** 型定義 最大300こ */
  typeDefs: ReadonlyArray<{
    id: TypeId;
    snapshot: TypeDefSnapshot;
  }>;
  /** パーツ定義 最大5000こ */
  partDefs: ReadonlyArray<{
    id: PartId;
    snapshot: PartDefSnapshot;
  }>;
  /** モジュールの説明 */
  description: string;
  /** 外部のプロジェクトに公開するかどうか */
  exposing: boolean;
};

export type ModuleId = string & { _moduleId: never };

export type TypeId = string & { _typeId: never };

export type TypeDefSnapshot = {
  hash: TypeDefSnapshotHash;
  name: Label;
  description: string;
  body: TypeBody;
};

/** 0～fで64文字 256bit SHA-256のハッシュ値 */
export type TypeDefSnapshotHash = string & { _typeDefSnapshot: never };

export type TypeBody = TypeBodyTags | TypeBodyKernel;

export type TypeBodyTags = {
  readonly type: "tag";
  readonly tags: ReadonlyArray<TypeBodyTag>;
};

export type TypeBodyTag = {
  readonly name: Label;
  readonly description: string;
  readonly parameter: ReadonlyArray<TypeTermOrParenthesis>;
};

export type TypeBodyKernel = {
  readonly type: "kernel";
  readonly kernelType: KernelType;
};

export type KernelType = "float64" | "string" | "array" | "function";

export type TypeTermOrParenthesis =
  | TypeTermParenthesisStart
  | TypeTermParenthesisEnd
  | TypeTermRef;

export type TypeTermParenthesisStart = {
  readonly type: "(";
};

export type TypeTermParenthesisEnd = {
  readonly type: ")";
};

/**
 * 定義された型を使う
 */
export type TypeTermRef = { readonly type: "ref"; readonly typeId: TypeId };

export type PartDefSnapshot = {
  /**
   * パーツのID
   */
  readonly id: PartId;
  /**
   * パーツの名前
   */
  readonly name: Label;
  /**
   * パーツの説明
   */
  readonly description: string;
  /**
   * パーツの型
   */
  readonly type: ReadonlyArray<TypeTermOrParenthesis>;
  readonly expr: {
    /**
     * 値を表すハッシュ値
     */
    readonly hash: ExprSnapshotHash;
    /**
     * ExprBody のJSONデータ
     */
    readonly body: string;
  };
};

/** 0～fで64文字 256bit SHA-256のハッシュ値 */
export type PartDefSnapshotHash = string & { _partDefSnapshot: never };

export type PartId = string & { __partIdBrand: never };

/** 0～fで64文字 256bit SHA-256のハッシュ値 */
export type ExprSnapshotHash = string & { _exprSnapshot: never };

/** 式本体 */
export type ExprBody = Array<TermOrParenthesis>;

export type TermOrParenthesis =
  | TermParenthesisStart
  | TermParenthesisEnd
  | TermNumber
  | TermPartRef
  | TermKernel;

/** 式の開きカッコ */
export type TermParenthesisStart = { readonly type: "(" };
/** 式の閉じカッコ */
export type TermParenthesisEnd = { readonly type: ")" };
/** float64 数値 */
export type TermNumber = { readonly type: "number"; readonly value: number };
/** パーツ */
export type TermPartRef = {
  readonly type: "part";
  readonly partId: PartDefSnapshotHash;
};
/** Definy内部で定義されたパーツ */
export type TermKernel = {
  readonly type: "kernel";
  readonly value: KernelTerm;
};

export type KernelTerm = "add" | "sub" | "mul" | "div";
