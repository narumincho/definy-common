import * as firestore from "@firebase/firestore-types";

/**
 * firestoreのに保存する形式
 */
type Firestore = {
  user: { key: UserId; value: User; subCollections: {} };
  userSecret: { key: UserId; value: UserSecret; subCollections: {} };
  accessToken: {
    key: AccessTokenHash;
    value: AccessTokenData;
    subCollections: {};
  };
  project: { key: ProjectId; value: Project; subCollections: {} };
  googleState: { key: string; value: State; subCollections: {} };
  gitHubState: { key: string; value: State; subCollections: {} };
  lineState: { key: string; value: State; subCollections: {} };
  branch: { key: BranchId; value: Branch; subCollections: {} };
  commit: { key: CommitHash; value: Commit; subCollections: {} };
  draftCommit: { key: DraftCommitId; value: DraftCommit; subCollections: {} };
  moduleSnapshot: {
    key: ModuleSnapshotHash;
    value: ModuleSnapshot;
    subCollections: {};
  };
  partDefSnapshot: {
    key: PartDefSnapshotHash;
    value: PartDefSnapshot;
    subCollections: {};
  };
  typeDefSnapshot: {
    key: TypeDefSnapshotHash;
    value: TypeDefSnapshot;
    subCollections: {};
  };
};

type UserId = string & { _userId: never };
/**
 *  ファイルのハッシュ値
 *  gs://definy-lang.appspot.com/ハッシュ値
 *  に保存してある
 */
type FileHash = string & { _fileHash: never };

/**
 * アクセストークン。個人的なデータにアクセスするための鍵。
 * getLogInUrlで取得したログインURLのページからリダイレクトするときのクエリパラメータについてくる。
 * 使う文字は0123456789abcdef。長さは48文字
 * functions内で生成してブラウザのindexed DBに保存する
 */
type AccessToken = string & { _accessToken: never };
/**
 * アクセストークンのハッシュ値。
 * firestoreに保存して、functions内でブラウザから送られてきたアクセストークンのハッシュ値を求めて比較して秘密のリソースをブラウザに渡す
 */
type AccessTokenHash = string & { _accessTokenHash: never };

type ProjectId = string & { _projectId: never };

type BranchId = string & { _accessTokenHash: never };

/**
 * Definyでよく使う識別子 最初の1文字はアルファベット、それ以降は数字と大文字アルファベット、小文字のアルファベット。1文字以上63文字以下
 */
type Label = string & { _Label: never };

type CommitHash = string & { _commitHash: never };

/** ソーシャルログインに関する情報 */
type OpenIdConnectProviderAndId = {
  /** プロバイダー (例: LINE, Google, GitHub) */
  readonly provider: OpenIdConnectProvider;
  /** プロバイダー内でのアカウントID */
  readonly idInProvider: string;
};

type OpenIdConnectProvider = "google" | "gitHub" | "line";

type User = {
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
  readonly imageHash: FileHash;
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
type UserSecret = {
  /** 他のユーザーから見られたくない、個人的なプロジェクトに対する いいね */
  readonly bookmarkedProjectIds: ReadonlyArray<ProjectId>;
  /** 最後にログインしたアクセストークンのハッシュ値 */
  readonly lastAccessTokenHash: AccessTokenHash;
  /** ユーザーのログイン */
  readonly openIdConnect: OpenIdConnectProviderAndId;
  /** コルクボードに書いた式 */
  readonly corkBoardParts: ReadonlyArray<PartDefSnapshot>;
};

/**
 * アクセストークンに含まれるデータ
 */
type AccessTokenData = {
  readonly userId: UserId;
  readonly issuedAt: firestore.Timestamp;
};

/**
 *  作品の単位。パッケージ化するしないとかはない
 */
type Project = {
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
type State = {
  /** 作成日時 */
  readonly createdAt: firestore.Timestamp;
  /**
   * ログインする前に訪れたURLのパス。
   * ログインボタンを押したページに戻れるようにするために保存しておく
   */
  readonly path: string;
};

/**
 * ブランチ。コミットの流れをまとめたもの
 */
type Branch = {
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
  readonly headCommitHash: CommitHash;
  /**
   * 下書きのコミット
   */
  readonly draftCommit: DraftCommitId;
};

type DraftCommitId = string & { _draftCommitId: never };

type DraftCommitHash = string & { _draftCommitHash: never };
/** ブランチに対して1つまで。indexともいう。ブランチ所有者以外ののドラフトコミットは見れない。
 * 作者はブランチの所有者と同じになるのでいらない
 * ドキュメントサイズ最大 1,048,576byte
 */
type DraftCommit = {
  /** 比較するときに便利 */
  readonly hash: DraftCommitHash;
  /** 作成日時 (この値を使ってハッシュ値を求めてしまうと編集していないのに変更したと判定されてしまう) */
  readonly date: firestore.Timestamp;
  /** コミットの説明 最大1000文字 */
  readonly description: string;
  /** リリースとして公開する予定か */
  readonly isRelease: boolean;
  /** プロジェクト名 最大50文字 */
  readonly projectName: string;
  /** プロジェクトのアイコン */
  readonly projectIconHash: FileHash;
  /** プロジェクトの画像 */
  readonly projectImageHash: FileHash;
  /** プロジェクトの簡潔な説明 最大150文字 */
  readonly projectSummary: string;
  /** プロジェクトの詳しい説明 最大1000文字 */
  readonly projectDescription: string;
  /** 直下以外のモジュール 最大3000こ */
  readonly children: ReadonlyArray<{
    id: ModuleId;
    snapshot: ModuleSnapshotHash;
  }>;
  /** 直下の型定義 最大300こ */
  readonly typeDefs: ReadonlyArray<{
    id: TypeId;
    snapshot: TypeDefSnapshotHash;
  }>;
  /** 直下のパーツ定義 最大5000こ */
  readonly partDefs: ReadonlyArray<{
    id: PartId;
    snapshot: PartDefSnapshotHash;
  }>;
  /** 依存プロジェクト 最大1000こ */
  readonly dependencies: ReadonlyArray<CommitHash>;
};

/**
 * プロジェクトのデータのスナップショット。このデータは一度作ったら変えない
 */
type Commit = {
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
  readonly projectIconHash: FileHash;
  /**
   * プロジェクトのカバー画像
   */
  readonly projectImageHash: FileHash;
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
type ModuleSnapshotHash = string & { _moduleSnapshot: never };

type ModuleSnapshot = {
  /** モジュールの名前 */
  readonly name: Label;
  /**
   *  下のモジュール 最大3000こ
   */
  readonly children: ReadonlyArray<{
    id: ModuleId;
    hash: ModuleSnapshotHash;
  }>;
  /** 型定義 最大300こ */
  readonly typeDefs: ReadonlyArray<{
    id: TypeId;
    hash: TypeDefSnapshotHash;
  }>;
  /** パーツ定義 最大5000こ */
  readonly partDefs: ReadonlyArray<{
    id: PartId;
    hash: PartDefSnapshotHash;
  }>;
  /** モジュールの説明 */
  readonly description: string;
  /** 外部のプロジェクトに公開するかどうか */
  readonly exposing: boolean;
};

type ModuleId = string & { _moduleId: never };

type TypeId = string & { _typeId: never };

type TypeDefSnapshot = {
  /**
   * 型のID
   */
  readonly id: TypeId;
  /**
   * 型の名前
   */
  readonly name: Label;
  /**
   * 型の説明
   */
  readonly description: string;
  /**
   * 型の本体
   */
  readonly body: TypeBody;
};

/** 0～fで64文字 256bit SHA-256のハッシュ値 */
type TypeDefSnapshotHash = string & { _typeDefSnapshot: never };

/** 型の本体 */
type TypeBody = TypeBodyTags | TypeBodyKernel;

/** タグによって構成された型 */
type TypeBodyTags = {
  readonly type: "tag";
  readonly tags: ReadonlyArray<TypeBodyTag>;
};

type TypeBodyTag = {
  readonly name: Label;
  readonly description: string;
  readonly parameter: ReadonlyArray<TypeTermOrParenthesis>;
};

/** 内部で定義された型 */
type TypeBodyKernel = {
  readonly type: "kernel";
  readonly kernelType: KernelType;
};

type KernelType = "float64" | "string" | "array" | "function";

type TypeTermOrParenthesis =
  | TypeTermParenthesisStart
  | TypeTermParenthesisEnd
  | TypeTermRef;

type TypeTermParenthesisStart = {
  readonly type: "(";
};

type TypeTermParenthesisEnd = {
  readonly type: ")";
};

/**
 * 定義された型を使う
 */
type TypeTermRef = { readonly type: "ref"; readonly typeId: TypeId };

type PartDefSnapshot = {
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
type PartDefSnapshotHash = string & { _partDefSnapshot: never };

type PartId = string & { __partIdBrand: never };

/** 0～fで64文字 256bit SHA-256のハッシュ値 */
type ExprSnapshotHash = string & { _exprSnapshot: never };

/** 式本体 */
type ExprBody = Array<TermOrParenthesis>;

type TermOrParenthesis =
  | TermParenthesisStart
  | TermParenthesisEnd
  | TermNumber
  | TermPartRef
  | TermKernel;

/** 式の開きカッコ */
type TermParenthesisStart = { readonly type: "(" };
/** 式の閉じカッコ */
type TermParenthesisEnd = { readonly type: ")" };
/** float64 数値 */
type TermNumber = { readonly type: "number"; readonly value: number };
/** パーツ */
type TermPartRef = {
  readonly type: "part";
  readonly partId: PartDefSnapshotHash;
};
/** Definy内部で定義されたパーツ */
type TermKernel = {
  readonly type: "kernel";
  readonly value: KernelTerm;
};

type KernelTerm = "add" | "sub" | "mul" | "div";
