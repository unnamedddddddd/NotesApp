import { NoteProps } from "@/types/NoteProps";
import { makeAutoObservable, runInAction } from "mobx";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusType } from "@/types/StatusType";
import { SortType } from "@/types/SortType";

class NotesStore {
  notes: NoteProps[] = [];
  private owner: string | null = null;

  searchQuery: string = '';
  sortStatus: 'all' | StatusType = 'all';
  sortType: SortType = 'start';


  constructor() {
    makeAutoObservable(this);
  }

  async load(login: string) {
    this.owner = login;
    const response = await AsyncStorage.getItem(`notes:${login}`);

    runInAction(() => {
      this.notes = response ? JSON.parse(response) : [];
    });
  }

  private async persist() {
    if (this.owner) {
      await AsyncStorage.setItem(`notes:${this.owner}`, JSON.stringify(this.notes));
    }
  }

  get sortNotes(): NoteProps[] {
    let result: NoteProps[] = [];

    result = this.notes.filter(note => note.title.toLowerCase().includes(this.searchQuery.toLowerCase()));

    if (this.sortStatus !== 'all') {
      result = result.filter(note => note.status === this.sortStatus);
    }

    if (this.sortType === 'asc') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortType === 'desc') {
      result = [...result].sort((a, b) => b.title.localeCompare(a.title));
    } else {
      result = [...result].sort((a, b) => b.updatedAt - a.updatedAt);
    }
    
    return result;
  }

  get(id: string) {
    return this.notes.find(note => note.id === id);
  }

  async save(title: string, text: string, status: StatusType, id?: string | undefined,) {
    if (id) {
      const note = this.get(id);
      if (note) {
        note.text = text;
        note.title = title;
        note.status = status;
        note.updatedAt = Date.now()
      }
    } else {
      this.notes.unshift({
        id: String(Date.now()),
        text,
        title,
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