//
//
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

const FindTheBallGame = () => {
  // Define our state variables
  const [cups, setCups] = useState(['', '', '']);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showBall, setShowBall] = useState(false);
  const [showBallTimeout, setShowBallTimeout] = useState(null);
  const [result, setResult] = useState('');
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [highScores, setHighScores] = useState({
    easy: 0,
    normal: 0,
    hard: 0,
    expert: 0,
  });
  const [ballIndex, setBallIndex] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);

  useEffect(() => {
    if (gameOver) {
      setIsTimerRunning(false);
      clearInterval(timerInterval);
    }
  }, [gameOver]);

  const startTimer = () => {
    setTimer(0); // Reset the timer
    setIsTimerRunning(true);
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);
    // Store the interval ID to clear the interval later
    setTimerInterval(interval);
  };  

  const handleCupPress = async(index) => {
    if (gameOver) {
      return; // Disable cup press functionality when the game is over
    }
    // Win or Lose logic
    if (cups[index]) {
      const newConsecutiveCorrect = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutiveCorrect);
      
      if (newConsecutiveCorrect > highScores[difficultyLevel]) {
        const newHighScores = { ...highScores };
        newHighScores[difficultyLevel] = newConsecutiveCorrect;
        setHighScores(newHighScores);
    
        try {
          await saveHighScore(difficultyLevel, newConsecutiveCorrect);
        } catch (error) {
          console.log('Error saving high score:', error);
        }
      }

      setShowBall(true);
      setResult(`🏆Congratulations! You found the ball in cup ${index + 1}!`);
      setCups(prevCups => {
        const newCups = [...prevCups];
        newCups[ballIndex] = false; // set the value of cups[ballIndex] to false to hide the ball
        newCups[index] = true; 
        setBallIndex(newCups.indexOf(true)); // set the ball index to the index of the cup with the ball
        return newCups;
      });
      setTimeout(() => {
        const newCups = generateRandomCups(difficultyLevel); // Generate new cups with a random ball index
        setCups(newCups);
        setBallIndex(newCups.indexOf(true));
        setShowBall(false);
      }, 1000);
    } else {
      setConsecutiveCorrect(0);
      setResult(`Sorry, you lost. The ball was under cup ${ballIndex + 1}.`);
      const newCups = cups.map((cup, i) => (i === ballIndex ? true : false));
      newCups[ballIndex] = true;
      setCups(newCups);
      setGameOver(true); // Set the game over flag to true
      setIsTimerRunning(false); // Stop the timer
      clearInterval(timerInterval); // Clear the timer interval

      // Show the ball for 1 second before hiding it
      setShowBall(true);
      const timeout = setTimeout(() => {
        setShowBall(false);
      }, 1000);
      setShowBallTimeout(timeout);
    }
  };

  const saveHighScore = (difficultyLevel, score) => {
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem(difficultyLevel, score.toString())
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  // Start a new game with the selected difficulty level
  const startNewGame = async (selectedDifficultyLevel) => {
    setDifficultyLevel(selectedDifficultyLevel);
    const newCups = generateRandomCups(selectedDifficultyLevel);
    setCups(newCups);
    startTimer();
    setShowSubtitle(false);
    setResult('');
    setConsecutiveCorrect(0);
    setBallIndex(newCups.indexOf(true));
    setGameOver(false);
  
    try {
      const storedHighScore = await AsyncStorage.getItem(selectedDifficultyLevel);
      if (storedHighScore !== null) {
        setHighScores(prevHighScores => ({
          ...prevHighScores,
          [selectedDifficultyLevel]: parseInt(storedHighScore),
        }));
      }
    } catch (error) {
      console.log('Error retrieving high score:', error);
    }
  
    setShowBall(true);
    setTimeout(() => {
      setShowBall(false);
    }, 1000);
  };

  const generateRandomCups = (difficultyLevel) => {
    const difficultyLevels = {easy: 3, normal: 4, hard: 5, expert: 6};
    const numberOfCups = difficultyLevels[difficultyLevel];
    const randomIndex = Math.floor(Math.random() * numberOfCups);
    
    const newCups = new Array(numberOfCups).fill(false);
    newCups[randomIndex] = true;
    return newCups;
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find the Ball Game</Text>
      {showSubtitle && (
      <Text style={styles.subtitle}>
        Choose a game level to start challenging your guessing game to find the ball.</Text>
      )}
      <View style={styles.cupRow}>
        {cups?.map((cup, index) => {
          const isBall = index === ballIndex;
          return (
            <TouchableOpacity key={index} onPress={() => handleCupPress(index)}>
              <Animatable.View style={[styles.cup]}>
                {showBall && isBall ? (
                  <Text>🟡</Text>
                ) : (
                  <Text>{cup}</Text>
                )}
              </Animatable.View>
            </TouchableOpacity>
          );
        })}
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
        <Text style={styles.resultText}>Time: {timer} seconds</Text>
        <View style={styles.resultRow}>
        <Text style={styles.resultText}>{result}</Text>
        <Text style={styles.resultText}>High Score: {highScores[difficultyLevel]}</Text>
        <Text style={styles.resultText}>Consecutive Correct: {consecutiveCorrect}</Text>
      </View>
    </View>
  );
};

export default FindTheBallGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    marginBottom: 80,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 3,
    borderColor: 'yellow',
    backgroundColor: 'maroon',
  },
  subtitle: {
    marginTop: 0,
    marginBottom: -80,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'black',
    color: 'white',
    padding: 50,
    zIndex: 2,
  },
  cupRow: {
    marginTop: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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
    marginTop: -50,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  button: {
    backgroundColor: 'maroon',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
  },
  resultRow: {
    marginTop: 10,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 20,
    marginBottom: 10,
  },
});