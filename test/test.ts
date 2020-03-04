import * as main from "../source/main";

describe("test", () => {
  it("home path", () => {
    expect(main.urlToLanguageAndLocation("/ja/")).toEqual<
      main.data.Maybe<main.data.LanguageAndLocation>
    >(
      main.data.maybeJust({
        language: "Japanese",
        location: main.data.locationHome
      })
    );
  });
});
