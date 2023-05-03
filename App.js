import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';

const FindTheBallGame = () => {
  // Define our state variables
  const [cups, setCups] = useState([false, false, false]); // false indicates no ball, true indicates ball
  const [result, setResult] = useState('');

  // Function to handle player's selection
  const handleCupPress = (index) => {
    // Create a new array with a random cup having a ball under it
    const newCups = [false, false, false];
    const randomIndex = Math.floor(Math.random() * 3);
    newCups[randomIndex] = true;

    // Update the cups state and set the result message
    setCups(newCups);
    if (index === randomIndex) {
      setResult('Congratulations! You found the ball!');
    } else {
      setResult('Sorry, you lost. Try again!');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.cupRow}>
        <TouchableOpacity style={styles.cup} onPress={() => handleCupPress(0)}>
          <Text style={styles.cupText}>{cups[0] ? '🏀' : ''}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cup} onPress={() => handleCupPress(1)}>
          <Text style={styles.cupText}>{cups[1] ? '🏀' : ''}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cup} onPress={() => handleCupPress(2)}>
          <Text style={styles.cupText}>{cups[2] ? '🏀' : ''}</Text>
        </TouchableOpacity>
      </View>
      {result ? <Text style={styles.result}>{result}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cupRow: {
    flexDirection: 'row',
  },
  cup: {
    backgroundColor: '#ccc',
    borderRadius: 50,
    width: 100,
    height: 100,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cupText: {
    fontSize: 40,
  },
  result: {
    fontSize: 20,
    marginTop: 20,
  },
});

export default FindTheBallGame;
