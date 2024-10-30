import React from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Text,
  TextField,
  Tooltip,
} from '@radix-ui/themes';
import {
  Cross2Icon,
  LightningBoltIcon,
  MagicWandIcon,
  MoonIcon,
} from '@radix-ui/react-icons';
import { Clue, Guest, GuestStatus } from './types';
import { clues } from './data';
import {
  getCurrentClue,
  lookupGuest,
  loadGuestStatus,
  saveGuestStatus,
} from './utils';

/**
 * There will be about 10 guests.
 * Each one will receive a passport with a unique ID.
 * There will be about 10 empty squares (or pages) on the passport. Each one will need to receive a sticker.
 * To find a sticker, the guest will receive a clue and then go find the referenced location.
 * At the location, they will receive a sticker and put it on their passport.
 * The first guest to get all stickers wins!
 * This program will give each guest their next clue, and the clues will be in random order.
 */

/**
 * App
 * -----------------------------------------------------------------------------
 */

export default function App() {
  /**
   * Data, State
   * ---------------------------------------------------------------------------
   */

  const [guestIdInputText, setGuestIdInputText] =
    React.useState<string>('12345');
  const currentGuest: Guest | undefined = lookupGuest(guestIdInputText);
  const [currentGuestStatus, setCurrentGuestStatus] =
    React.useState<GuestStatus | null>(null);
  const [clueToken, setClueToken] = React.useState<string>('');
  const currentClue: Clue = getCurrentClue(currentGuestStatus);

  /**
   * Hooks
   * ---------------------------------------------------------------------------
   */

  /** Lookup guest. */
  React.useEffect(() => {
    if (!!currentGuest) {
      // lookup guest status
      const guestStatus = loadGuestStatus(currentGuest.id);
      setCurrentGuestStatus(guestStatus);
      console.log('loaded guest status');
    } else if (!!currentGuestStatus) {
      setCurrentGuestStatus(null);
      console.log('cleared guest status');
    }
  }, [currentGuest]);

  /**
   * Functions
   * ---------------------------------------------------------------------------
   */

  /** Save clue completion. */
  const checkToken = (token: string) => {
    console.log('check token', token);
    if (token === currentClue.token) {
      // solved! correct token!
      console.log('yes!');
    } else {
      // incorrect token!
      console.log('no!');
    }
  };

  /**
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <Box p='4'>
      <Flex direction='column' gap='4'>
        <Heading size='8'>Welcome, Adventurer.</Heading>
        <TextField.Root
          placeholder='Enter your ID'
          size='3'
          value={guestIdInputText}
          onChange={event => setGuestIdInputText(event.target.value)}
        >
          <TextField.Slot>
            <MoonIcon height='16' width='16' />
          </TextField.Slot>
          {guestIdInputText.length > 0 && (
            <TextField.Slot>
              <Tooltip content='Clear Text'>
                <IconButton
                  size='1'
                  variant='ghost'
                  onClick={event => setGuestIdInputText('')}
                >
                  <Cross2Icon height='16' width='16' />
                </IconButton>
              </Tooltip>
            </TextField.Slot>
          )}
        </TextField.Root>

        {!!currentGuest ? (
          <>
            <Heading>Hello, {currentGuest.id}.</Heading>
            <Heading>{`${currentClue.id}: ${currentClue.prompt}`}</Heading>

            <TextField.Root
              placeholder='Enter Clue Token'
              size='3'
              value={clueToken}
              onChange={event => setClueToken(event.target.value)}
            >
              <TextField.Slot>
                <LightningBoltIcon height='16' width='16' />
              </TextField.Slot>
              {clueToken.length > 0 && (
                <TextField.Slot>
                  <Tooltip content='Clear Text'>
                    <IconButton
                      size='1'
                      variant='ghost'
                      onClick={event => setClueToken('')}
                    >
                      <Cross2Icon height='16' width='16' />
                    </IconButton>
                  </Tooltip>
                </TextField.Slot>
              )}
            </TextField.Root>

            <Button
              disabled={clueToken.length != 3}
              onClick={event => checkToken(clueToken)}
            >
              <MagicWandIcon /> Check Clue Token
            </Button>

            <Text>{'currentClue: ' + JSON.stringify(currentClue)}</Text>
            <Text>
              {'currentGuestStatus: ' + JSON.stringify(currentGuestStatus)}
            </Text>
          </>
        ) : (
          <Heading>Identity Unknown</Heading>
        )}
      </Flex>
    </Box>
  );
}
