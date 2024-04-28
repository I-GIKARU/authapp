import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, ActivityIndicator } from 'react-native';
import { Client, Account, ID } from "react-native-appwrite"

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("662d58d900385916c5cc")
      .setPlatform("com.auth.app");

    const account = new Account(client);
    setUserAccount(account);
  }, []);

  const [userAccount, setUserAccount] = useState(null);

  const createAccount = async () => {
    setLoading(true);
    try {
      await userAccount.create(ID.unique(), email, password, name);
      console.log("Account created");
    } catch (error) {
      setError("Failed to create account: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    setLoading(true);
    try {
      await userAccount.createSession(email, password);
      const userDetails = await userAccount.get();
      setUserDetails(userDetails);
      console.log(userDetails);
    } catch (error) {
      setError("Failed to sign in: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await userAccount.deleteSessions();
      setUserDetails(null);
      console.log("Signed out");
    } catch (error) {
      setError("Failed to sign out: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={setName}
        value={name}
      />
      <Button title="Create Account" onPress={createAccount} disabled={loading} />
      <Button title="Sign In" onPress={signIn} disabled={loading} />
      <Button title="Sign Out" onPress={signOut} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});
