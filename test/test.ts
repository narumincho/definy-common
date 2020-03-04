import * as main from "../source/main";

describe("test", () => {
  it("home path", () => {
    expect(main.urlToLocation("/")).toEqual(
      main.data.maybeJust(main.data.locationHome)
    );
  });
});
