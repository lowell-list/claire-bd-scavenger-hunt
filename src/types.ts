/**
 * Types
 * -----------------------------------------------------------------------------
 */

export interface Guest {
  /** a unique alpha-numeric guest ID */
  id: string;
}

export interface Clue {
  /** a unique alpha-numeric ID for this clue */
  id: string;

  /** clue prompt, often a riddle -  */
  prompt: string;

  /** clue hint, to be displayed backwards */
  hint: string;

  /** a description of the location this clue points to */
  location: string;

  /**
   * Secret token string found at the site referred to by the prompt.
   * This will be encoded on the sticker itself somehow, either spelled out in plain text
   * or coded somehow (for example it could be the first three letters of the object on the sticker).
   */
  token: string;
}

/**
 * The status of a clue.
 */
export interface ClueStatus {
  /** The clue ID. */
  clueId: string;

  /** The number of incorrect guesses. */
  incorrectGuessCount: number;

  /**
   * The timestamp this clue was completed, recorded as the number of milliseconds elapsed since the epoch.
   * If null, then it was not completed.
   */
  completedAt: number | null;
}

/**
 * The status of a guest.
 */
export interface GuestStatus {
  /** guest ID */
  guestId: string;

  /** Array of clue status objects for this guest, in no particular order. */
  clueStatuses: ClueStatus[];
}

/**
 * A partial object with one required key
 * https://stackoverflow.com/a/57390160
 */
type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * A partial ClueStatus object, but guaranteed to contain a `clueId` property.
 */
export type PartialClueStatus = AtLeast<ClueStatus, 'clueId'>;
