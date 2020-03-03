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

export const compile = (): data.Maybe<number> => {
  return data.maybeJust(32);
};
