import * as main from "../source/main";
import { data } from "../source/main";

describe("test", () => {
  it("https://definy.app/ is Home in English", () => {
    expect(
      main.urlDataAndAccessTokenFromUrl(new URL("https://definy.app/")).urlData
    ).toEqual<data.UrlData>({
      clientMode: data.clientModeRelease,
      location: data.locationHome,
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
      clientMode: data.clientModeRelease,
      location: data.locationProject(
        "580d8d6a54cf43e4452a0bba6694a4ed" as data.ProjectId
      ),
      language: "Japanese",
    });
  });
  it("local host", () => {
    const url = new URL(
      "http://[::1]:2520/user/580d8d6a54cf43e4452a0bba6694a4ed?hl=eo#access-token=f81919b78537257302b50f776b77a90b984cc3d75fa899f9f460ff972dcc8cb0"
    );
    expect(main.urlDataAndAccessTokenFromUrl(url).urlData).toEqual<
      data.UrlData
    >({
      clientMode: data.clientModeDebugMode(2520),
      location: data.locationUser(
        "580d8d6a54cf43e4452a0bba6694a4ed" as data.UserId
      ),
      language: "Esperanto",
    });
  });
  it("accessToken", () => {
    const url = new URL(
      "http://[::1]:2520/user/580d8d6a54cf43e4452a0bba6694a4ed?hl=eo#access-token=f81919b78537257302b50f776b77a90b984cc3d75fa899f9f460ff972dcc8cb0"
    );
    expect(main.urlDataAndAccessTokenFromUrl(url).accessToken).toEqual<
      data.Maybe<data.AccessToken>
    >(
      data.maybeJust(
        "f81919b78537257302b50f776b77a90b984cc3d75fa899f9f460ff972dcc8cb0" as data.AccessToken
      )
    );
  });
  it("encode, decode user url", () => {
    const languageAndLocation: data.UrlData = {
      clientMode: data.clientModeDebugMode(123),
      location: data.locationUser(
        "580d8d6a54cf43e4452a0bba6694a4ed" as data.UserId
      ),
      language: "Esperanto",
    };
    const url = main.urlDataAndAccessTokenToUrl(
      languageAndLocation,
      data.maybeNothing()
    );
    const decodedLanguageAndLocation: data.UrlData = main.urlDataAndAccessTokenFromUrl(
      url
    ).urlData;
    expect(languageAndLocation).toEqual(decodedLanguageAndLocation);
  });
  it("dateTime and js Date conversion", () => {
    const sampleDateTime: data.Time = main.util.timeFromDate(
      new Date(2015, 3, 21, 14, 46, 3, 1234)
    );
    expect(sampleDateTime).toEqual(
      main.util.timeFromDate(main.util.timeToDate(sampleDateTime))
    );
  });
  it("dynamic Evaluation: simple expr", () => {
    /*
     * = (add 50) ((add 32) 100)
     */
    const result = main.evaluateExpr(
      {
        typeDefinitionMap: new Map(),
        partDefinitionMap: new Map(),
        localPartMap: new Map(),
        evaluatedLocalPartMap: new Map(),
        evaluatedPartMap: new Map(),
      },
      data.exprFunctionCall({
        function: data.exprFunctionCall({
          function: data.exprKernel("Int32Add"),
          parameter: data.exprInt32Literal(50),
        }),
        parameter: data.exprFunctionCall({
          function: data.exprFunctionCall({
            function: data.exprKernel("Int32Add"),
            parameter: data.exprInt32Literal(32),
          }),
          parameter: data.exprInt32Literal(100),
        }),
      })
    );
    console.log(result);
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
      reference: "" as data.TypeId,
      parameter: [],
    };
    const oneName = "0" as data.PartId;
    const addOneHundredName = "1" as data.PartId;
    const result = main.evaluateExpr(
      {
        typeDefinitionMap: new Map(),
        partDefinitionMap: new Map<data.PartId, data.PartDefinition>([
          [
            oneName,
            {
              name: "one",
              description: "1を表す",
              moduleId: "0" as data.ModuleId,
              parentList: [],
              type: intType,
              expr: data.maybeJust(data.exprInt32Literal(1)),
            },
          ],
          [
            addOneHundredName,
            {
              name: "addOneHundred",
              description: "100を足す関数",
              moduleId: "0" as data.ModuleId,
              parentList: [],
              type: intType,
              expr: data.maybeJust(
                data.exprFunctionCall({
                  function: data.exprKernel("Int32Add"),
                  parameter: data.exprInt32Literal(100),
                })
              ),
            },
          ],
        ]),
        localPartMap: new Map(),
        evaluatedLocalPartMap: new Map(),
        evaluatedPartMap: new Map(),
      },
      data.exprFunctionCall({
        function: data.exprFunctionCall({
          function: data.exprKernel("Int32Add"),
          parameter: data.exprFunctionCall({
            function: data.exprPartReference(addOneHundredName),
            parameter: data.exprPartReference(oneName),
          }),
        }),
        parameter: data.exprPartReference(oneName),
      })
    );
    console.log(result);
    expect(result.result).toEqual<
      data.Result<data.EvaluatedExpr, data.EvaluateExprError>
    >(data.resultOk(data.evaluatedExprInt32(102)));
  });
});
