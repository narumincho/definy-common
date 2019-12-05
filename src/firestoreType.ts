import * as firestore from "@google-cloud/firestore";

type DocumentDataDefault = { [key in string]: string | number };

type DocumentTypeWithFieldValue<doc extends DocumentDataDefault> = {
  [key in keyof doc]: doc[key] | firestore.FieldValue;
};

export type TypedQuery<doc extends DocumentDataDefault> = {
  readonly firestore: firestore.Firestore;

  where(
    fieldPath: string | firestore.FieldPath,
    opStr: firestore.WhereFilterOp,
    value: any
  ): TypedQuery<doc>;

  orderBy(
    fieldPath: string | firestore.FieldPath,
    directionStr?: firestore.OrderByDirection
  ): TypedQuery<doc>;

  limit(limit: number): TypedQuery<doc>;

  offset(offset: number): TypedQuery<doc>;

  select(...field: (string | firestore.FieldPath)[]): TypedQuery<doc>;

  startAt(snapshot: TypedDocumentSnapshot<doc>): TypedQuery<doc>;

  startAt(...fieldValues: any[]): TypedQuery<doc>;

  startAfter(snapshot: TypedDocumentSnapshot<doc>): TypedQuery<doc>;

  startAfter(...fieldValues: any[]): TypedQuery<doc>;

  endBefore(snapshot: TypedDocumentSnapshot<doc>): TypedQuery<doc>;

  endBefore(...fieldValues: any[]): TypedQuery<doc>;

  endAt(snapshot: TypedDocumentSnapshot<doc>): TypedQuery<doc>;

  endAt(...fieldValues: any[]): TypedQuery<doc>;

  // TODO !!!
  get(): Promise<any>;

  stream(): NodeJS.ReadableStream;

  // TODO !!!
  onSnapshot(
    onNext: (snapshot: any) => void,
    onError?: (error: Error) => void
  ): () => void;

  isEqual(other: TypedQuery<doc>): boolean;
};

export type TypedCollectionReference<
  doc extends DocumentDataDefault
> = TypedQuery<doc> & {
  readonly id: string;
  readonly parent: firestore.DocumentReference | null;
  readonly path: string;
  listDocuments(): Promise<Array<TypedDocumentReference<doc>>>;
  doc(): TypedDocumentReference<doc>;
  doc(documentPath: string): TypedDocumentReference<doc>;
  add(
    data: DocumentTypeWithFieldValue<doc>
  ): Promise<TypedDocumentReference<doc>>;
  isEqual(other: firestore.CollectionReference): boolean;
};

type T = TypedDocumentReference<{
  sorena: number;
}> extends firestore.DocumentReference
  ? true
  : false;

export type TypedDocumentReference<doc extends DocumentDataDefault> = {
  readonly id: string;
  readonly firestore: firestore.Firestore;
  readonly parent: TypedCollectionReference<doc>;
  readonly path: string;
  collection(collectionPath: string): TypedCollectionReference<doc>;
  listCollections(): Promise<Array<TypedCollectionReference<doc>>>;
  create(data: DocumentTypeWithFieldValue<doc>): Promise<firestore.WriteResult>;
  set(
    data: DocumentTypeWithFieldValue<doc>,
    options?: firestore.SetOptions
  ): Promise<firestore.WriteResult>;
  update(
    data: DocumentTypeWithFieldValue<doc>,
    precondition?: firestore.Precondition
  ): Promise<firestore.WriteResult>;

  update(
    field: string | firestore.FieldPath,
    value: any,
    ...moreFieldsOrPrecondition: any[]
  ): Promise<firestore.WriteResult>;

  delete(precondition?: firestore.Precondition): Promise<firestore.WriteResult>;

  get(): Promise<TypedDocumentSnapshot<doc>>;

  onSnapshot(
    onNext: (snapshot: TypedDocumentSnapshot<doc>) => void,
    onError?: (error: Error) => void
  ): () => void;

  isEqual(other: TypedDocumentReference<doc>): boolean;
};

type TypedDocumentSnapshot<doc extends DocumentDataDefault> = {
  readonly exists: boolean;

  readonly ref: TypedDocumentReference<doc>;
  readonly id: string;
  readonly createTime?: firestore.Timestamp;
  readonly updateTime?: firestore.Timestamp;
  readonly readTime: firestore.Timestamp;

  data(): DocumentTypeWithFieldValue<doc> | undefined;

  get(fieldPath: string | firestore.FieldPath): any;

  isEqual(other: firestore.DocumentSnapshot): boolean;
};
