import { Note } from "@/types/Note";
import { makeAutoObservable, runInAction } from "mobx";
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Status = 'new' | 'progress' | 'done';

class NotesStore {
  notes: Note[] = [];
  private owner: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async load(login: string) {
    this.owner = login;
    const raw = await AsyncStorage.getItem(`notes:${login}`);

    runInAction(() => {
      this.notes = raw ? JSON.parse(raw) : [];
    });
  }

  private async persist() {
    if (this.owner) {
      await AsyncStorage.setItem(`notes:${this.owner}`, JSON.stringify(this.notes));
    }
  }

  get(id: string) {
    return this.notes.find(note => note.id === id);
  }

  async save(id: string |  undefined, text: string,  status: Status) {
    if (id) {
      const note = this.get(id);
      if (note) {
        note.text = text; 
        note.status = status;
        note.updatedAt = Date.now()
      }
    } else {
      this.notes.unshift({
        id: String(Date.now()),
        text,
        updatedAt: Date.now(),
        status
      });
    }
    await this.persist();
  }

  async remove(id: string) {
    this.notes = this.notes.filter(note => note.id !== id);
    await this.persist();
  }
}

export const notesStore = new NotesStore();