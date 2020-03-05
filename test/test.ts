import * as main from "../source/main";

describe("test", () => {
  it("https://definy.app/ is Home in English", () => {
    expect(main.urlToLanguageAndLocation("https://definy.app/")).toEqual<
      main.data.LanguageAndLocation
    >({
      language: "English",
      location: main.data.locationHome
    });
  });
  it("project url", () => {
    expect(
      main.urlToLanguageAndLocation(
        "https://definy.app/project/580d8d6a54cf43e4452a0bba6694a4ed?hl=ja"
      )
    ).toEqual<main.data.LanguageAndLocation>({
      language: "Japanese",
      location: main.data.locationProject(
        "580d8d6a54cf43e4452a0bba6694a4ed" as main.data.ProjectId
      )
    });
  });
  it("short url", () => {
    expect(main.urlToLanguageAndLocation("https://definy.app")).toEqual<
      main.data.LanguageAndLocation
    >({
      language: "English",
      location: main.data.locationHome
    });
  });
  it("encode, decode user url", () => {
    const languageAndLocation: main.data.LanguageAndLocation = {
      language: "Esperanto",
      location: main.data.locationUser(
        "580d8d6a54cf43e4452a0bba6694a4ed" as main.data.UserId
      )
    };
    const url: string = main.languageAndLocationToUrl(languageAndLocation);
    const decodedLanguageAndLocation: main.data.LanguageAndLocation = main.urlToLanguageAndLocation(
      url
    );
    expect(languageAndLocation).toEqual(decodedLanguageAndLocation);
  });
});
