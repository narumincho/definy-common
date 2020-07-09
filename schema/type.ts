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
