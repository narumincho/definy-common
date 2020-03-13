import * as main from "../source/main";
import { data } from "../source/main";

describe("test", () => {
  it("https://definy.app/ is Home in English", () => {
    expect(main.urlDataFromUrl(new URL("https://definy.app/"))).toEqual<
      data.UrlData
    >({
      clientMode: data.clientModeRelease,
      location: data.locationHome,
      language: "English",
      accessToken: data.maybeNothing()
    });
  });
  it("project url", () => {
    expect(
      main.urlDataFromUrl(
        new URL(
          "https://definy.app/project/580d8d6a54cf43e4452a0bba6694a4ed?hl=ja"
        )
      )
    ).toEqual<data.UrlData>({
      clientMode: data.clientModeRelease,
      location: data.locationProject(
        "580d8d6a54cf43e4452a0bba6694a4ed" as data.ProjectId
      ),
      language: "Japanese",
      accessToken: data.maybeNothing()
    });
  });
  it("local host and accessToken", () => {
    expect(
      main.urlDataFromUrl(
        new URL(
          "http://[::1]:2520/user/580d8d6a54cf43e4452a0bba6694a4ed?hl=eo#access-token=f81919b78537257302b50f776b77a90b984cc3d75fa899f9f460ff972dcc8cb0"
        )
      )
    ).toEqual<data.UrlData>({
      clientMode: data.clientModeDebugMode(2520),
      location: data.locationUser(
        "580d8d6a54cf43e4452a0bba6694a4ed" as data.UserId
      ),
      language: "Esperanto",
      accessToken: data.maybeJust(
        "f81919b78537257302b50f776b77a90b984cc3d75fa899f9f460ff972dcc8cb0" as data.AccessToken
      )
    });
  });
  it("encode, decode user url", () => {
    const languageAndLocation: data.UrlData = {
      clientMode: data.clientModeDebugMode(123),
      location: main.data.locationUser(
        "580d8d6a54cf43e4452a0bba6694a4ed" as main.data.UserId
      ),
      language: "Esperanto",
      accessToken: data.maybeNothing()
    };
    const url = main.urlDataToUrl(languageAndLocation);
    const decodedLanguageAndLocation: data.UrlData = main.urlDataFromUrl(url);
    expect(languageAndLocation).toEqual(decodedLanguageAndLocation);
  });
});
