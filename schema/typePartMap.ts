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
]);
