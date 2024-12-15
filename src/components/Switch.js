import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Switch } from 'react-native-switch';
import { ThemeContext } from '../context/ThemeContext';


const Switch = () => {
    const { isDark, setIsDark } = useContext(ThemeContext);

  return (
    <Switch 
      value={isDark}
      onValueChange={setIsDark}
      trackColor={{ false: '#767577', true: '#81b0ff' }}
      thumbColor={isDark ? '#f5dd4b' : '#f4f3f4'}
      ios_backgroundColor="#3e3e3e"
    />
  )
}

export default Switch

const styles = StyleSheet.create({})