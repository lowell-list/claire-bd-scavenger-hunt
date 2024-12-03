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
  { id: 'A8GXW' },
  { id: 'T8ZDB' },
  { id: 'Q3NXC' },
  { id: 'R8YMK' },
  { id: 'CY33B' },
  { id: '8O5YO' },
  { id: 'MLITG' },
  { id: 'YZMZX' },
  { id: 'AZS8Z' },
  { id: 'PYEBE' },
  { id: '6BV13' },
  { id: 'H5SMH' },
  { id: 'TXM8V' },
  { id: 'BQP2S' },
  { id: 'ZVFYA' },
];
// console.log('There are ' + guests.length + ' guests.');

/**
 * Clues
 * -----------------------------------------------------------------------------
 */

export const clues: Clue[] = [
  {
    id: '0AK',
    prompt: 'Enil piz fo dne, covered in leaves of gold.',
    hint: '',
    location:
      'Mendies yard, underneath the cherry tree in the back, end of zip line',
    token: 'EPF',
  },
  {
    id: 'RK1',
    prompt: 'I have a lot of stars, but I am not the sky.',
    hint: '',
    location: 'American flag, List front porch',
    token: 'AFL',
  },
  {
    id: 'HGG',
    prompt: "If you don't spot this sign, you might have an accident.",
    hint: '',
    location:
      "Dad's stop sign, hanging on a branch (twisted plum tree, Mendies side yard)",
    token: 'MUS',
  },
  {
    id: 'C2Q',
    prompt:
      'In a tall hedge of bushes do I dwell, a cave of twisted branches are my bed, yet no, I am nothing to dread.',
    hint: 'I am in the Mendies driveway area',
    location:
      'bush place off to the side of the Mendies driveway (next to Eds front yard)',
    token: 'RY9',
  },
  {
    id: 'JPC',
    prompt:
      'Pile so high, might touch the sky; once was a tree, now shredded and free; buried do I now dwell.',
    hint: '',
    location: 'bucket in bark chip pile in front of the List house',
    token: 'KMO',
  },
  {
    id: 'H2A',
    prompt:
      'In summer I murmur, in winter I freeze, in spring I glisten, in fall I collect leaves.',
    hint: '',
    location: 'Mendies fountain area',
    token: 'SEA',
  },
  {
    id: 'EZH',
    prompt:
      "Berries so red, eat me you're dead, beneath them I lie, staring up at the sky.",
    hint: '',
    location: 'thorny bushes with red berries in Menies back yard',
    token: '043',
  },
  {
    id: 'JDX',
    prompt:
      "Down path of stone, nothing do we own; near summer's last bloom, yea we await our doom.",
    hint: '',
    location:
      'down the stone path, by Mendies shed, old flower pot with pink flowers',
    token: '4HV',
  },
  {
    id: 'ZHZ',
    prompt:
      "Up so high, my view for to die; you'll need climbing skills to reach me",
    hint: '',
    location: 'Tree house/fort at Mendies',
    token: 'TTH',
  },
  {
    id: '9CO',
    prompt:
      'I am a tree yet my shape is like a mushroom. ' +
      'My name is decorated by a foreign country name. ' +
      'Some of my relatives produce a sweet substance commonly used at breakfast.',
    hint: '',
    location: 'Japanese Maple, List front yard',
    token: 'JML',
  },
];

/**
 * Sounds
 * -----------------------------------------------------------------------------
 */

export const sounds: { [key: string]: { audio: HTMLAudioElement } } = {
  success: { audio: new Audio('/sounds/404358__kagateni__success.wav') },
  accessDenied: {
    audio: new Audio(
      '/sounds/662780__silverillusionist__password-fail-angry-beeps.wav'
    ),
  },
  accessGranted: {
    audio: new Audio(
      '/sounds/464797__robinhood76__07478-verification-completed-ding.wav'
    ),
  },
};

export type SoundName = keyof typeof sounds;

/**
 * Token feedback text
 * -----------------------------------------------------------------------------
 */

export const tokenFeedbackText = {
  success: [
    'you did it!',
    'nice!',
    'excellent',
    'right on',
    'yes',
    'very good',
  ],
  fail: ['nope', 'whoops', 'try again', 'sorry', 'uh uh', 'not right', 'no'],
};
