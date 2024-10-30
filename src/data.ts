import { Clue, Guest } from './types';

/**
 * Pre-defined Data
 * -----------------------------------------------------------------------------
 */

/**
 * Guests
 * -----------------------------------------------------------------------------
 */

export const guests: Guest[] = [
  { id: '12345' },
  { id: '865RO' },
  { id: 'LPCY5' },
  { id: 'R8YMK' },
  { id: 'CY33B' },
  { id: '8O5YO' },
  { id: 'MLITG' },
  { id: 'YZMZX' },
  { id: 'AZS8Z' },
  { id: 'PYEBE' },
];

/**
 * Clues
 * -----------------------------------------------------------------------------
 */

export const clues: Clue[] = [
  {
    id: '0AK',
    prompt: 'Beneath leaves of red lie our golden heads.',
    hint: '',
    location: 'Mendies yard, underneath the cherry tree in the back',
    token: 'LLL',
  },
  {
    id: 'ZHZ',
    prompt:
      'Once king of the jungle did I roam, now I lay curled in my _____ home. ' +
      'Near me is your next passport stamp.',
    hint: '',
    location: '???',
    token: 'AB3',
  },
  {
    id: '9CO',
    prompt:
      'I am a tree yet my shape is like a mushroom. ' +
      'My name is decorated by a foreign country name. ' +
      'Some of my relatives produce a sweet substance commonly used at breakfast.',
    hint: '',
    location: 'Japanese Maple',
    token: '9WS',
  },
  { id: 'RK1', prompt: '', hint: '', location: '', token: 'C5R' },
  { id: 'HGG', prompt: '', hint: '', location: '', token: 'MUS' },
  { id: 'C2Q', prompt: '', hint: '', location: '', token: 'RY9' },
  { id: 'JPC', prompt: '', hint: '', location: '', token: 'KMO' },
  { id: 'H2A', prompt: '', hint: '', location: '', token: 'SEA' },
  { id: 'EZH', prompt: '', hint: '', location: '', token: '043' },
  { id: 'JDX', prompt: '', hint: '', location: '', token: '4HV' },
  { id: 'G6L', prompt: '', hint: '', location: '', token: 'YJC' },
];
