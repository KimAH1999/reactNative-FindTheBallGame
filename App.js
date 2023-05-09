//
//
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';

const FindTheBallGame = () => {
  // Define our state variables
  const [cups, setCups] = useState([]);
  const [result, setResult] = useState('');
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [ballIndex, setBallIndex] = useState(null); // New state variable to keep track of the cup with the ball
  const [difficultyLevel, setDifficultyLevel] = useState('');

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
  };
  
  // Function to generate random cups based on difficulty level and return the index of the cup with the ball
  const generateRandomCups = (difficultyLevel) => {
    const difficultyLevels = {easy: 3, normal: 4, hard: 5, expert: 6};
    const numberOfCups = difficultyLevels[difficultyLevel];
    const randomIndex = Math.floor(Math.random() * numberOfCups);
    setBallIndex(randomIndex); // Set the index of '🏀' in the cup for testing highscore
    const newCups = new Array(numberOfCups).fill(false);
    newCups[randomIndex] = true; // Set the cup with the ball to true
    return newCups;
  };
  
  // Function to handle player's selection
  const handleCupPress = (index) => {
    if (cups[index]) { // Check if the cup has the ball
      shuffleBall(); // Shuffle the ball to a different cup
      const newConsecutiveCorrect = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutiveCorrect);
      if (newConsecutiveCorrect > highScore) {
        setHighScore(newConsecutiveCorrect);
      }
      setResult(`Congratulations! You found the ball in cup ${index + 1}!`);
   
    } else {
      setConsecutiveCorrect(0);
      setResult(`Sorry, you lost. The ball was under cup ${ballIndex + 1}.`); // Display the index of the cup with the ball
      setCups(new Array(cups.length).fill(false)); // Show all cups to try again
    }
  };

  // Function to start a new game with the selected difficulty level
  const startNewGame = (difficultyLevel) => {
    const newCups = generateRandomCups(difficultyLevel);
    setCups(newCups);
    setResult('');
    setConsecutiveCorrect(0);
  };

  const resetNewGame = (selectedDifficultyLevel) => {
    setDifficultyLevel(selectedDifficultyLevel); // Set the difficulty level
    const newCups = generateRandomCups(selectedDifficultyLevel);
    setCups(newCups);
    setResult('');// Clear result
    shuffleBall();// Shuffle the ball to a different cup
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
        {result && (
          <TouchableOpacity style={styles.button} onPress={() => resetNewGame(difficultyLevel)}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        )}
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
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    backgroundColor: 'red',
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cupText: {
    fontSize: 30,
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
  resetButton: {
    backgroundColor: '#1E90FF',
    padding: 8,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 20,
  },  
});

export default FindTheBallGame;
