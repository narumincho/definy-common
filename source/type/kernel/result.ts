import * as util from "../../util";
import { Maybe, TypePart, TypePartBody, TypePartId } from "../../data";

export const typePartId = "943ef399d0891f897f26bc02fa24af70" as TypePartId;

const okTypePartId = "2163b3c97b382de8085973eff850c919" as TypePartId;
const errorTypePartId = "bd8be8409130f30f15c5c86c01de6dc5" as TypePartId;

export const typePart: TypePart = {
  name: "Result",
  migrationPartId: Maybe.Nothing(),
  description:
    "成功と失敗を表す型. 今後はRustのstd::Resultに出力するために属性をつける?",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [
    {
      typePartId: okTypePartId,
      name: "ok",
    },
    {
      typePartId: errorTypePartId,
      name: "error",
    },
  ],
  body: TypePartBody.Sum([
    {
      name: "Ok",
      description: "成功",
      parameter: Maybe.Just({ typePartId: okTypePartId, parameter: [] }),
    },
    {
      name: "Error",
      description: "失敗",
      parameter: Maybe.Just({ typePartId: errorTypePartId, parameter: [] }),
    },
  ]),
};
