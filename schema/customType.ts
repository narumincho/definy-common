import * as name from "./name";
import { Type } from "../source/type/data";

const noParamterType = (typeName: string) =>
  Type.Custom({
    name: typeName,
    parameterList: [],
  });

export const time = noParamterType(name.time);

export const idAndData = (id: Type, data: Type): Type =>
  Type.Custom({
    name: name.idAndData,
    parameterList: [id, data],
  });

export const change = noParamterType(name.change);

export const suggestionState = noParamterType(name.suggestionState);

export const suggestion = noParamterType(name.suggestion);

export const addPart = noParamterType(name.addPart);

export const suggestionType = noParamterType(name.suggestionType);

export const suggestionExpr = noParamterType(name.suggestionExpr);

export const suggestionTypeInputAndOutput = noParamterType(
  name.suggestionTypeInputAndOutput
);

export const typePartWithSuggestionTypeParameter = noParamterType(
  name.typePartWithSuggestionTypeParameter
);

export const suggestionTypePartWithSuggestionTypeParameter = noParamterType(
  name.suggestionTypePartWithSuggestionTypeParameter
);

export const kernelExpr = noParamterType(name.kernelExpr);

export const localPartReference = noParamterType(name.localPartReference);

export const TagReference = noParamterType(name.tagReference);

export const suggestionTagReference = noParamterType(
  name.suggestionTagReference
);

export const suggestionFunctionCall = noParamterType(
  name.suggestionFunctionCall
);

export const suggestionLambdaBranch = noParamterType(
  name.suggestionLambdaBranch
);

export const condition = noParamterType(name.condition);

export const suggestionBranchPartDefinition = noParamterType(
  name.suggestionBranchPartDefinition
);

export const typePartBody = noParamterType(name.typePartBody);

export const type = noParamterType(name.type);

export const part = noParamterType(name.part);

export const expr = noParamterType(name.expr);

export const member = noParamterType(name.member);

export const pattern = noParamterType(name.pattern);

export const typePartBodyKernel = noParamterType(name.typePartBodyKernel);

export const typeInputAndOutput = noParamterType(name.typeInputAndOutput);

export const typePartIdWithParameter = noParamterType(
  name.typePartIdWithParameter
);

export const functionCall = noParamterType(name.functionCall);

export const lambdaBranch = noParamterType(name.lambdaBranch);

export const kernelCall = noParamterType(name.kernelCall);

export const evaluatedExpr = noParamterType(name.evaluatedExpr);

export const branchPartDefinition = noParamterType(name.branchPartDefinition);

export const conditionTag = noParamterType(name.conditionTag);

export const conditionCapture = noParamterType(name.conditionCapture);

export const typeError = noParamterType(name.typeError);

export const user = noParamterType(name.user);

export const project = noParamterType(name.project);

export const ideaItem = noParamterType(name.ideaItem);

export const idea = noParamterType(name.idea);

export const itemBody = noParamterType(name.itemBody);

export const openIdConnectProvider = noParamterType(name.openIdConnectProvider);

export const urlData = noParamterType(name.urlData);

export const clientMode = noParamterType(name.clientMode);

export const location = noParamterType(name.location);

export const language = noParamterType(name.language);

export const typePart = noParamterType(name.typePart);

export const nType = noParamterType(name.nType);

export const okAndErrorType = noParamterType(name.nOkAndErrorType);

export const nameAndTypeParameterList = noParamterType(
  name.nNameAndTypeParameterList
);

export const nCustomTypeDefinition = noParamterType(name.nCustomTypeDefinition);

export const nCustomTypeDefinitionBody = noParamterType(
  name.nCustomTypeDefinitionBody
);

export const nMember = noParamterType(name.nMember);

export const nPattern = noParamterType(name.nPattern);
