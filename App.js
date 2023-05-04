import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';

const FindTheBallGame = () => {
  // Define our state variables
  const [cups, setCups] = useState([]);
  const [result, setResult] = useState('');
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [ballIndex, setBallIndex] = useState(null); // New state variable to keep track of the cup with the ball

  // Function to generate random cups based on difficulty level and return the index of the cup with the ball
  const generateRandomCups = (difficultyLevel) => {
    let numberOfCups = 0;

    if (difficultyLevel === 'easy') {
      numberOfCups = 3;
    } else if (difficultyLevel === 'normal') {
      numberOfCups = 4;
    } else if (difficultyLevel === 'hard') {
      numberOfCups = 5;
    } else if (difficultyLevel === 'expert') {
      numberOfCups = 6;
    }

    const randomIndex = Math.floor(Math.random() * numberOfCups);
    setBallIndex(randomIndex); // Set the index of the cup with the ball
    const newCups = new Array(numberOfCups).fill(false);
    newCups[randomIndex] = true; // Set the cup with the ball to true
    return newCups;
  }

  // Function to shuffle the ball to a different cup
  const shuffleBall = () => {
    const newCups = [...cups];
    let currentBallIndex = ballIndex;
    let newBallIndex = Math.floor(Math.random() * newCups.length);

    // Make sure the new ball index is different from the current ball index
    while (newBallIndex === currentBallIndex) {
      newBallIndex = Math.floor(Math.random() * newCups.length);
    }

    // Shuffle the ball to the new cup
    newCups[currentBallIndex] = false;
    newCups[newBallIndex] = true;
    setBallIndex(newBallIndex);

    setCups(newCups);
  }

  // Function to handle player's selection
  const handleCupPress = (index) => {
    if (cups[index]) { // Check if the cup has the ball
      shuffleBall(); // Shuffle the ball to a different cup
      const newConsecutiveCorrect = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutiveCorrect);
      if (newConsecutiveCorrect > highScore) {
        setHighScore(newConsecutiveCorrect);
      }
      setResult('Congratulations! You found the ball!');
    } else {
      setConsecutiveCorrect(0);
      setResult(`Sorry, you lost. The ball was under cup ${ballIndex + 1}.`); // Display the index of the cup with the ball
      setCups(generateRandomCups()); // Start a new game with the same difficulty level
    }
  };

  // Function to start a new game with the selected difficulty level
  const startNewGame = (difficultyLevel) => {
    const newCups = generateRandomCups(difficultyLevel);
    setCups(newCups);
    setResult('');
    setConsecutiveCorrect(0);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.cupRow}>
        {cups.map((cup, index) => (
          <TouchableOpacity key={index} style={styles.cup} onPress={() => handleCupPress(index)}>
            <Text style={styles.cupText}>{index === ballIndex ? '🏀' : ''}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => startNewGame('easy')}>
          <Text style={styles.buttonText}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => startNewGame('normal')}>
          <Text style={styles.buttonText}>Normal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => startNewGame('hard')}>
          <Text style={styles.buttonText}>Hard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => startNewGame('expert')}>
          <Text style={styles.buttonText}>Expert</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.resultRow}>
        <Text style={styles.resultText}>{result}</Text>
        <Text style={styles.resultText}>High Score: {highScore}</Text>
        <Text style={styles.resultText}>Consecutive Correct: {consecutiveCorrect}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cupRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  cup: {
    backgroundColor: '#D9D9D9',
    padding: 50,
    borderRadius: 50,
  },
  cupText: {
    fontSize: 50,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  resultRow: {
    alignItems: 'center',
  },
  resultText: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default FindTheBallGame;
