import * as data from "./data";

export { data };

export const origin = "https://definy.app";

export const defaultLanguageAndLocation: data.LanguageAndLocation = {
  language: "English",
  location: data.locationHome
};

export const languageAndLocationToUrl = (
  languageAndLocation: data.LanguageAndLocation
): string => {
  return (
    origin +
    locationToPath(languageAndLocation.location) +
    "?hl=" +
    languageToIdString(languageAndLocation.language)
  );
};

const locationToPath = (location: data.Location): string => {
  switch (location._) {
    case "Home":
      return "/";
    case "User":
      return "/user/" + (location.userId as string);
    case "Project":
      return "/project/" + (location.projectId as string);
  }
};

/**
 * URLのパスを場所のデータに変換する
 * @param urlAsString `https://definy.app/project/580d8d6a54cf43e4452a0bba6694a4ed?hl=ja` のようなURL
 */
export const urlToLanguageAndLocation = (
  urlAsString: string
): data.LanguageAndLocation => {
  if (!urlAsString.startsWith(origin)) {
    return defaultLanguageAndLocation;
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
        return {
          language: language,
          location: data.locationUser(locationParamter as data.UserId)
        };
      }
      return defaultLanguageAndLocation;
    }
    case "project":
      if (isIdString(locationParamter)) {
        return {
          language: language,
          location: data.locationProject(locationParamter as data.ProjectId)
        };
      }
      return defaultLanguageAndLocation;
  }
  return defaultLanguageAndLocation;
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

const languageToIdString = (language: data.Language): string => {
  switch (language) {
    case "English":
      return "en";
    case "Japanese":
      return "ja";
    case "Esperanto":
      return "eo";
  }
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
