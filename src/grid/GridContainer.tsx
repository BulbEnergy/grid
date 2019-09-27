import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';
import { Grid, GridProps, VoteCoords } from './Grid';
import firebase from '../firebase/firebase';

export type Role = 'user' | 'admin';

export interface GridContainerProps {
  id: string;
  rows: number;
  cols: number;
  votes: { [key: string]: Vote };
  content: string[];
  voteInProgress: boolean;
  userId: string;
  userRole: Role;
}

export interface Vote {
  x: number;
  y: number;
  emoji: string;
}

const EMOJI_LIST: string[] = [
  '🐹',
  '🐰',
  '🐶',
  '🐺',
  '🦊',
  '🐸',
  '🙈',
  '🙉',
  '🙊',
  '🐨',
  '🦔',
  '🦌',
  '🐯',
  '🦁',
  '🦓',
  '🦒',
  '🐴',
  '🐷',
  '🐻',
  '🐼',
  '🐲',
  '🦄',
  '🦍',
  '🐗',
];

function randomEmoji(): string {
  return EMOJI_LIST[Math.floor(Math.random() * EMOJI_LIST.length)];
}

const GridContainer: React.FunctionComponent<GridContainerProps> = (
  props: GridContainerProps,
) => {
  const {
    id,
    userId,
    voteInProgress,
    rows,
    cols,
    content,
    votes,
    userRole,
  } = props;

  // Remote state
  const [myVote, setMyVote] = useState<Vote | undefined>(votes[userId]);
  const [currVotes, setCurrentVotes] = useState<{ [key: string]: Vote }>(votes);
  const [voting, setVoting] = useState<boolean>(voteInProgress);

  const votesDb = firebase.votesDb(id);
  const votingDb = firebase.votingDb(id);

  useEffect(() => {
    const updateVotes = (snapshot: firebase.database.DataSnapshot) => {
      const newVotes = snapshot.exists() ? snapshot.val() : {};
      if (!_.isEqual(newVotes, currVotes)) {
        setCurrentVotes(newVotes);
      }
    };

    votesDb.on('value', updateVotes);
    return () => votesDb.off('value', updateVotes);
  });

  useEffect(() => {
    const updateVoting = (snapshot: firebase.database.DataSnapshot) => {
      if (snapshot.exists() && snapshot.val() !== voting) {
        const newVoting: boolean = snapshot.val();
        if (newVoting) {
          setMyVote(undefined);
        }
        setVoting(newVoting);
      }
    };

    votingDb.on('value', updateVoting);
    return () => votingDb.off('value', updateVoting);
  });

  function handleTouch(coords: VoteCoords) {
    // Voting not in-progress or already voted this time
    if (!voting || myVote) {
      return;
    }

    const vote: Vote = {
      x: coords.x,
      y: coords.y,
      emoji: randomEmoji(),
    };

    setMyVote(vote);
    votesDb.child(userId).set(vote);
  }

  function handleAdminButton() {
    votingDb.set(true);
    votesDb.set({});
    setTimeout(() => votingDb.set(false), 5000);
  }

  const gridProps: GridProps = {
    id,
    rows,
    cols,
    content,
    myVote,
    isAdmin: userRole === 'admin',
    votes: Object.values(currVotes).filter(
      (vote: Vote): boolean => !_.isEqual(vote, myVote),
    ),
    voteInProgress: voting,
    onAdminButtonClicked: handleAdminButton,
    onClick: handleTouch,
  };

  return <Grid {...gridProps} />;
};

export { GridContainer };
