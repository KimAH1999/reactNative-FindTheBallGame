import React, { useState } from 'react';

const CUPS = ['cup1', 'cup2', 'cup3'];
const WINNING_CUP = CUPS[Math.floor(Math.random() * CUPS.length)];

const FindTheBallGame = () => {
  const [feedback, setFeedback] = useState('');

  const handleCupPress = (cup) => {
    if (cup === WINNING_CUP) {
      setFeedback('You found the ball!');
    } else {
      setFeedback('Sorry, try again!');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Find the Ball</h1>
      <div style={styles.cupsContainer}>
        {CUPS.map((cup) => (
          <button key={cup} style={styles.cup} onClick={() => handleCupPress(cup)}>
            <div style={cup === WINNING_CUP ? styles.ball : null} />
          </button>
        ))}
      </div>
      <p style={styles.feedback}>{feedback}</p>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cupsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cup: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'gray',
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ball: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'red',
  },
  feedback: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
};

export default FindTheBallGame;
