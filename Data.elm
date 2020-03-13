module Data exposing (AccessToken(..), ClientMode(..), DateTime, FileHash(..), Idea, IdeaComment(..), IdeaCommentMessage, IdeaId(..), Language(..), Location(..), ModuleHash(..), ModuleSnapshot, OpenIdConnectProvider(..), PartHash(..), PartSnapshot, Project, ProjectHash(..), ProjectId(..), ProjectSnapshot, RequestLogInUrlRequestData, TypeHash(..), TypeSnapshot, UrlData, UserId(..), UserPublic, accessTokenJsonDecoder, accessTokenToJsonValue, clientModeJsonDecoder, clientModeToJsonValue, dateTimeJsonDecoder, dateTimeToJsonValue, fileHashJsonDecoder, fileHashToJsonValue, ideaCommentJsonDecoder, ideaCommentMessageJsonDecoder, ideaCommentMessageToJsonValue, ideaCommentToJsonValue, ideaIdJsonDecoder, ideaIdToJsonValue, ideaJsonDecoder, ideaToJsonValue, languageJsonDecoder, languageToJsonValue, locationJsonDecoder, locationToJsonValue, maybeJsonDecoder, maybeToJsonValue, moduleHashJsonDecoder, moduleHashToJsonValue, moduleSnapshotJsonDecoder, moduleSnapshotToJsonValue, openIdConnectProviderJsonDecoder, openIdConnectProviderToJsonValue, partHashJsonDecoder, partHashToJsonValue, partSnapshotJsonDecoder, partSnapshotToJsonValue, projectHashJsonDecoder, projectHashToJsonValue, projectIdJsonDecoder, projectIdToJsonValue, projectJsonDecoder, projectSnapshotJsonDecoder, projectSnapshotToJsonValue, projectToJsonValue, requestLogInUrlRequestDataJsonDecoder, requestLogInUrlRequestDataToJsonValue, resultJsonDecoder, resultToJsonValue, typeHashJsonDecoder, typeHashToJsonValue, typeSnapshotJsonDecoder, typeSnapshotToJsonValue, urlDataJsonDecoder, urlDataToJsonValue, userIdJsonDecoder, userIdToJsonValue, userPublicJsonDecoder, userPublicToJsonValue)

import Json.Decode as Jd
import Json.Decode.Pipeline as Jdp
import Json.Encode as Je


{-| 日時 最小単位は秒
-}
type alias DateTime =
    { year : Int, month : Int, day : Int, hour : Int, minute : Int, second : Int }


{-| デバッグの状態と, デバッグ時ならアクセスしているポート番号
-}
type ClientMode
    = DebugMode Int
    | Release


{-| ログインのURLを発行するために必要なデータ
-}
type alias RequestLogInUrlRequestData =
    { openIdConnectProvider : OpenIdConnectProvider, urlData : UrlData }


{-| プロバイダー (例: LINE, Google, GitHub)
-}
type OpenIdConnectProvider
    = Google
    | GitHub


{-| デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( <https://support.google.com/webmasters/answer/182192?hl=ja> )で,URLにページの言語のを入れて,言語ごとに別のURLである必要がある. デバッグ時のホスト名は <http://[::1]> になる
-}
type alias UrlData =
    { clientMode : ClientMode, location : Location, language : Language, accessToken : Maybe AccessToken }


{-| 英語,日本語,エスペラント語などの言語
-}
type Language
    = Japanese
    | English
    | Esperanto


{-| DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる
-}
type Location
    = Home
    | User UserId
    | Project ProjectId


{-| ユーザーが公開している情報
-}
type alias UserPublic =
    { name : String, imageHash : FileHash, introduction : String, createdAt : DateTime, likedProjectIdList : List ProjectId, developedProjectIdList : List ProjectId, commentedIdeaIdList : List IdeaId }


{-| プロジェクト
-}
type alias Project =
    { name : String, icon : FileHash, image : FileHash, releaseBranchCommitHashList : List ProjectHash, developBranchCommitHashList : List ProjectHash, createdAt : DateTime }


{-| アイデア
-}
type alias Idea =
    { name : String, createdAt : DateTime, commentList : List IdeaComment, draftCommitIdList : List ProjectSnapshot }


{-| アイデアのコメント
-}
type IdeaComment
    = CommentByMessage IdeaCommentMessage
    | CommentByCommit ProjectSnapshot


{-| 文章でのコメント
-}
type alias IdeaCommentMessage =
    { body : String, createdBy : UserId, createdAt : DateTime }


{-| プロジェクトのスナップショット. Gitでいうコミット
-}
type alias ProjectSnapshot =
    { createdAt : DateTime, description : String, projectName : String, projectIcon : FileHash, projectImage : FileHash, projectDescription : String, moduleList : List ModuleHash, typeList : List TypeSnapshot, partList : List PartSnapshot }


{-| モジュールのスナップショット
-}
type alias ModuleSnapshot =
    { name : String, description : String, export : Bool, children : List ModuleHash, typeList : List TypeSnapshot, partList : List PartSnapshot }


{-| 型のスナップショット
-}
type alias TypeSnapshot =
    { name : String, parentList : List PartHash, description : String }


{-| パーツのスナップショット
-}
type alias PartSnapshot =
    { name : String, parentList : List PartHash, description : String }


type AccessToken
    = AccessToken String


type UserId
    = UserId String


type ProjectId
    = ProjectId String


type IdeaId
    = IdeaId String


type FileHash
    = FileHash String


type ProjectHash
    = ProjectHash String


type ModuleHash
    = ModuleHash String


type TypeHash
    = TypeHash String


type PartHash
    = PartHash String


maybeToJsonValue : (a -> Je.Value) -> Maybe a -> Je.Value
maybeToJsonValue toJsonValueFunction maybe =
    case maybe of
        Just value ->
            Je.object [ ( "_", Je.string "Just" ), ( "value", toJsonValueFunction value ) ]

        Nothing ->
            Je.object [ ( "_", Je.string "Nothing" ) ]


resultToJsonValue : (ok -> Je.Value) -> (error -> Je.Value) -> Result error ok -> Je.Value
resultToJsonValue okToJsonValueFunction errorToJsonValueFunction result =
    case result of
        Ok value ->
            Je.object [ ( "_", Je.string "Ok" ), ( "ok", okToJsonValueFunction value ) ]

        Err value ->
            Je.object [ ( "_", Je.string "Error" ), ( "error", errorToJsonValueFunction value ) ]


accessTokenToJsonValue : AccessToken -> Je.Value
accessTokenToJsonValue (AccessToken string) =
    Je.string string


userIdToJsonValue : UserId -> Je.Value
userIdToJsonValue (UserId string) =
    Je.string string


projectIdToJsonValue : ProjectId -> Je.Value
projectIdToJsonValue (ProjectId string) =
    Je.string string


ideaIdToJsonValue : IdeaId -> Je.Value
ideaIdToJsonValue (IdeaId string) =
    Je.string string


fileHashToJsonValue : FileHash -> Je.Value
fileHashToJsonValue (FileHash string) =
    Je.string string


projectHashToJsonValue : ProjectHash -> Je.Value
projectHashToJsonValue (ProjectHash string) =
    Je.string string


moduleHashToJsonValue : ModuleHash -> Je.Value
moduleHashToJsonValue (ModuleHash string) =
    Je.string string


typeHashToJsonValue : TypeHash -> Je.Value
typeHashToJsonValue (TypeHash string) =
    Je.string string


partHashToJsonValue : PartHash -> Je.Value
partHashToJsonValue (PartHash string) =
    Je.string string


{-| DateTimeのJSONへのエンコーダ
-}
dateTimeToJsonValue : DateTime -> Je.Value
dateTimeToJsonValue dateTime =
    Je.object
        [ ( "year", Je.int dateTime.year )
        , ( "month", Je.int dateTime.month )
        , ( "day", Je.int dateTime.day )
        , ( "hour", Je.int dateTime.hour )
        , ( "minute", Je.int dateTime.minute )
        , ( "second", Je.int dateTime.second )
        ]


{-| ClientModeのJSONへのエンコーダ
-}
clientModeToJsonValue : ClientMode -> Je.Value
clientModeToJsonValue clientMode =
    case clientMode of
        DebugMode parameter ->
            Je.object [ ( "_", Je.string "DebugMode" ), ( "int32", Je.int parameter ) ]

        Release ->
            Je.object [ ( "_", Je.string "Release" ) ]


{-| RequestLogInUrlRequestDataのJSONへのエンコーダ
-}
requestLogInUrlRequestDataToJsonValue : RequestLogInUrlRequestData -> Je.Value
requestLogInUrlRequestDataToJsonValue requestLogInUrlRequestData =
    Je.object
        [ ( "openIdConnectProvider", openIdConnectProviderToJsonValue requestLogInUrlRequestData.openIdConnectProvider )
        , ( "urlData", urlDataToJsonValue requestLogInUrlRequestData.urlData )
        ]


{-| OpenIdConnectProviderのJSONへのエンコーダ
-}
openIdConnectProviderToJsonValue : OpenIdConnectProvider -> Je.Value
openIdConnectProviderToJsonValue openIdConnectProvider =
    case openIdConnectProvider of
        Google ->
            Je.string "Google"

        GitHub ->
            Je.string "GitHub"


{-| UrlDataのJSONへのエンコーダ
-}
urlDataToJsonValue : UrlData -> Je.Value
urlDataToJsonValue urlData =
    Je.object
        [ ( "clientMode", clientModeToJsonValue urlData.clientMode )
        , ( "location", locationToJsonValue urlData.location )
        , ( "language", languageToJsonValue urlData.language )
        , ( "accessToken", maybeToJsonValue accessTokenToJsonValue urlData.accessToken )
        ]


{-| LanguageのJSONへのエンコーダ
-}
languageToJsonValue : Language -> Je.Value
languageToJsonValue language =
    case language of
        Japanese ->
            Je.string "Japanese"

        English ->
            Je.string "English"

        Esperanto ->
            Je.string "Esperanto"


{-| LocationのJSONへのエンコーダ
-}
locationToJsonValue : Location -> Je.Value
locationToJsonValue location =
    case location of
        Home ->
            Je.object [ ( "_", Je.string "Home" ) ]

        User parameter ->
            Je.object [ ( "_", Je.string "User" ), ( "userId", userIdToJsonValue parameter ) ]

        Project parameter ->
            Je.object [ ( "_", Je.string "Project" ), ( "projectId", projectIdToJsonValue parameter ) ]


{-| UserPublicのJSONへのエンコーダ
-}
userPublicToJsonValue : UserPublic -> Je.Value
userPublicToJsonValue userPublic =
    Je.object
        [ ( "name", Je.string userPublic.name )
        , ( "imageHash", fileHashToJsonValue userPublic.imageHash )
        , ( "introduction", Je.string userPublic.introduction )
        , ( "createdAt", dateTimeToJsonValue userPublic.createdAt )
        , ( "likedProjectIdList", Je.list projectIdToJsonValue userPublic.likedProjectIdList )
        , ( "developedProjectIdList", Je.list projectIdToJsonValue userPublic.developedProjectIdList )
        , ( "commentedIdeaIdList", Je.list ideaIdToJsonValue userPublic.commentedIdeaIdList )
        ]


{-| ProjectのJSONへのエンコーダ
-}
projectToJsonValue : Project -> Je.Value
projectToJsonValue project =
    Je.object
        [ ( "name", Je.string project.name )
        , ( "icon", fileHashToJsonValue project.icon )
        , ( "image", fileHashToJsonValue project.image )
        , ( "releaseBranchCommitHashList", Je.list projectHashToJsonValue project.releaseBranchCommitHashList )
        , ( "developBranchCommitHashList", Je.list projectHashToJsonValue project.developBranchCommitHashList )
        , ( "createdAt", dateTimeToJsonValue project.createdAt )
        ]


{-| IdeaのJSONへのエンコーダ
-}
ideaToJsonValue : Idea -> Je.Value
ideaToJsonValue idea =
    Je.object
        [ ( "name", Je.string idea.name )
        , ( "createdAt", dateTimeToJsonValue idea.createdAt )
        , ( "commentList", Je.list ideaCommentToJsonValue idea.commentList )
        , ( "draftCommitIdList", Je.list projectSnapshotToJsonValue idea.draftCommitIdList )
        ]


{-| IdeaCommentのJSONへのエンコーダ
-}
ideaCommentToJsonValue : IdeaComment -> Je.Value
ideaCommentToJsonValue ideaComment =
    case ideaComment of
        CommentByMessage parameter ->
            Je.object [ ( "_", Je.string "CommentByMessage" ), ( "ideaCommentMessage", ideaCommentMessageToJsonValue parameter ) ]

        CommentByCommit parameter ->
            Je.object [ ( "_", Je.string "CommentByCommit" ), ( "projectSnapshot", projectSnapshotToJsonValue parameter ) ]


{-| IdeaCommentMessageのJSONへのエンコーダ
-}
ideaCommentMessageToJsonValue : IdeaCommentMessage -> Je.Value
ideaCommentMessageToJsonValue ideaCommentMessage =
    Je.object
        [ ( "body", Je.string ideaCommentMessage.body )
        , ( "createdBy", userIdToJsonValue ideaCommentMessage.createdBy )
        , ( "createdAt", dateTimeToJsonValue ideaCommentMessage.createdAt )
        ]


{-| ProjectSnapshotのJSONへのエンコーダ
-}
projectSnapshotToJsonValue : ProjectSnapshot -> Je.Value
projectSnapshotToJsonValue projectSnapshot =
    Je.object
        [ ( "createdAt", dateTimeToJsonValue projectSnapshot.createdAt )
        , ( "description", Je.string projectSnapshot.description )
        , ( "projectName", Je.string projectSnapshot.projectName )
        , ( "projectIcon", fileHashToJsonValue projectSnapshot.projectIcon )
        , ( "projectImage", fileHashToJsonValue projectSnapshot.projectImage )
        , ( "projectDescription", Je.string projectSnapshot.projectDescription )
        , ( "moduleList", Je.list moduleHashToJsonValue projectSnapshot.moduleList )
        , ( "typeList", Je.list typeSnapshotToJsonValue projectSnapshot.typeList )
        , ( "partList", Je.list partSnapshotToJsonValue projectSnapshot.partList )
        ]


{-| ModuleSnapshotのJSONへのエンコーダ
-}
moduleSnapshotToJsonValue : ModuleSnapshot -> Je.Value
moduleSnapshotToJsonValue moduleSnapshot =
    Je.object
        [ ( "name", Je.string moduleSnapshot.name )
        , ( "description", Je.string moduleSnapshot.description )
        , ( "export", Je.bool moduleSnapshot.export )
        , ( "children", Je.list moduleHashToJsonValue moduleSnapshot.children )
        , ( "typeList", Je.list typeSnapshotToJsonValue moduleSnapshot.typeList )
        , ( "partList", Je.list partSnapshotToJsonValue moduleSnapshot.partList )
        ]


{-| TypeSnapshotのJSONへのエンコーダ
-}
typeSnapshotToJsonValue : TypeSnapshot -> Je.Value
typeSnapshotToJsonValue typeSnapshot =
    Je.object
        [ ( "name", Je.string typeSnapshot.name )
        , ( "parentList", Je.list partHashToJsonValue typeSnapshot.parentList )
        , ( "description", Je.string typeSnapshot.description )
        ]


{-| PartSnapshotのJSONへのエンコーダ
-}
partSnapshotToJsonValue : PartSnapshot -> Je.Value
partSnapshotToJsonValue partSnapshot =
    Je.object
        [ ( "name", Je.string partSnapshot.name )
        , ( "parentList", Je.list partHashToJsonValue partSnapshot.parentList )
        , ( "description", Je.string partSnapshot.description )
        ]


maybeJsonDecoder : Jd.Decoder a -> Jd.Decoder (Maybe a)
maybeJsonDecoder decoder =
    Jd.field "_" Jd.string
        |> Jd.andThen
            (\tag ->
                case tag of
                    "Just" ->
                        Jd.field "value" decoder |> Jd.map Just

                    "Nothing" ->
                        Jd.succeed Nothing

                    _ ->
                        Jd.fail "maybeのtagの指定が間違っていた"
            )


resultJsonDecoder : Jd.Decoder ok -> Jd.Decoder error -> Jd.Decoder (Result error ok)
resultJsonDecoder okDecoder errorDecoder =
    Jd.field "_" Jd.string
        |> Jd.andThen
            (\tag ->
                case tag of
                    "Ok" ->
                        Jd.field "ok" okDecoder |> Jd.map Ok

                    "Error" ->
                        Jd.field "error" errorDecoder |> Jd.map Err

                    _ ->
                        Jd.fail "resultのtagの指定が間違っていた"
            )


accessTokenJsonDecoder : Jd.Decoder AccessToken
accessTokenJsonDecoder =
    Jd.map AccessToken Jd.string


userIdJsonDecoder : Jd.Decoder UserId
userIdJsonDecoder =
    Jd.map UserId Jd.string


projectIdJsonDecoder : Jd.Decoder ProjectId
projectIdJsonDecoder =
    Jd.map ProjectId Jd.string


ideaIdJsonDecoder : Jd.Decoder IdeaId
ideaIdJsonDecoder =
    Jd.map IdeaId Jd.string


fileHashJsonDecoder : Jd.Decoder FileHash
fileHashJsonDecoder =
    Jd.map FileHash Jd.string


projectHashJsonDecoder : Jd.Decoder ProjectHash
projectHashJsonDecoder =
    Jd.map ProjectHash Jd.string


moduleHashJsonDecoder : Jd.Decoder ModuleHash
moduleHashJsonDecoder =
    Jd.map ModuleHash Jd.string


typeHashJsonDecoder : Jd.Decoder TypeHash
typeHashJsonDecoder =
    Jd.map TypeHash Jd.string


partHashJsonDecoder : Jd.Decoder PartHash
partHashJsonDecoder =
    Jd.map PartHash Jd.string


{-| DateTimeのJSON Decoder
-}
dateTimeJsonDecoder : Jd.Decoder DateTime
dateTimeJsonDecoder =
    Jd.succeed
        (\year month day hour minute second ->
            { year = year
            , month = month
            , day = day
            , hour = hour
            , minute = minute
            , second = second
            }
        )
        |> Jdp.required "year" Jd.int
        |> Jdp.required "month" Jd.int
        |> Jdp.required "day" Jd.int
        |> Jdp.required "hour" Jd.int
        |> Jdp.required "minute" Jd.int
        |> Jdp.required "second" Jd.int


{-| ClientModeのJSON Decoder
-}
clientModeJsonDecoder : Jd.Decoder ClientMode
clientModeJsonDecoder =
    Jd.field "_" Jd.string
        |> Jd.andThen
            (\tag ->
                case tag of
                    "DebugMode" ->
                        Jd.field "int32" Jd.int |> Jd.map DebugMode

                    "Release" ->
                        Jd.succeed Release

                    _ ->
                        Jd.fail ("ClientModeで不明なタグを受けたとった tag=" ++ tag)
            )


{-| RequestLogInUrlRequestDataのJSON Decoder
-}
requestLogInUrlRequestDataJsonDecoder : Jd.Decoder RequestLogInUrlRequestData
requestLogInUrlRequestDataJsonDecoder =
    Jd.succeed
        (\openIdConnectProvider urlData ->
            { openIdConnectProvider = openIdConnectProvider
            , urlData = urlData
            }
        )
        |> Jdp.required "openIdConnectProvider" openIdConnectProviderJsonDecoder
        |> Jdp.required "urlData" urlDataJsonDecoder


{-| OpenIdConnectProviderのJSON Decoder
-}
openIdConnectProviderJsonDecoder : Jd.Decoder OpenIdConnectProvider
openIdConnectProviderJsonDecoder =
    Jd.string
        |> Jd.andThen
            (\tag ->
                case tag of
                    "Google" ->
                        Jd.succeed Google

                    "GitHub" ->
                        Jd.succeed GitHub

                    _ ->
                        Jd.fail ("OpenIdConnectProviderで不明なタグを受けたとった tag=" ++ tag)
            )


{-| UrlDataのJSON Decoder
-}
urlDataJsonDecoder : Jd.Decoder UrlData
urlDataJsonDecoder =
    Jd.succeed
        (\clientMode location language accessToken ->
            { clientMode = clientMode
            , location = location
            , language = language
            , accessToken = accessToken
            }
        )
        |> Jdp.required "clientMode" clientModeJsonDecoder
        |> Jdp.required "location" locationJsonDecoder
        |> Jdp.required "language" languageJsonDecoder
        |> Jdp.required "accessToken" (maybeJsonDecoder accessTokenJsonDecoder)


{-| LanguageのJSON Decoder
-}
languageJsonDecoder : Jd.Decoder Language
languageJsonDecoder =
    Jd.string
        |> Jd.andThen
            (\tag ->
                case tag of
                    "Japanese" ->
                        Jd.succeed Japanese

                    "English" ->
                        Jd.succeed English

                    "Esperanto" ->
                        Jd.succeed Esperanto

                    _ ->
                        Jd.fail ("Languageで不明なタグを受けたとった tag=" ++ tag)
            )


{-| LocationのJSON Decoder
-}
locationJsonDecoder : Jd.Decoder Location
locationJsonDecoder =
    Jd.field "_" Jd.string
        |> Jd.andThen
            (\tag ->
                case tag of
                    "Home" ->
                        Jd.succeed Home

                    "User" ->
                        Jd.field "userId" userIdJsonDecoder |> Jd.map User

                    "Project" ->
                        Jd.field "projectId" projectIdJsonDecoder |> Jd.map Project

                    _ ->
                        Jd.fail ("Locationで不明なタグを受けたとった tag=" ++ tag)
            )


{-| UserPublicのJSON Decoder
-}
userPublicJsonDecoder : Jd.Decoder UserPublic
userPublicJsonDecoder =
    Jd.succeed
        (\name imageHash introduction createdAt likedProjectIdList developedProjectIdList commentedIdeaIdList ->
            { name = name
            , imageHash = imageHash
            , introduction = introduction
            , createdAt = createdAt
            , likedProjectIdList = likedProjectIdList
            , developedProjectIdList = developedProjectIdList
            , commentedIdeaIdList = commentedIdeaIdList
            }
        )
        |> Jdp.required "name" Jd.string
        |> Jdp.required "imageHash" fileHashJsonDecoder
        |> Jdp.required "introduction" Jd.string
        |> Jdp.required "createdAt" dateTimeJsonDecoder
        |> Jdp.required "likedProjectIdList" (Jd.list projectIdJsonDecoder)
        |> Jdp.required "developedProjectIdList" (Jd.list projectIdJsonDecoder)
        |> Jdp.required "commentedIdeaIdList" (Jd.list ideaIdJsonDecoder)


{-| ProjectのJSON Decoder
-}
projectJsonDecoder : Jd.Decoder Project
projectJsonDecoder =
    Jd.succeed
        (\name icon image releaseBranchCommitHashList developBranchCommitHashList createdAt ->
            { name = name
            , icon = icon
            , image = image
            , releaseBranchCommitHashList = releaseBranchCommitHashList
            , developBranchCommitHashList = developBranchCommitHashList
            , createdAt = createdAt
            }
        )
        |> Jdp.required "name" Jd.string
        |> Jdp.required "icon" fileHashJsonDecoder
        |> Jdp.required "image" fileHashJsonDecoder
        |> Jdp.required "releaseBranchCommitHashList" (Jd.list projectHashJsonDecoder)
        |> Jdp.required "developBranchCommitHashList" (Jd.list projectHashJsonDecoder)
        |> Jdp.required "createdAt" dateTimeJsonDecoder


{-| IdeaのJSON Decoder
-}
ideaJsonDecoder : Jd.Decoder Idea
ideaJsonDecoder =
    Jd.succeed
        (\name createdAt commentList draftCommitIdList ->
            { name = name
            , createdAt = createdAt
            , commentList = commentList
            , draftCommitIdList = draftCommitIdList
            }
        )
        |> Jdp.required "name" Jd.string
        |> Jdp.required "createdAt" dateTimeJsonDecoder
        |> Jdp.required "commentList" (Jd.list ideaCommentJsonDecoder)
        |> Jdp.required "draftCommitIdList" (Jd.list projectSnapshotJsonDecoder)


{-| IdeaCommentのJSON Decoder
-}
ideaCommentJsonDecoder : Jd.Decoder IdeaComment
ideaCommentJsonDecoder =
    Jd.field "_" Jd.string
        |> Jd.andThen
            (\tag ->
                case tag of
                    "CommentByMessage" ->
                        Jd.field "ideaCommentMessage" ideaCommentMessageJsonDecoder |> Jd.map CommentByMessage

                    "CommentByCommit" ->
                        Jd.field "projectSnapshot" projectSnapshotJsonDecoder |> Jd.map CommentByCommit

                    _ ->
                        Jd.fail ("IdeaCommentで不明なタグを受けたとった tag=" ++ tag)
            )


{-| IdeaCommentMessageのJSON Decoder
-}
ideaCommentMessageJsonDecoder : Jd.Decoder IdeaCommentMessage
ideaCommentMessageJsonDecoder =
    Jd.succeed
        (\body createdBy createdAt ->
            { body = body
            , createdBy = createdBy
            , createdAt = createdAt
            }
        )
        |> Jdp.required "body" Jd.string
        |> Jdp.required "createdBy" userIdJsonDecoder
        |> Jdp.required "createdAt" dateTimeJsonDecoder


{-| ProjectSnapshotのJSON Decoder
-}
projectSnapshotJsonDecoder : Jd.Decoder ProjectSnapshot
projectSnapshotJsonDecoder =
    Jd.succeed
        (\createdAt description projectName projectIcon projectImage projectDescription moduleList typeList partList ->
            { createdAt = createdAt
            , description = description
            , projectName = projectName
            , projectIcon = projectIcon
            , projectImage = projectImage
            , projectDescription = projectDescription
            , moduleList = moduleList
            , typeList = typeList
            , partList = partList
            }
        )
        |> Jdp.required "createdAt" dateTimeJsonDecoder
        |> Jdp.required "description" Jd.string
        |> Jdp.required "projectName" Jd.string
        |> Jdp.required "projectIcon" fileHashJsonDecoder
        |> Jdp.required "projectImage" fileHashJsonDecoder
        |> Jdp.required "projectDescription" Jd.string
        |> Jdp.required "moduleList" (Jd.list moduleHashJsonDecoder)
        |> Jdp.required "typeList" (Jd.list typeSnapshotJsonDecoder)
        |> Jdp.required "partList" (Jd.list partSnapshotJsonDecoder)


{-| ModuleSnapshotのJSON Decoder
-}
moduleSnapshotJsonDecoder : Jd.Decoder ModuleSnapshot
moduleSnapshotJsonDecoder =
    Jd.succeed
        (\name description export children typeList partList ->
            { name = name
            , description = description
            , export = export
            , children = children
            , typeList = typeList
            , partList = partList
            }
        )
        |> Jdp.required "name" Jd.string
        |> Jdp.required "description" Jd.string
        |> Jdp.required "export" Jd.bool
        |> Jdp.required "children" (Jd.list moduleHashJsonDecoder)
        |> Jdp.required "typeList" (Jd.list typeSnapshotJsonDecoder)
        |> Jdp.required "partList" (Jd.list partSnapshotJsonDecoder)


{-| TypeSnapshotのJSON Decoder
-}
typeSnapshotJsonDecoder : Jd.Decoder TypeSnapshot
typeSnapshotJsonDecoder =
    Jd.succeed
        (\name parentList description ->
            { name = name
            , parentList = parentList
            , description = description
            }
        )
        |> Jdp.required "name" Jd.string
        |> Jdp.required "parentList" (Jd.list partHashJsonDecoder)
        |> Jdp.required "description" Jd.string


{-| PartSnapshotのJSON Decoder
-}
partSnapshotJsonDecoder : Jd.Decoder PartSnapshot
partSnapshotJsonDecoder =
    Jd.succeed
        (\name parentList description ->
            { name = name
            , parentList = parentList
            , description = description
            }
        )
        |> Jdp.required "name" Jd.string
        |> Jdp.required "parentList" (Jd.list partHashJsonDecoder)
        |> Jdp.required "description" Jd.string
