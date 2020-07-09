import * as util from "../util";
import { Maybe, TypePart, TypePartBody, TypePartId } from "../data";

export const typePartId = "cdd7dd74dd0f2036b44dcae6aaac46f5" as TypePartId;

const valueTypePartId = "7340e6b552af43695335a64e057f4250" as TypePartId;

export const typePart: TypePart = {
  name: "Maybe",
  migrationPartId: Maybe.Nothing(),
  description:
    "Maybe. nullableのようなもの. 今後はRustのstd::Optionに出力するために属性をつける?",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [
    {
      typePartId: valueTypePartId,
      name: "value",
    },
  ],
  body: TypePartBody.Sum([
    {
      name: "Just",
      description: "値があるということ",
      parameter: Maybe.Just({ typePartId: valueTypePartId, parameter: [] }),
    },
    {
      name: "Nothing",
      description: "値がないということ",
      parameter: Maybe.Nothing(),
    },
  ]),
};
