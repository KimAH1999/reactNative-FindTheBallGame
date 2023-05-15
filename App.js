//
//
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from 'react-native';
import * as Animatable from 'react-native-animatable';

const FindTheBallGame = () => {
  // Define our state variables
  const [cups, setCups] = useState(['', '', '']);
  const [result, setResult] = useState('');
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [ballIndex, setBallIndex] = useState(null);
  const [difficultyLevel, setDifficultyLevel] = useState('');

 // Start a new game with the selected difficulty level
  const startNewGame = (selectedDifficultyLevel) => {
    setDifficultyLevel(selectedDifficultyLevel);
    const newCups = generateRandomCups(selectedDifficultyLevel);
    setCups(newCups);
    setResult('');
    setConsecutiveCorrect(0);
    setBallIndex(newCups.indexOf(true)); // set the ball index to the index of the cup with the ball
  };

  const generateRandomCups = (difficultyLevel) => {
    const difficultyLevels = {easy: 3, normal: 4, hard: 5, expert: 6};
    const numberOfCups = difficultyLevels[difficultyLevel];
    const randomIndex = Math.floor(Math.random() * numberOfCups);
    
    const newCups = new Array(numberOfCups).fill(false);
    newCups[randomIndex] = true;
    return newCups;
  };

  const handleCupPress = (index) => {
    if (cups[index]) {
      
      const newConsecutiveCorrect = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutiveCorrect);
  
      if (newConsecutiveCorrect > highScore) {
        setHighScore(newConsecutiveCorrect);
      }
      setResult(`🏆Congratulations! You found the ball in cup ${index + 1}!`);
      setCups(prevCups => {
        const newCups = [...prevCups];
        newCups[ballIndex] = false; // set the value of cups[ballIndex] to false to hide the ball
        newCups[index] = true; 
        setBallIndex(newCups.indexOf(true)); // set the ball index to the index of the cup with the ball
        return newCups;
      });
    } else {
      setConsecutiveCorrect(0);
      setResult(`Sorry, you lost. The ball was under cup ${ballIndex + 1}.`);
      const newCups = cups.map((cup, i) => (i === ballIndex ? true : false));
      newCups[ballIndex] = true;
      setCups(newCups);
    }
  };  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find the Ball Game</Text>
      <Text style={styles.subtitle}>Choose a game level to start challenging your guessing game to find the ball.</Text>
      <View style={styles.cupRow}>
        {cups?.map((cup, index) => {
          const isBall = index === ballIndex;
          return (
            <TouchableOpacity key={index} onPress={() => handleCupPress(index)}>
              <Animatable.View style={[styles.cup]}>
                {isBall ? (
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    position: 'absolute',
    top: 170,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 3,
    borderColor: 'yellow',
    backgroundColor: 'maroon',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'black',
    color: 'white',
    padding: 50,
    zIndex: 2,
  },
  cupRow: {
    marginTop: -50,
    flexDirection: 'row',
    justifyContent: 'center',
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
    marginTop: -30,
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
    marginTop: 30,
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

export default FindTheBallGame;
