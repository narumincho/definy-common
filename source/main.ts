import * as data from "./data";
import * as util from "./util";

export { data };
export { util };

export const releaseOrigin = "https://definy.app";

export const clientModeToOrigin = (clientMode: data.ClientMode): string => {
  switch (clientMode._) {
    case "DebugMode":
      return "http://localhost:" + clientMode.int32.toString();
    case "Release":
      return releaseOrigin;
  }
};

export const defaultLanguage: data.Language = "English";

export const urlDataToUrl = (urlData: data.UrlData): string => {
  return (
    clientModeToOrigin(urlData.clientMode) +
    locationToPath(urlData.location) +
    "?hl=" +
    languageToIdString(urlData.language) +
    util.maybeUnwrap(
      urlData.accessToken,
      accessToken => "#access-token=" + (accessToken as string),
      ""
    )
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

/**
 * URLのパスを場所のデータに変換する
 * @param url `https://definy.app/project/580d8d6a54cf43e4452a0bba6694a4ed?hl=ja` のようなURL
 */
export const urlDataFromUrl = (url: string): data.UrlData => {
  return {
    clientMode: clientModeFromUrl(url),
    location: locationFromUrl(url),
    language: queryStringToLanguage(url),
    accessToken: accessTokenFromUrl(url)
  };
};

const clientModeFromUrl = (url: string): data.ClientMode => {
  const debugOriginResult = url.match(/^http:\/\/localhost:(\d+)/u);
  if (debugOriginResult !== null) {
    return data.clientModeDebugMode(Number.parseInt(debugOriginResult[1]));
  }
  return data.clientModeRelease;
};

const locationFromUrl = (url: string): data.Location => {
  const projectResult = url.match(/\/project\/([0-9a-f]{32})/u);
  if (projectResult !== null) {
    return data.locationProject(projectResult[1] as data.ProjectId);
  }
  const userResult = url.match(/\/user\/([0-9a-f]{32})/u);
  if (userResult !== null) {
    return data.locationUser(userResult[1] as data.UserId);
  }
  return data.locationHome;
};

const queryStringToLanguage = (url: string): data.Language => {
  const mathResult = url.match(/hl=([a-z]+)/u);
  if (mathResult === null) {
    return defaultLanguage;
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
  return defaultLanguage;
};

const accessTokenFromUrl = (url: string): data.Maybe<data.AccessToken> => {
  const matchResult = url.match(/access-token=([0-9a-f]{64})/u);
  if (matchResult === null) {
    return data.maybeNothing();
  }
  return data.maybeJust(matchResult[1] as data.AccessToken);
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
