import * as data from "../source/data";
import * as main from "../source/main";
import * as util from "../source/util";

const codecEqual = <T>(value: T, codec: data.Codec<T>): void => {
  expect(value).toEqual<T>(
    codec.decode(0, new Uint8Array(codec.encode(value))).result
  );
};

describe("test", () => {
  it("https://definy.app/ is Home in English", () => {
    expect(
      main.urlDataAndAccessTokenFromUrl(new URL("https://definy.app/")).urlData
    ).toEqual<data.UrlData>({
      clientMode: "Release",
      location: data.Location.Home,
      language: "English",
    });
  });
  it("project url", () => {
    expect(
      main.urlDataAndAccessTokenFromUrl(
        new URL(
          "https://definy.app/project/580d8d6a54cf43e4452a0bba6694a4ed?hl=ja"
        )
      ).urlData
    ).toEqual<data.UrlData>({
      clientMode: "Release",
      location: data.Location.Project(
        "580d8d6a54cf43e4452a0bba6694a4ed" as data.ProjectId
      ),
      language: "Japanese",
    });
  });
  it("local host", () => {
    const url = new URL(
      "http://localhost:2520/user/580d8d6a54cf43e4452a0bba6694a4ed?hl=eo#access-token=f81919b78537257302b50f776b77a90b984cc3d75fa899f9f460ff972dcc8cb0"
    );
    expect(main.urlDataAndAccessTokenFromUrl(url).urlData).toEqual<
      data.UrlData
    >({
      clientMode: "DebugMode",
      location: data.Location.User(
        "580d8d6a54cf43e4452a0bba6694a4ed" as data.UserId
      ),
      language: "Esperanto",
    });
  });
  it("accessToken", () => {
    const url = new URL(
      "http://localhost:2520/user/580d8d6a54cf43e4452a0bba6694a4ed?hl=eo#access-token=f81919b78537257302b50f776b77a90b984cc3d75fa899f9f460ff972dcc8cb0"
    );
    expect(main.urlDataAndAccessTokenFromUrl(url).accessToken).toEqual<
      data.Maybe<data.AccessToken>
    >(
      data.Maybe.Just(
        "f81919b78537257302b50f776b77a90b984cc3d75fa899f9f460ff972dcc8cb0" as data.AccessToken
      )
    );
  });
  it("encode, decode user url", () => {
    const languageAndLocation: data.UrlData = {
      clientMode: "DebugMode",
      location: data.Location.User(
        "580d8d6a54cf43e4452a0bba6694a4ed" as data.UserId
      ),
      language: "Esperanto",
    };
    const url = main.urlDataAndAccessTokenToUrl(
      languageAndLocation,
      data.Maybe.Nothing()
    );
    const decodedLanguageAndLocation: data.UrlData = main.urlDataAndAccessTokenFromUrl(
      url
    ).urlData;
    expect(languageAndLocation).toEqual(decodedLanguageAndLocation);
  });
  it("dateTime and js Date conversion", () => {
    const sampleDateTime: data.Time = util.timeFromDate(
      new Date(2015, 3, 21, 14, 46, 3, 1234)
    );
    expect(sampleDateTime).toEqual(
      util.timeFromDate(util.timeToDate(sampleDateTime))
    );
  });
  it("stringToTypePartName", () => {
    expect(util.stringToTypePartName("Definy is web  app! for.web::App")).toBe(
      "definyIsWebAppForWebApp"
    );
  });
  it("dynamic Evaluation: simple expr", () => {
    /*
     * = (add 50) ((add 32) 100)
     */
    const result = main.evaluateSuggestionExpr(
      {
        typePartMap: new Map(),
        partMap: new Map(),
        evaluatedPartMap: new Map(),
        evaluatedSuggestionPartMap: new Map(),
      },
      data.Expr.FunctionCall({
        function: data.Expr.FunctionCall({
          function: data.Expr.Kernel("Int32Add"),
          parameter: data.Expr.Int32Literal(50),
        }),
        parameter: data.Expr.FunctionCall({
          function: data.Expr.FunctionCall({
            function: data.Expr.Kernel("Int32Add"),
            parameter: data.Expr.Int32Literal(32),
          }),
          parameter: data.Expr.Int32Literal(100),
        }),
      })
    );
    expect(result).toEqual<
      data.Result<data.EvaluatedExpr, ReadonlyArray<data.EvaluateExprError>>
    >(data.Result.Ok(data.EvaluatedExpr.Int32(182)));
  });

  it("dynamic Evaluation: use part definition", () => {
    /*
     * [0]
     * one = 1
     *
     * [1]
     * addOneHundred = + 100
     *
     *
     * = (add (addOneHundred one)) one
     */
    const intType: data.Type = {
      typePartId: "int" as data.TypePartId,
      parameter: [],
    };
    const oneName = "0" as data.PartId;
    const addOneHundredName = "1" as data.PartId;
    const result = main.evaluateSuggestionExpr(
      {
        typePartMap: new Map(),
        partMap: new Map<data.PartId, data.Part>([
          [
            oneName,
            {
              name: "one",
              description: "1を表す",
              type: intType,
              expr: data.Expr.Int32Literal(1),
              createCommitId: "oneCreateCommitId" as data.CommitId,
              projectId: "sampleProject" as data.ProjectId,
            },
          ],
          [
            addOneHundredName,
            {
              name: "addOneHundred",
              description: "100を足す関数",
              type: intType,
              expr: data.Expr.FunctionCall({
                function: data.Expr.Kernel("Int32Add"),
                parameter: data.Expr.Int32Literal(100),
              }),
              createCommitId: "addOneHundredCreateCommitId" as data.CommitId,
              projectId: "sampleProject" as data.ProjectId,
            },
          ],
        ]),
        evaluatedSuggestionPartMap: new Map(),
        evaluatedPartMap: new Map(),
      },
      data.Expr.FunctionCall({
        function: data.Expr.FunctionCall({
          function: data.Expr.Kernel("Int32Add"),
          parameter: data.Expr.FunctionCall({
            function: data.Expr.PartReference(addOneHundredName),
            parameter: data.Expr.PartReference(oneName),
          }),
        }),
        parameter: data.Expr.PartReference(oneName),
      })
    );
    expect(result).toEqual<
      data.Result<data.EvaluatedExpr, ReadonlyArray<data.EvaluateExprError>>
    >(data.Result.Ok(data.EvaluatedExpr.Int32(102)));
  });

  it("util lower case", () => {
    expect(util.isFirstLowerCaseName("value")).toEqual(true);
  });

  it("int32 codec", () => {
    codecEqual(123, data.Int32.codec);
  });

  it("int32 min codec", () => {
    codecEqual(-(2 ** 31), data.Int32.codec);
  });

  it("boolean true codec", () => {
    codecEqual(true, data.Bool.codec);
  });

  it("boolean false codec", () => {
    codecEqual(false, data.Bool.codec);
  });

  it("string ascii codec", () => {
    codecEqual("sample text", data.String.codec);
  });

  it("strong japanese emoji codec", () => {
    codecEqual("やったぜ😀👨‍👩‍👧‍👦", data.String.codec);
  });

  it("maybe string codec", () => {
    codecEqual(data.Maybe.Just("それな"), data.Maybe.codec(data.String.codec));
  });

  it("list number codec", () => {
    codecEqual(
      [1, 43, 6423, 334, 663, 0, 74, -1, -29031, 2 ** 31 - 1],
      data.List.codec(data.Int32.codec)
    );
  });

  it("token codec", () => {
    codecEqual(
      "24b6b3789d903e841490ac04ffc2b6f9848ea529b2d9db380d190583b09995e6" as data.AccessToken,
      data.AccessToken.codec
    );
  });

  it("id codec", () => {
    codecEqual(
      "756200c85a0ff28f08daa2d201d616a9" as data.UserId,
      data.UserId.codec
    );
  });

  it("user codec", () => {
    codecEqual(
      {
        name: "ナルミンチョ",
        createTime: { day: 18440, millisecond: 12000 },
        imageHash: "0a8eed336ca61252c13da0ff0b82ce37e81b84622a4052ab33693c434b4f6434" as data.ImageToken,
        introduction: "ナルミンチョはDefinyを作っている人です.",
      },
      data.User.codec
    );
  });

  it("Maybe (IdAndData UserId User) codec", () => {
    codecEqual<data.Maybe<data.IdAndData<data.UserId, data.User>>>(
      data.Maybe.Just({
        id: "933055412132d6aa46f8dde7159ecb38" as data.UserId,
        data: {
          name: "ナルミンチョ",
          createTime: { day: 18440, millisecond: 12000 },
          imageHash: "0a8eed336ca61252c13da0ff0b82ce37e81b84622a4052ab33693c434b4f6434" as data.ImageToken,
          introduction: "ナルミンチョはDefinyを作っている人です.",
        },
      }),
      data.Maybe.codec(data.IdAndData.codec(data.UserId.codec, data.User.codec))
    );
  });
});
