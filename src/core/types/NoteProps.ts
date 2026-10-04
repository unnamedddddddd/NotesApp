import { StatusType } from "@/types/StatusType";

export type NoteProps = {
  id: string;
  text: string; 
  title: string;
  updatedAt: number;
  status: StatusType;
}