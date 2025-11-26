import {BehaviorSubject} from "rxjs";

export class HistoryService<T> {

  // history in a circular buffer
  //bufferSize entries: entries are 0 to bufferSize-1, -1 is not defined

  //you need to call init after localstorage is ready if you would like to have the history available at app start
  /* example for instance "KemlHistoryService" that has a fixed prefix and type for T:
  provideAppInitializer(()=>{
      const platformId = inject(PLATFORM_ID);
      if(isPlatformBrowser(platformId)){
        const history = inject(KemlHistoryService);
        history.init();
      }
    })
   */

  private readonly prefix: string;
  private readonly bufferSize: number;
  readonly oldestEntryName: string;
  readonly newestEntryName: string;
  readonly currentEntryName: string;
  private oldestEntry: number = 0;
  private newestEntry: number = 0;
  private currentEntry: number = 0;

  private stateSubject = new BehaviorSubject<T | null>(null);
  state$ = this.stateSubject.asObservable();

  constructor(prefix: string = 'history_', bufferSize: number = 50) {
    this.prefix = prefix;
    this.oldestEntryName = prefix + 'oldestEntry';
    this.newestEntryName = prefix + 'newestEntry';
    this.currentEntryName = prefix + 'currentEntry';
    this.bufferSize = bufferSize;
  }

  init() {
    this.oldestEntry = this.readNumber(this.oldestEntryName)
    this.newestEntry = this.readNumber(this.newestEntryName)
    this.currentEntry = this.readNumber(this.currentEntryName)
    if (this.oldestEntry == -1 || this.newestEntry == -1 || this.currentEntry == -1) {
      this.clearHistory()
    } else {
      let entry = this.loadFromStorage(this.currentEntry)
      this.stateSubject.next(entry)
    }
  }

  clearHistory() {
    this.oldestEntry = -1;
    this.newestEntry = -1;
    this.currentEntry = -1;
    this.saveNumber(this.oldestEntryName, this.oldestEntry)
    this.saveNumber(this.newestEntryName, this.newestEntry)
    this.saveNumber(this.currentEntryName, this.currentEntry)
    for (let i = 1; i < this.bufferSize; i++) {
      this.deleteEntry(i);
    }
  }

  save(elem: T) {
    // needs to invalidate any element between the newest Entry and the current Entry, then save new Entry
    this.invalidateTooYoungEntries()
    // also remove one oldest entry if you need to make space
    let next = this.incrementNumber(this.currentEntry)

    if (next == this.oldestEntry || this.oldestEntry == -1) {
      this.invalidateOldestEntry()
    }
    this.newestEntry = next
    this.currentEntry = next
    this.saveNumber(this.newestEntryName, this.newestEntry)
    this.saveNumber(this.currentEntryName, this.currentEntry)
    this.saveToStorage(next, elem)
  }

  undo(): T | null {
    if (this.currentEntry == this.oldestEntry) { //current Entry is oldest, no decrement possible
      console.error("Cannot undo - already reached oldest entry")
      return null
    } else {
      this.currentEntry = this.decrementNumber(this.currentEntry)
      this.saveNumber(this.currentEntryName, this.currentEntry)
      let entry = this.loadFromStorage(this.currentEntry)
      this.stateSubject.next(entry)
      return entry
    }
  }

  isUndoNotPossible(): boolean {
    return (this.currentEntry == this.oldestEntry)
  }

  redo(): T | null {
    if (this.currentEntry == this.newestEntry) {
      console.error("Cannot redo - already reached newest entry")
      return null
    } else {
      this.currentEntry = this.incrementNumber(this.currentEntry)
      this.saveNumber(this.currentEntryName, this.currentEntry)
      let entry = this.loadFromStorage(this.currentEntry)
      this.stateSubject.next(entry)
      return entry
    }
  }

  isRedoNotPossible(): boolean {
    return (this.currentEntry == this.newestEntry)
  }

  private loadFromStorage(index: number): T | null {
    let itemString = localStorage.getItem(this.prefix + index)
    if (itemString == null) {
      return null
    } else {
      return JSON.parse(itemString)
    }
  }

  private saveToStorage(index: number, elem: T): void {
    localStorage.setItem(this.prefix + index, JSON.stringify(elem))
  }

  private deleteEntry(index: number): void {
    localStorage.removeItem(this.prefix + index)
  }

  private invalidateTooYoungEntries(): void {
    while (this.newestEntry != this.currentEntry) {
      this.deleteEntry(this.newestEntry);
      this.newestEntry = this.decrementNumber(this.newestEntry)
    }
    this.saveNumber(this.newestEntryName, this.newestEntry)
  }

  private invalidateOldestEntry(): void {
    this.deleteEntry(this.oldestEntry)
    this.oldestEntry = this.incrementNumber(this.oldestEntry)
    this.saveNumber(this.oldestEntryName, this.oldestEntry)
  }

  private readNumber(name: string): number {
    let maybeN = localStorage.getItem(name)
    if (maybeN) {
      return parseInt(maybeN, 10)
    } else {
      return -1
    }
  }

  private saveNumber(name: string, num: number): void {
    localStorage.setItem(name, num.toString(10))
  }

  private decrementNumber(num: number): number {
    if (num === 0) return this.bufferSize-1
    else return num-1
  }

  private incrementNumber(num: number): number {
    if (num === this.bufferSize-1) return 0
    else return num+1
  }
}
