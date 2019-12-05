import * as firestore from "@google-cloud/firestore";

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

export type CommitHash = string & { __commitObjectHashBrand: never };

export type LogInServiceAndId = {
  service: SocialLoginService;
  accountId: string;
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
  readonly issuedAt: FirebaseFirestore.Timestamp;
};

// コレクションはProject。KeyはProjectId
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

/** ユーザーのコレクション */
export const userCollection = (
  firestore: firestore.Firestore
): firestore.CollectionReference => firestore.collection("user");

/** プロジェクトのコレクション */
export const projectCollection = (firestore: firestore.Firestore) => {};

const moduleCollection = dataBase.collection("module");
const branchCollection = dataBase.collection("branch");
const commitCollection = dataBase.collection("commit");
const draftCommitCollection = dataBase.collection("draftCommit");
const typeCollection = dataBase.collection("type");
const partCollection = dataBase.collection("part");
const exprCollection = dataBase.collection("expr");
