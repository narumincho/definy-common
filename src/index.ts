import { firestore } from "firebase/app";
import * as crypto from "crypto";

/** ユーザー名
 * 表示される名前。他のユーザーとかぶっても良い。絵文字も使える
 * ユーザー名と画像の両方が類似していた場合作れないようにする?
 * 全角英数,半角カタカナ,改行文字,制御文字,@ は使えない
 * 前後に空白を含められない
 * 間の空白は2文字以上連続しない
 * Twitterと同じ、1文字以上50文字以下
 */
export type UserName = string & { _userName: never };

export const userNameFromString = (text: string): UserName => {
  if ([...text].length === 0) {
    throw new Error("userName length must be 1～64");
  }
  return text as UserName;
};

/**
 * 自己紹介文。改行文字を含めることができる。
 * Twitterと同じ 0～160文字
 */
export type UserIntroduction = string & { _userIntroduction: never };

/**
 *
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

/**
 * アクセストークンを生成する。functions向けの処理
 */
export const createAccessToken = (): AccessToken => {
  return crypto.randomBytes(24).toString("hex") as AccessToken;
};

export const hashAccessToken = (accessToken: AccessToken): AccessTokenHash =>
  crypto
    .createHash("sha256")
    .update(accessTokenToTypedArray(accessToken))
    .digest("hex") as AccessTokenHash;

const accessTokenToTypedArray = (accessToken: AccessToken): Uint8Array => {
  const binary = new Uint8Array(24);
  for (let i = 0; i < 24; i++) {
    binary[i] = Number.parseInt(accessToken.slice(i, i + 2), 16);
  }
  return binary;
};

export type ProjectId = string & { _projectId: never };

export type BranchId = string & { _accessTokenHash: never };

export type LogInServiceAndId = {
  service: SocialLoginService;
  accountId: string;
};

export type SocialLoginService = "google" | "gitHub" | "line";

export type User = {
  /** ユーザー名 */
  readonly name: UserName;
  readonly imageHash: ImageHash;
  /** 自己紹介文 */
  readonly introduction: UserIntroduction;
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
  readonly lastAccessTokenHash: AccessTokenHash;
  readonly logInServiceAndId: LogInServiceAndId;
};

export const userCollection = (
  firestore: firestore.Firestore
): firestore.CollectionReference => firestore.collection("user");
