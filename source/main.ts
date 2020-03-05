import * as data from "./data";

export { data };

const origin = "https://definy.app";
/**
 * URLのパスを場所のデータに変換する
 * @param urlAsString `https://definy.app/project/580d8d6a54cf43e4452a0bba6694a4ed?hl=ja` のようなURL
 */
export const urlToLanguageAndLocation = (
  urlAsString: string
): data.Maybe<data.LanguageAndLocation> => {
  if (!urlAsString.startsWith(origin)) {
    return data.maybeNothing();
  }
  const pathAndQuery = urlAsString.substring(origin.length).split("?");
  const path = pathAndQuery[0];
  const query: string | undefined = pathAndQuery[1];
  const language: data.Language =
    query === undefined ? "English" : queryStringToLanguage(query);

  const pathList = path.split("/");
  const locationTag: string | undefined = pathList[1];
  const locationParamter: string | undefined = pathList[2];

  switch (locationTag) {
    case "user": {
      if (isIdString(locationParamter)) {
        return data.maybeJust({
          language: language,
          location: data.locationUser(locationParamter as data.UserId)
        });
      }
      return data.maybeNothing();
    }
    case "project":
      if (isIdString(locationParamter)) {
        return data.maybeJust({
          language: language,
          location: data.locationProject(locationParamter as data.ProjectId)
        });
      }
      return data.maybeNothing();
  }
  return data.maybeJust({
    language: language,
    location: data.locationHome
  });
};

const queryStringToLanguage = (query: string): data.Language => {
  const mathResult = query.match(/hl=([a-z]+)/u);
  if (mathResult === null) {
    return "English";
  }
  return languageFromIdString(mathResult[1]);
};

const languageFromIdString = (languageAsString: string): data.Language => {
  switch (languageAsString) {
    case "ja":
      return "Japanese";
    case "en":
      return "English";
    case "eo":
      return "Esperanto";
  }
  return "English";
};

const isIdString = (text: unknown): boolean => {
  if (typeof text !== "string") {
    return false;
  }
  if (text.length !== 32) {
    return false;
  }
  for (const char of text) {
    if (!"0123456789abcdef".includes(char)) {
      return false;
    }
  }
  return true;
};
