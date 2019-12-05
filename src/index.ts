import { firestore } from "firebase/app";

export type Result<error, ok> =
  | { _type: "error"; value: error }
  | { _type: "ok"; value: ok };

/** ユーザー名
 * 表示される名前。他のユーザーとかぶっても良い。絵文字も使える
 * 全角英数は半角英数、半角カタカナは全角カタカナ、(株)の合字を分解するなどのNFKCの正規化がされる
 * U+0000-U+0019 と U+007F-U+00A0 の範囲の文字は入らない
 * 前後に空白を含められない
 * 間の空白は2文字以上連続しない
 * 文字数のカウント方法は正規化されたあとのCodePoint単位
 * Twitterと同じ、1文字以上50文字以下
 */
export type UserName = string & { _userName: never };

type UserNameError = "tooLong" | "empty" | "includeControlCharacter";

export const userNameFromString = (
  text: string
): Result<UserNameError, UserName> => {
  text = removeConsecutiveSpace(text.normalize("NFC").trim());
  if (text.length < 0) {
    return { _type: "error", value: "empty" };
  }
  if (50 < [...text].length) {
    return { _type: "error", value: "tooLong" };
  }
  if (/[\u{0000}-\u{0019}\u{007F}-\u{00A0}]/u.test(text)) {
    return { _type: "error", value: "includeControlCharacter" };
  }
  return { _type: "ok", value: text as UserName };
};

/** 連続した空白を削除 */
const removeConsecutiveSpace = (text: string): string => {
  let beforeSpace = false;
  let result = "";
  for (const char of text) {
    if (char === " ") {
      if (beforeSpace) {
        continue;
      }
      beforeSpace = true;
      result += char;
      continue;
    }
    beforeSpace = false;
    result += char;
  }
  return result;
};

/**
 * 自己紹介文。改行文字を含めることができる。
 *
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
