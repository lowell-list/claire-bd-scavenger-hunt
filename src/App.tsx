import React, { Fragment } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Flex,
  Heading,
  IconButton,
  Text,
  TextField,
  Tooltip,
} from '@radix-ui/themes';
import {
  CheckCircledIcon,
  Cross2Icon,
  LightningBoltIcon,
  MagicWandIcon,
  MoonIcon,
} from '@radix-ui/react-icons';
import { Guest, GuestStatus } from '/src/types';
import { clues, tokenFeedbackText } from '/src/data';
import {
  findClueStatus,
  getNextUnsolvedClue,
  lookupGuest,
  loadGuestStatusFromLocalStorage,
  saveGuestStatusToLocalStorage,
  incrementIncorrectGuessCount,
  setClueCompletion,
  getShuffledClueIdsForGuest,
  playSound,
  shuffleArray,
} from '/src/utils';
import clsx from 'clsx';

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

  // localStorage.clear();

  // the guest ID in the input TextField
  const [guestIdInputText, setGuestIdInputText] = React.useState<string>('');

  // the current Guest object
  const currentGuest: Guest | undefined = React.useMemo(
    () => lookupGuest(guestIdInputText),
    [guestIdInputText]
  );

  // the current GuestStatus object
  const [currentGuestStatus, setCurrentGuestStatus] =
    React.useState<GuestStatus | null>(null);

  // current clue the Guest is working on; null if all clues are solved!
  const currentClue = React.useMemo(
    () => getNextUnsolvedClue(currentGuestStatus),
    [currentGuestStatus]
  );

  // uniquely shuffled clue IDs for the current guest
  const shuffledClueIds: string[] = React.useMemo(() => {
    return currentGuest
      ? getShuffledClueIdsForGuest(
          currentGuest.id,
          clues.map(clue => clue.id)
        )
      : [];
  }, [currentGuest]);
  const indexOfCurrentClueId = !!currentClue
    ? shuffledClueIds.findIndex(clueId => clueId === currentClue.id)
    : -1;
  const completedShuffledClueIds =
    indexOfCurrentClueId !== -1
      ? shuffledClueIds.slice(0, indexOfCurrentClueId + 1)
      : shuffledClueIds;

  // clue token text in the input TextField
  const [clueTokenText, setClueTokenText] = React.useState<string>('');

  // token entry feedback
  const [tokenFeedback, setTokenFeedback] = React.useState<string>('');

  /**
   * Hooks
   * ---------------------------------------------------------------------------
   */

  /** Lookup guest. */
  React.useEffect(() => {
    if (!!currentGuest) {
      // lookup guest status
      const guestStatus = loadGuestStatusFromLocalStorage(currentGuest.id);
      setCurrentGuestStatus(guestStatus);
      playSound('accessGranted');
    } else if (!!currentGuestStatus) {
      setCurrentGuestStatus(null);
      console.log('cleared guest status');
    }
  }, [currentGuest]);

  /** Watch for success! */
  React.useEffect(() => {
    if (!!currentGuest && !!currentGuestStatus && !currentClue) {
      playSound('success');
    }
  }, [currentGuest, currentGuestStatus, currentClue]);

  /**
   * Functions
   * ---------------------------------------------------------------------------
   */

  /** Save clue completion. */
  const checkToken = (token: string) => {
    // check if token matches
    const isCorrect = token.toUpperCase() === currentClue.token.toUpperCase();

    // play sound
    playSound(isCorrect ? 'accessGranted' : 'accessDenied');

    // set feedback text
    const feedbackArray = isCorrect
      ? tokenFeedbackText.success
      : tokenFeedbackText.fail;
    const selectedFeedbackText = shuffleArray(feedbackArray)[0];
    setTokenFeedback(selectedFeedbackText);

    // update GuestStatus accordingly
    setTimeout(() => {
      const newGuestStatus = isCorrect
        ? setClueCompletion(currentGuestStatus, currentClue)
        : incrementIncorrectGuessCount(currentGuestStatus, currentClue);
      setCurrentGuestStatus(newGuestStatus);
      saveGuestStatusToLocalStorage(newGuestStatus);
      setTokenFeedback('');
      setClueTokenText('');
    }, 2000);
  };

  /**
   * Render
   * ---------------------------------------------------------------------------
   */

  return (
    <Container p='4'>
      <Flex direction='column' gap='4'>
        <Flex direction='row' justify='between' align='center'>
          <Heading
            size='8'
            className={clsx(
              'welcomeHeader',
              !!currentGuest && 'welcomeGuestIdentified'
            )}
          >
            Welcome, Adventurer.
          </Heading>
          {!!currentGuest && (
            <Flex gap='3' align='center'>
              <Text>Adventurer: {currentGuest.id}</Text>
              <Button
                color='blue'
                onClick={event => {
                  setGuestIdInputText('');
                  playSound('accessGranted');
                }}
              >
                <MagicWandIcon /> Exit
              </Button>
            </Flex>
          )}
        </Flex>
        <Flex
          className={clsx(
            'welcomeInput',
            !!currentGuest && 'welcomeGuestIdentified'
          )}
          direction='row'
          align='center'
          gap='4'
        >
          <Heading size='6'>Please enter your ID:</Heading>
          <TextField.Root
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
        </Flex>

        {!!currentGuest && !!currentGuestStatus && (
          <>
            <Grid columns='auto 1fr auto auto' gap='3' pt='4'>
              <Heading>#</Heading>
              <Heading>Clue</Heading>
              <Heading>Status</Heading>
              <Heading>Miss #</Heading>

              {completedShuffledClueIds
                .map(clueId => ({
                  clue: clues.find(clue => clue.id === clueId),
                  clueStatus: findClueStatus(currentGuestStatus, clueId),
                }))
                .map(({ clue, clueStatus }, index) => {
                  return (
                    <Fragment key={`clue-detail-${clue.id}`}>
                      <Text align='center'>{index + 1}</Text>
                      <Text>{clue.prompt}</Text>
                      <Flex justify='center' align='start'>
                        {clueStatus && clueStatus.completedAt ? (
                          <CheckCircledIcon
                            height='20'
                            width='20'
                            color='green'
                          />
                        ) : (
                          <Text color='bronze'>?</Text>
                        )}
                      </Flex>
                      <Flex justify='center' align='start'>
                        {!!clueStatus ? (
                          <Text
                            align='center'
                            color={
                              clueStatus.incorrectGuessCount > 0
                                ? 'red'
                                : 'green'
                            }
                          >
                            {clueStatus.incorrectGuessCount}
                          </Text>
                        ) : (
                          <Text align='center'>0</Text>
                        )}
                      </Flex>
                    </Fragment>
                  );
                })}
            </Grid>

            {!!currentClue ? (
              <Flex gap='3' align='center'>
                <TextField.Root
                  placeholder='Enter Clue Token'
                  size='3'
                  value={clueTokenText}
                  onChange={event => {
                    setClueTokenText(event.target.value);
                    setTokenFeedback('');
                  }}
                >
                  <TextField.Slot>
                    <LightningBoltIcon height='16' width='16' />
                  </TextField.Slot>
                  {clueTokenText.length > 0 && (
                    <TextField.Slot>
                      <Tooltip content='Clear Text'>
                        <IconButton
                          size='1'
                          variant='ghost'
                          onClick={event => {
                            setClueTokenText('');
                            setTokenFeedback('');
                          }}
                        >
                          <Cross2Icon height='16' width='16' />
                        </IconButton>
                      </Tooltip>
                    </TextField.Slot>
                  )}
                </TextField.Root>

                <Button
                  disabled={clueTokenText.length != 3 || !!tokenFeedback}
                  onClick={event => checkToken(clueTokenText)}
                >
                  <MagicWandIcon /> Check Clue Token
                </Button>
                <Text>{tokenFeedback}</Text>
              </Flex>
            ) : (
              <>
                <Heading>All clues solved!</Heading>
                <Heading>
                  Total missed:{' '}
                  {JSON.stringify(
                    completedShuffledClueIds.reduce(
                      (accumulator: number, clueId) =>
                        accumulator +
                        findClueStatus(currentGuestStatus, clueId)
                          .incorrectGuessCount,
                      0
                    )
                  )}
                </Heading>
              </>
            )}
          </>
        )}
      </Flex>
    </Container>
  );
}
