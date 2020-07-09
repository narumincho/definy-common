import * as util from "../util";
import {
  Maybe,
  TypeAttribute,
  TypePart,
  TypePartBody,
  TypePartId,
} from "../data";

export const typePartId = "93e91ed730b5e7689250a76096ae60a4" as TypePartId;

export const typePart: TypePart = {
  name: "Bool",
  migrationPartId: Maybe.Nothing(),
  description:
    "Bool. 真か偽. JavaScriptのbooleanで扱える. true: 1, false: 0. (1byte)としてバイナリに変換する",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Just(TypeAttribute.AsBoolean),
  typeParameterList: [],
  body: TypePartBody.Sum([
    {
      name: "True",
      description: "真",
      parameter: Maybe.Nothing(),
    },
    {
      name: "False",
      description: "偽",
      parameter: Maybe.Nothing(),
    },
  ]),
};
