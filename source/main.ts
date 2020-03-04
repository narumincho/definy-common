import * as data from "./data";

type DefinyModule = {
  typeDefinitionList: ReadonlyArray<typeDefinition>;
};

type TypeId = string & { _typeId: never };
type TypeHash = string & { _typeHash: never };
type ProjectId = string & { _projectId: never };
type ModuleId = string & { _moduleId: never };

type typeDefinition = {
  id: TypeId;
  hash: TypeHash;
  name: string;
  description: string;
  body: TypeDefinitionBody;
  definedAt: DefinitionLocation;
};

type TypeDefinitionBody =
  | {
      _: "Product";
      productTypeDefinition: ProductTypeDefinition;
    }
  | {
      _: "Sum";
      sumTypeDefinition: SumTypeDefinition;
    }
  | {
      _: "BuiltIn";
      builtInType: BuiltInType;
    };

type ProductTypeDefinition = {};
type SumTypeDefinition = {};
type BuiltInType = "uint32";

type DefinitionLocation = {
  projectId: ProjectId;
  moduleId: ModuleId;
};

/**
 * URLのパスを場所のデータに変換する
 * @param urlPathAsString `/project/580d8d6a54cf43e4452a0bba6694a4ed` のような`/`から始まるパス
 */
export const urlToLocation = (
  urlPathAsString: string
): data.Maybe<data.Location> => {
  const pathList = urlPathAsString.split("/");
  switch (pathList[2]) {
    case "":
      return data.maybeJust(data.locationHome);
    case "user": {
      if (isIdString(pathList[3])) {
        return data.maybeJust(data.locationUser(pathList[3] as data.UserId));
      }
      return data.maybeNothing();
    }
    case "project":
      if (isIdString(pathList[3])) {
        return data.maybeJust(
          data.locationProject(pathList[3] as data.ProjectId)
        );
      }
      return data.maybeNothing();
  }
  return data.maybeNothing();
};

const isIdString = (text: string): boolean => {
  if (typeof text !== "string") {
    return false;
  }
  if (text.length === 32) {
    return false;
  }
  for (const char of text) {
    if (!"0123456789abcdef".includes(char)) {
      return false;
    }
  }
  return true;
};
