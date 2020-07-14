import * as data from "../source/data";
import * as id from "./typePartId";

export const Int32: data.Type = { typePartId: id.Int32, parameter: [] };
export const Binary: data.Type = { typePartId: id.Binary, parameter: [] };
export const Bool: data.Type = { typePartId: id.Bool, parameter: [] };
export const List = (element: data.Type): data.Type => ({
  typePartId: id.List,
  parameter: [element],
});
export const Maybe = (value: data.Type): data.Type => ({
  typePartId: id.Maybe,
  parameter: [value],
});
export const Result = (ok: data.Type, error: data.Type): data.Type => ({
  typePartId: id.Result,
  parameter: [ok, error],
});
export const String: data.Type = { typePartId: id.String, parameter: [] };

export const Time: data.Type = { typePartId: id.Time, parameter: [] };

export const RequestLogInUrlRequestData: data.Type = {
  typePartId: id.RequestLogInUrlRequestData,
  parameter: [],
};

export const OpenIdConnectProvider: data.Type = {
  typePartId: id.OpenIdConnectProvider,
  parameter: [],
};

export const UrlData: data.Type = {
  typePartId: id.UrlData,
  parameter: [],
};

export const ClientMode: data.Type = {
  typePartId: id.ClientMode,
  parameter: [],
};

export const Location: data.Type = {
  typePartId: id.Location,
  parameter: [],
};

export const Language: data.Type = {
  typePartId: id.Language,
  parameter: [],
};

export const User: data.Type = {
  typePartId: id.User,
  parameter: [],
};

export const IdAndData = (
  idType: data.Type,
  dataType: data.Type
): data.Type => ({
  typePartId: id.IdAndData,
  parameter: [idType, dataType],
});

export const Project: data.Type = {
  typePartId: id.Project,
  parameter: [],
};

export const Idea: data.Type = {
  typePartId: id.Idea,
  parameter: [],
};

export const IdeaItem: data.Type = {
  typePartId: id.IdeaItem,
  parameter: [],
};

export const IdeaItemBody: data.Type = {
  typePartId: id.IdeaItemBody,
  parameter: [],
};

export const Suggestion: data.Type = {
  typePartId: id.Suggestion,
  parameter: [],
};

export const SuggestionState: data.Type = {
  typePartId: id.SuggestionId,
  parameter: [],
};

export const Change: data.Type = {
  typePartId: id.Change,
  parameter: [],
};

export const TypePart: data.Type = {
  typePartId: id.TypePart,
  parameter: [],
};

export const TypeAttribute: data.Type = {
  typePartId: id.TypeAttribute,
  parameter: [],
};

export const TypeParameter: data.Type = {
  typePartId: id.TypeParameter,
  parameter: [],
};

export const TypePartBody: data.Type = {
  typePartId: id.TypePartBody,
  parameter: [],
};

export const Member: data.Type = {
  typePartId: id.Member,
  parameter: [],
};

export const Pattern: data.Type = {
  typePartId: id.Pattern,
  parameter: [],
};

export const TypePartBodyKernel: data.Type = {
  typePartId: id.TypePartBodyKernel,
  parameter: [],
};

export const Type: data.Type = {
  typePartId: id.Type,
  parameter: [],
};

export const ProjectId: data.Type = {
  typePartId: id.ProjectId,
  parameter: [],
};

export const UserId: data.Type = {
  typePartId: id.UserId,
  parameter: [],
};

export const IdeaId: data.Type = {
  typePartId: id.IdeaId,
  parameter: [],
};

export const SuggestionId: data.Type = {
  typePartId: id.SuggestionId,
  parameter: [],
};

export const ImageToken: data.Type = {
  typePartId: id.ImageToken,
  parameter: [],
};

export const PartId: data.Type = {
  typePartId: id.PartId,
  parameter: [],
};

export const TypePartId: data.Type = {
  typePartId: id.TypePartId,
  parameter: [],
};
