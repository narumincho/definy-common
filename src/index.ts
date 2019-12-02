import { firestore } from "firebase";

export type User = {
  name: string;
  createdAt: firestore.Timestamp;
};
