import {
  Clue,
  ClueStatus,
  Guest,
  GuestStatus,
  PartialClueStatus,
} from './types';
import { clues, guests, sounds, SoundName } from './data';
import seedrandom from 'seedrandom';

/**
 * Functions - Generic
 * -----------------------------------------------------------------------------
 */

/**
 * Generate a random string given the desired length and character group.
 * https://stackoverflow.com/a/10727155 🙏
 */
export function randomString(length, chars) {
  var mask = '';
  if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
  if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (chars.indexOf('#') > -1) mask += '0123456789';
  if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
  var result = '';
  for (var i = length; i > 0; --i)
    result += mask[Math.floor(Math.random() * mask.length)];
  return result;
}

/**
 * Generate random strings.
 */
export const generateRandomStrings = () => {
  for (let xa = 0; xa < 10; xa++) {
    console.log(randomString(5, 'A#'));
  }
};

/**
 * Functions - Guest
 * -----------------------------------------------------------------------------
 */

/**
 * Given a guest ID, return the matching Guest object.
 */
export const lookupGuest = (guestId: string): Guest | undefined => {
  return guests.find(guest => guest.id === guestId);
};

/**
 * Given a guest ID, return a deterministicly ordered array of clue IDs.
 */
export function getShuffledClueIdsForGuest(
  guestId: string,
  clueIds: string[]
): string[] {
  // prepare
  const seededRNG = seedrandom(guestId); // seeded random number generator
  let workArray = structuredClone(clueIds); // clone the clueIds array

  // shuffle the workArray with the Fisher-Yates shuffle algorithm
  for (let i = workArray.length - 1; i > 0; i--) {
    const j = Math.floor(seededRNG() * (i + 1));
    [workArray[i], workArray[j]] = [workArray[j], workArray[i]];
  }

  // done
  return workArray;
}

// console.log(
//   guests.map(guest =>
//     getShuffledClueIdsForGuest(
//       guest.id,
//       clues.map(clue => clue.id)
//     )
//   )
// );

export function shuffleArray(array: any[], rng: Function = Math.random): any[] {
  let workArray = structuredClone(array); // clone the incoming array

  // shuffle the workArray with the Fisher-Yates shuffle algorithm
  for (let i = workArray.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [workArray[i], workArray[j]] = [workArray[j], workArray[i]];
  }

  // done
  return workArray;
}

/**
 * Functions - GuestStatus
 * -----------------------------------------------------------------------------
 */

/**
 * Return the ClueStatus that corresponds to the given clue ID, or
 * undefined if it doesn't exist.
 */
export const findClueStatus = (guestStatus: GuestStatus, clueId: string) =>
  guestStatus.clueStatuses.find(clueStatus => clueStatus.clueId === clueId);

/**
 * Return the index of the ClueStatus that corresponds to the given clue ID, or
 * -1 if it doesn't exist.
 */
export const findIndexOfClueStatus = (
  guestStatus: GuestStatus,
  clueId: string
) =>
  guestStatus.clueStatuses.findIndex(
    clueStatus => clueStatus.clueId === clueId
  );

/**
 * Given a Guest's GuestStatus object, return the next unsolved clue.
 * If the Guest has no solved clues, then return their first clue.
 * If the Guest has solved all the clues, then return null.
 */
export const getNextUnsolvedClue = (
  guestStatus: GuestStatus | null
): Clue | null => {
  if (!guestStatus || !lookupGuest(guestStatus.guestId)) {
    // don't know who this guest is, so just return the first clue
    return clues[0];
  }

  // get uniquely shuffled clue IDs for this guest
  const shuffledClueIdsForGuest = getShuffledClueIdsForGuest(
    guestStatus.guestId,
    clues.map(clue => clue.id)
  );

  // find the first unsolved clue
  for (let clueId of shuffledClueIdsForGuest) {
    console.log(clueId);
    const clue = clues.find(clue => clue.id === clueId);
    const clueStatus = findClueStatus(guestStatus, clueId);
    if (!clueStatus || clueStatus.completedAt === null) {
      return clue;
    }
  }

  // all clues are solved!
  return null;
};

/**
 * Return a copy of the given GuestStatus with the ClueStatus created or updated.
 */
export const upsertClueStatus = (
  guestStatus: GuestStatus,
  clueStatus: PartialClueStatus
) => {
  // find existing ClueStatus
  const existingClueStatusIndex = findIndexOfClueStatus(
    guestStatus,
    clueStatus.clueId
  );

  // create merged ClueStatus object
  const defaultClueStatus: ClueStatus = {
    clueId: clueStatus.clueId,
    incorrectGuessCount: 0,
    completedAt: null,
  };
  const existingClueStatus: Partial<ClueStatus> =
    findClueStatus(guestStatus, clueStatus.clueId) || {};
  const mergedClueStatus = {
    ...defaultClueStatus,
    ...existingClueStatus,
    ...clueStatus,
  };

  // clone GuestStatus
  const guestStatusClone: GuestStatus = structuredClone(guestStatus);

  // insert or update ClueStatus
  if (existingClueStatusIndex === -1) {
    guestStatusClone.clueStatuses.push(mergedClueStatus);
  } else {
    guestStatusClone.clueStatuses[existingClueStatusIndex] = mergedClueStatus;
  }

  // return clone
  return guestStatusClone;
};

/**
 * Return a copy of the GuestStatus object with the incorrect guess count
 * incremented for the given clue. If the given clue does not exist, the
 * corresponding ClueStatus is created.
 */
export const incrementIncorrectGuessCount = (
  guestStatus: GuestStatus,
  clue: Clue
): GuestStatus => {
  const existingClueStatus = findClueStatus(guestStatus, clue.id);
  return upsertClueStatus(guestStatus, {
    clueId: clue.id,
    incorrectGuessCount: (existingClueStatus?.incorrectGuessCount || 0) + 1,
  });
};

/**
 * Return a copy of the GuestStatus object with the `completedAt` date stamp
 * set to the current date/time.
 */
export const setClueCompletion = (
  guestStatus: GuestStatus,
  clue: Clue
): GuestStatus => {
  return upsertClueStatus(guestStatus, {
    clueId: clue.id,
    completedAt: Date.now(),
  });
};

/**
 * Functions - Load / Save GuestStatus
 * -----------------------------------------------------------------------------
 */

/**
 * Load GuestStatus object for the given guest.
 * If none could be found, return an empty GuestStatus object.
 */
export const loadGuestStatusFromLocalStorage = (
  guestId: string
): GuestStatus | null => {
  const emptyGuestStatus: GuestStatus = {
    guestId: guestId,
    clueStatuses: [],
  };
  try {
    const rawItem = localStorage.getItem(`${guestId}.GuestStatus`);
    const guestStatus = !rawItem
      ? emptyGuestStatus
      : (JSON.parse(rawItem) as GuestStatus);
    console.log(
      `loaded GuestStatus for ${guestId} ` +
        JSON.stringify(guestStatus, null, 2)
    );
    return guestStatus;
  } catch (error) {
    console.log(error);
    return emptyGuestStatus;
  }
};

/**
 * Save GuestStatus object for the given guest.
 */
export const saveGuestStatusToLocalStorage = (guestStatus: GuestStatus) => {
  localStorage.setItem(
    `${guestStatus.guestId}.GuestStatus`,
    JSON.stringify(guestStatus)
  );
  console.log('saved GuestStatus: ' + JSON.stringify(guestStatus, null, 2));
};

/**
 * Functions - Sound
 * -----------------------------------------------------------------------------
 */

export const playSound = (name: SoundName) => {
  const audio = sounds[name].audio;
  audio.pause();
  audio.currentTime = 0;
  audio.play();
  console.log(`played sound [${name}]`);
};
