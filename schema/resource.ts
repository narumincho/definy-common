import { type } from "@narumincho/type";
import * as idAndToken from "./idAndToken";
import * as time from "./time";

const userSnapshotName = "UserSnapshot";
const userSnapshotAndIdName = "UserSnapshotAndId";
const userResponseName = "UserResponse";

const projectSnapshotName = "ProjectSnapshot";
const projectSnapshotAndIdName = "ProjectSnapshotAndId";
const projectResponseName = "ProjectResponse";

const ideaSnapshotName = "IdeaSnapshot";
const ideaSnapshotAndIdName = "IdeaSnapshotAndId";
const ideaResponseName = "IdeaResponse";
const IdeaListByProjectIdResponseName = "IdeaListByProjectIdResponse";

const ideaItemName = "IdeaItem";
const itemBodyName = "ItemBody";

export const customTypeList: ReadonlyArray<type.CustomType> = [
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
        memberType: idAndToken.fileHash,
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
        memberType: time.time,
      },
      {
        name: "likeProjectIdList",
        description: "プロジェクトに対する いいね",
        memberType: type.typeList(idAndToken.projectId),
      },
      {
        name: "developProjectIdList",
        description: "開発に参加した (書いたコードが使われた) プロジェクト",
        memberType: type.typeList(idAndToken.projectId),
      },
      {
        name: "commentIdeaIdList",
        description: "コメントをしたアイデア",
        memberType: type.typeList(idAndToken.ideaId),
      },
      {
        name: "getTime",
        description: "取得日時",
        memberType: time.time,
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
        memberType: idAndToken.userId,
      },
      {
        name: "snapshot",
        description: "ユーザーのスナップショット",
        memberType: type.typeCustom(userSnapshotName),
      },
    ]),
  },
  {
    name: userResponseName,
    description:
      "Maybe プロジェクトのスナップショット と userId. TypeScript→Elmに渡す用",
    body: type.customTypeBodyProduct([
      {
        name: "id",
        description: "ユーザーID",
        memberType: idAndToken.userId,
      },
      {
        name: "snapshotMaybe",
        description: "ユーザーのデータ",
        memberType: type.typeMaybe(type.typeCustom(userSnapshotName)),
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
        memberType: idAndToken.fileHash,
      },
      {
        name: "imageHash",
        description: "プロジェクトのカバー画像",
        memberType: idAndToken.fileHash,
      },
      {
        name: "createTime",
        description: "作成日時",
        memberType: time.time,
      },
      {
        name: "createUser",
        description: "作成アカウント",
        memberType: idAndToken.userId,
      },
      {
        name: "updateTime",
        description: "更新日時",
        memberType: time.time,
      },
      {
        name: "getTime",
        description: "取得日時",
        memberType: time.time,
      },
      {
        name: "partIdList",
        description: "所属しているのパーツのIDのリスト",
        memberType: type.typeList(idAndToken.partId),
      },
      {
        name: "typePartIdList",
        description: "所属している型パーツのIDのリスト",
        memberType: type.typeList(idAndToken.typePartId),
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
        memberType: idAndToken.projectId,
      },
      {
        name: "snapshot",
        description: "プロジェクトのスナップショット",
        memberType: type.typeCustom(projectSnapshotName),
      },
    ]),
  },
  {
    name: projectResponseName,
    description:
      "Maybe プロジェクトのスナップショット と projectId. TypeScript→Elmに渡す用",
    body: type.customTypeBodyProduct([
      {
        name: "id",
        description: "プロジェクトのID",
        memberType: idAndToken.projectId,
      },
      {
        name: "snapshotMaybe",
        description: "プロジェクトのデータ",
        memberType: type.typeMaybe(type.typeCustom(projectSnapshotName)),
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
        memberType: idAndToken.userId,
      },
      {
        name: "createTime",
        description: "作成日時",
        memberType: time.time,
      },
      {
        name: "projectId",
        description: "対象のプロジェクト",
        memberType: idAndToken.projectId,
      },
      {
        name: "itemList",
        description: "アイデアの要素",
        memberType: type.typeList(type.typeCustom(ideaItemName)),
      },
      {
        name: "updateTime",
        description: "更新日時",
        memberType: time.time,
      },
      {
        name: "getTime",
        description: "取得日時",
        memberType: time.time,
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
        memberType: idAndToken.ideaId,
      },
      {
        name: "snapshot",
        description: "アイデアのスナップショット",
        memberType: type.typeCustom(ideaSnapshotName),
      },
    ]),
  },
  {
    name: ideaResponseName,
    description: "Maybe アイデア と ideaId. TypeScript→Elmに渡す用",
    body: type.customTypeBodyProduct([
      {
        name: "id",
        description: "アイデアID",
        memberType: idAndToken.ideaId,
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
        memberType: idAndToken.projectId,
      },
      {
        name: "ideaSnapshotAndIdList",
        description: "アイデアの一覧",
        memberType: type.typeList(type.typeCustom(ideaSnapshotAndIdName)),
      },
    ]),
  },
  {
    name: ideaItemName,
    description: "アイデアのコメント",
    body: type.customTypeBodyProduct([
      {
        name: "createUserId",
        description: "作成者",
        memberType: idAndToken.userId,
      },
      {
        name: "createTime",
        description: "作成日時",
        memberType: time.time,
      },
      {
        name: "body",
        description: "本文",
        memberType: type.typeCustom(itemBodyName),
      },
    ]),
  },
  {
    name: itemBodyName,
    description: "アイデアのアイテム",
    body: type.customTypeBodySum([
      {
        name: "Comment",
        description: "文章でのコメントをした",
        parameter: type.maybeJust(type.typeString),
      },
      {
        name: "SuggestionCreate",
        description: "提案を作成した",
        parameter: type.maybeJust(idAndToken.suggestionId),
      },
      {
        name: "SuggestionToApprovalPending",
        description: "提案を承認待ちにした",
        parameter: type.maybeJust(idAndToken.suggestionId),
      },
      {
        name: "SuggestionCancelToApprovalPending",
        description: "承認待ちをキャンセルした",
        parameter: type.maybeJust(idAndToken.suggestionId),
      },
      {
        name: "SuggestionApprove",
        description: "提案を承認した",
        parameter: type.maybeJust(idAndToken.suggestionId),
      },
      {
        name: "SuggestionReject",
        description: "提案を拒否した",
        parameter: type.maybeJust(idAndToken.suggestionId),
      },
      {
        name: "SuggestionCancelRejection",
        description: "提案の拒否をキャンセルした",
        parameter: type.maybeJust(idAndToken.suggestionId),
      },
    ]),
  },
];
