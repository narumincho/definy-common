import * as data from "../source/data";
import * as id from "./typePartId";

const noParameterType = (typePartId: data.TypePartId): data.Type => ({
  typePartId,
  parameter: [],
});

export const Int32 = noParameterType(id.Int32);
export const Binary = noParameterType(id.Binary);
export const Bool = noParameterType(id.Bool);
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
export const String = noParameterType(id.String);

export const ProjectId = noParameterType(id.ProjectId);

export const UserId = noParameterType(id.UserId);

export const IdeaId = noParameterType(id.IdeaId);

export const CommitId = noParameterType(id.CommitId);

export const ImageToken = noParameterType(id.ImageToken);

export const PartId = noParameterType(id.PartId);

export const TypePartId = noParameterType(id.TypePartId);

export const TagId = noParameterType(id.TagId);

export const AccountToken = noParameterType(id.AccountToken);

export const PartHash = noParameterType(id.PartHash);

export const TypePartHash = noParameterType(id.TypePartHash);

export const ReleasePartId = noParameterType(id.ReleasePartId);

export const ReleaseTypePartId = noParameterType(id.ReleaseTypePartId);

export const Time = noParameterType(id.Time);

export const RequestLogInUrlRequestData = noParameterType(
  id.RequestLogInUrlRequestData
);

export const OpenIdConnectProvider = noParameterType(id.OpenIdConnectProvider);

export const UrlData = noParameterType(id.UrlData);

export const ClientMode = noParameterType(id.ClientMode);

export const Location = noParameterType(id.Location);

export const Language = noParameterType(id.Language);

export const User = noParameterType(id.User);

export const IdAndData = (
  idType: data.Type,
  dataType: data.Type
): data.Type => ({
  typePartId: id.IdAndData,
  parameter: [idType, dataType],
});

export const Project = noParameterType(id.Project);

export const Idea = noParameterType(id.Idea);

export const Comment = noParameterType(id.Comment);

export const Code = noParameterType(id.Commit);

export const IdeaState = noParameterType(id.IdeaState);

export const Part = noParameterType(id.Part);

export const TypePart = noParameterType(id.TypePart);

export const TypeAttribute = noParameterType(id.TypeAttribute);

export const TypeParameter = noParameterType(id.TypeParameter);

export const TypePartBody = noParameterType(id.TypePartBody);

export const Member = noParameterType(id.Member);

export const Pattern = noParameterType(id.Pattern);

export const TypePartBodyKernel = noParameterType(id.TypePartBodyKernel);

export const Type = noParameterType(id.Type);

export const Expr = noParameterType(id.Expr);

export const KernelExpr = noParameterType(id.KernelExpr);

export const TagReference = noParameterType(id.TagReference);

export const FunctionCall = noParameterType(id.FunctionCall);

export const LambdaBranch = noParameterType(id.LambdaBranch);

export const Condition = noParameterType(id.Condition);

export const ConditionTag = noParameterType(id.ConditionTag);

export const ConditionCapture = noParameterType(id.ConditionCapture);

export const BranchPartDefinition = noParameterType(id.BranchPartDefinition);

export const EvaluatedExpr = noParameterType(id.EvaluatedExpr);

export const KernelCall = noParameterType(id.KernelCall);

export const EvaluateExprError = noParameterType(id.EvaluateExprError);

export const TypeError = noParameterType(id.TypeError);

export const CreateProjectParameter = noParameterType(
  id.CreateProjectParameter
);

export const CreateIdeaParameter = noParameterType(id.CreateIdeaParameter);

export const AddCommentParameter = noParameterType(id.AddCommentParameter);

export const AddCommitParameter = noParameterType(id.AddCommitParameter);

export const AccountTokenAndCommitId = noParameterType(
  id.AccountTokenAndCommitId
);

export const LogInState = noParameterType(id.LogInState);

export const WithTime = (dataType: data.Type): data.Type => ({
  typePartId: id.WithTime,
  parameter: [dataType],
});

export const ResourceState = (dataType: data.Type): data.Type => ({
  typePartId: id.ResourceState,
  parameter: [dataType],
});

export const StaticResourceState = (dataType: data.Type): data.Type => ({
  typePartId: id.StaticResourceState,
  parameter: [dataType],
});

export const AccountTokenAndUserId = noParameterType(id.AccountTokenAndUserId);

export const AccountTokenAndProjectId = noParameterType(
  id.AccountTokenAndProjectId
);
