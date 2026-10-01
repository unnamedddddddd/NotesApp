import { Status } from "@/stores/notesStore";

export type Note = {
  id: string;
  text: string; 
  updatedAt: number;
  status: Status;
}