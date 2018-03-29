/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import ReactNativeFbsdk from 'react-native-fbsdk'



type Props = {}

type State = {
  fbResponse: ?Object,
  fbError: ?Object
}

export default class App extends Component<Props, State> {


  state = {}


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Button
          style={styles.button}
          onPress={this.login}
          title='Login with Facebook'
          />
        <Text style={styles.result}>
          Result: {JSON.stringify(this.state.fbResponse)}
        </Text>
        <Text style={styles.result}>
          Error: {JSON.stringify(this.state.fbError)}
        </Text>
      </View>
    )
  }


  login() {
    loginWithFacebook()
      .then((result) => {
        this.setState({ fbResponse: result })
      })
      .catch((err) => {
        this.setState({ fbError: err })
      })
  }


}

const loginWithFacebook = () => {

  const permissions = ['email', 'user_birthday']

  // ReactNativeFbsdk.LoginManager.setLoginBehavior('WEB_ONLY')
  return ReactNativeFbsdk.LoginManager.logInWithReadPermissions(permissions)
    .then((resp) => {

      if (
        resp.isCancelled
        ||
        _.get(resp.declinedPermissions, 'length')
      ) {
        throw new Error('User cancelled login')
      }

      console.log('Logged in with Facebook %o', resp)

      return ReactNativeFbsdk.AccessToken.getCurrentAccessToken()
        .then((data) => {

          console.log('Received Facebook access data %o', data)

          return {
            authResponse: {
              expiresIn   : data.expirationTime - Date.now(),
              accessToken : data.accessToken,
            }
          }

        })

    })
    .catch((err) => {
      console.error('Unable to login with Facebook: %o', err)
    })

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
  },
  button: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 20,
  },
  result: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 10,
  },
});
