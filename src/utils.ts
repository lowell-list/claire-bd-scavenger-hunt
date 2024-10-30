import { Clue, Guest, GuestStatus } from './types';
import { clues, guests } from './data';

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
 * Seedable random number generator.
 * https://stackoverflow.com/a/47593316
 */
function sfc32(a, b, c, d) {
  return function () {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    let t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

/** TODO: test this */
function testSeedGen() {
  const seedgen = () => (Math.random() * 2 ** 32) >>> 0;
  const getRand = sfc32(seedgen(), seedgen(), seedgen(), seedgen());
  for (let i = 0; i < 10; i++) console.log(getRand());
}

/**
 * Generate random strings.
 */
export const generateRandomStrings = () => {
  for (let xa = 0; xa < 10; xa++) {
    console.log(randomString(3, 'A#'));
  }
};

/**
 * Functions - Guest
 * -----------------------------------------------------------------------------
 */

/**
 * Given a guest ID, return a deterministicly ordered array of clue IDs.
 */
function getShuffledClueIdsForGuest(guestId: string, clues: Clue[]): string[] {
  return [];
}

/**
 * Given a guest ID, return the matching Guest object.
 */
export const lookupGuest = (guestId: string): Guest | undefined => {
  return guests.find(guest => guest.id === guestId);
};

/**
 * Functions - GuestStatus
 * -----------------------------------------------------------------------------
 */

export const getLastCompletedClue = (guestStatus: GuestStatus): Clue => {
  return clues[0];
};

/**
 * Given a Guest's GuestStatus object, return the current (unsolved) clue.
 * If the Guest has no solved clues, then return the first clue.
 */
export const getCurrentClue = (guestStatus: GuestStatus | null): Clue => {
  if (!guestStatus || guestStatus.clueStatuses.length <= 0) {
    return clues[0];
  }
  const lastClueStatus = guestStatus.clueStatuses.slice(-1)[0];
  const lastClue = clues.find(clue => clue.id === lastClueStatus.clueId);
  return lastClue;
};

/**
 * .
 */
export const setLastClueAsSolved = (guestStatus: GuestStatus | null) => {};

/**
 * Functions - Load / Save GuestStatus
 * -----------------------------------------------------------------------------
 */

/**
 * Load GuestStatus object for the given guest.
 * If none could be found, return an empty GuestStatus object.
 */
export const loadGuestStatus = (guestId: string): GuestStatus | null => {
  const emptyGuestStatus: GuestStatus = {
    guestId: guestId,
    clueStatuses: [],
  };
  try {
    const rawItem = localStorage.getItem(`${guestId}.GuestStatus`);
    if (!rawItem) {
      return emptyGuestStatus;
    }
    return JSON.parse(rawItem) as GuestStatus;
  } catch (error) {
    console.log(error);
    return emptyGuestStatus;
  }
};

/**
 * Save GuestStatus object for the given guest.
 */
export const saveGuestStatus = (guestStatus: GuestStatus) => {
  localStorage.setItem(
    `${guestStatus.guestId}.GuestStatus`,
    JSON.stringify(guestStatus)
  );
};
