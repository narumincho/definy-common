import * as id from "./typePartId";
import * as part from "./typePart";
import { TypePart, TypePartId } from "../source/data";

export const typePartMap: ReadonlyMap<TypePartId, TypePart> = new Map<
  TypePartId,
  TypePart
>([
  [id.Int32, part.Int32],
  [id.Binary, part.Binary],
  [id.Bool, part.Bool],
  [id.List, part.List],
  [id.Maybe, part.maybe],
  [id.Result, part.Result],
  [id.String, part.String],
  [id.Time, part.Time],
  [id.RequestLogInUrlRequestData, part.RequestLogInUrlRequestData],
  [id.OpenIdConnectProvider, part.OpenIdConnectProvider],
  [id.UrlData, part.UrlData],
  [id.ClientMode, part.ClientMode],
  [id.Location, part.Location],
  [id.Language, part.Language],
  [id.ProjectId, part.ProjectId],
  [id.UserId, part.UserId],
  [id.IdeaId, part.IdeaId],
  [id.SuggestionId, part.SuggestionId],
]);
