import * as data from "../source/data";
import * as id from "./typePartId";

const noParameterType = (typePartId: data.TypePartId): data.Type => ({
  typePartId,
  parameter: [],
});

export const Int32: data.Type = noParameterType(id.Int32);
export const Binary: data.Type = noParameterType(id.Binary);
export const Bool: data.Type = noParameterType(id.Bool);
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
export const String: data.Type = noParameterType(id.String);

export const Time: data.Type = noParameterType(id.Time);

export const RequestLogInUrlRequestData: data.Type = noParameterType(
  id.RequestLogInUrlRequestData
);

export const OpenIdConnectProvider: data.Type = noParameterType(
  id.OpenIdConnectProvider
);

export const UrlData: data.Type = noParameterType(id.UrlData);

export const ClientMode: data.Type = noParameterType(id.ClientMode);

export const Location: data.Type = noParameterType(id.Location);

export const Language: data.Type = noParameterType(id.Language);

export const User: data.Type = noParameterType(id.User);

export const IdAndData = (
  idType: data.Type,
  dataType: data.Type
): data.Type => ({
  typePartId: id.IdAndData,
  parameter: [idType, dataType],
});

export const Project: data.Type = noParameterType(id.Project);

export const Idea: data.Type = noParameterType(id.Idea);

export const IdeaItem: data.Type = noParameterType(id.IdeaItem);

export const IdeaItemBody: data.Type = noParameterType(id.IdeaItemBody);

export const Suggestion: data.Type = noParameterType(id.Suggestion);

export const SuggestionState: data.Type = noParameterType(id.SuggestionId);

export const Change: data.Type = noParameterType(id.Change);

export const TypePart: data.Type = noParameterType(id.TypePart);

export const TypeAttribute: data.Type = noParameterType(id.TypeAttribute);

export const TypeParameter: data.Type = noParameterType(id.TypeParameter);

export const TypePartBody: data.Type = noParameterType(id.TypePartBody);

export const Member: data.Type = noParameterType(id.Member);

export const Pattern: data.Type = noParameterType(id.Pattern);

export const TypePartBodyKernel: data.Type = noParameterType(
  id.TypePartBodyKernel
);

export const Type: data.Type = noParameterType(id.Type);

export const ProjectId: data.Type = noParameterType(id.ProjectId);

export const UserId: data.Type = noParameterType(id.UserId);

export const IdeaId: data.Type = noParameterType(id.IdeaId);

export const SuggestionId: data.Type = noParameterType(id.SuggestionId);

export const ImageToken: data.Type = noParameterType(id.ImageToken);

export const PartId: data.Type = noParameterType(id.PartId);

export const TypePartId: data.Type = noParameterType(id.TypePartId);
