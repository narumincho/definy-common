import * as id from "./typePartId";
import { Type } from "../source/data";

export const Int32: Type = { typePartId: id.Int32, parameter: [] };
export const Binary: Type = { typePartId: id.Binary, parameter: [] };
export const Bool: Type = { typePartId: id.Bool, parameter: [] };
export const List = (element: Type): Type => ({
  typePartId: id.List,
  parameter: [element],
});
export const Maybe = (value: Type): Type => ({
  typePartId: id.Maybe,
  parameter: [value],
});
export const Result = (ok: Type, error: Type): Type => ({
  typePartId: id.Result,
  parameter: [ok, error],
});
export const String: Type = { typePartId: id.String, parameter: [] };

export const Time: Type = { typePartId: id.Time, parameter: [] };

export const RequestLogInUrlRequestData: Type = {
  typePartId: id.RequestLogInUrlRequestData,
  parameter: [],
};

export const OpenIdConnectProvider: Type = {
  typePartId: id.OpenIdConnectProvider,
  parameter: [],
};

export const UrlData: Type = {
  typePartId: id.UrlData,
  parameter: [],
};

export const ClientMode: Type = {
  typePartId: id.ClientMode,
  parameter: [],
};

export const Location: Type = {
  typePartId: id.Location,
  parameter: [],
};

export const Language: Type = {
  typePartId: id.Language,
  parameter: [],
};

export const User: Type = {
  typePartId: id.User,
  parameter: [],
};

export const ProjectId: Type = {
  typePartId: id.ProjectId,
  parameter: [],
};

export const UserId: Type = {
  typePartId: id.UserId,
  parameter: [],
};

export const IdeaId: Type = {
  typePartId: id.IdeaId,
  parameter: [],
};

export const SuggestionId: Type = {
  typePartId: id.SuggestionId,
  parameter: [],
};

export const ImageToken: Type = {
  typePartId: id.ImageToken,
  parameter: [],
};
