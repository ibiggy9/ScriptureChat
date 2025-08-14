import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  useWindowDimensions,
  SafeAreaView,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as AppleAuthentication from 'expo-apple-authentication';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Context/AuthContext';
import { AppContext } from '../App';
import {
  getAuth,
  signInWithCredential,
  signInWithCustomToken,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getDatabase, ref, set, onValue, forEach, push } from 'firebase/database';
import app from '../firebaseConfig';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Config from 'react-native-config';
import jwt_decode from 'jwt-decode';
import analytics from '@react-native-firebase/analytics';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export default function Login({ navigation }) {
  const [accessToken, setAccessToken] = useState();
  const db = getDatabase();
  const [user, setUser] = useState();

  const { width, height } = useWindowDimensions();
  const [signUp, setSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCheck, setShowCheck] = useState(false);
  const { login, loginError, setLoginError } = useAuth();

  const authent = getAuth(app);

  useEffect(() => {
    if (authent.currentUser) {
      navigation.navigate('Paywall');
    }
  }, [authent.currentUser]);

  //IOS: 340004188318-cmvqrd4pqgn5ggbk2ft3stf6lb81jp5l.apps.googleusercontent.com
  //WEB: 340004188318-qpr2s5494cub5l17c3ocbh3s9j1msfgu.apps.googleusercontent.com

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
    androidClientId: Config.GOOGLE_ANDROID_CLIENT_ID,
    useProxy: true,
  });

  GoogleSignin.configure({
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  });

  async function onGooglePress() {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    let cUser = await GoogleSignin.getCurrentUser();

    createUserWithEmailAndPassword(authent, cUser.user.email, cUser.user.id)
      .then(() => {
        // Account created successfully
      })
      .catch((error) => {
        if (error.code == 'auth/email-already-in-use') {
          signInWithEmailAndPassword(authent, cUser.user.email, cUser.user.id).catch((error) => {
            // Handle sign-in error
          });
        } else {
          setLoginError(error.message);
        }
      });
  }

  return (
    <View
      style={[
        { width: width, height: height + 20, backgroundColor: '#030B27' },
        tw`${Platform.OS == `android` && `mt-11`}`,
      ]}
    >
      <SafeAreaView style={[tw`flex-1 `, { height: height, backgroundColor: `#030B27` }]}>
        <View style={tw`flex-1`}>
          <View
            style={[tw`flex-1 justify-center items-center mx-10 ${Platform.OS == 'android' && ``}`]}
          >
            <>
              <View style={tw` mb-1 items-center flex-row`}>
                <MotiView
                  from={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'timing', duration: 1000 }}
                  style={tw`flex-row`}
                >
                  <Text style={tw` ml-3 text-white text-4xl text-center`}>Login To Continue</Text>
                </MotiView>
              </View>

              {loginError && (
                <View style={tw`flex-row items-baseline mb-3 font-light text-sm`}>
                  <AntDesign style={tw`mr-2`} name="exclamationcircle" size={24} color="white" />
                  <Text style={tw`text-white`}>{loginError}</Text>
                </View>
              )}
              <View style={tw``}>
                <MotiView
                  from={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'timing', duration: 1000 }}
                  style={tw`mt-4 flex-col items-center `}
                >
                  {!showCheck && (
                    <MotiView
                      from={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: 'timing', duration: 800 }}
                      style={tw` mt-5  justify-evenly items-center`}
                    >
                      {request && (
                        <TouchableOpacity
                          onPress={() => onGooglePress()}
                          style={[
                            tw`flex-row justify-center items-center bg-black p-3 px-7 rounded-2xl border border-slate-400`,
                            { height: 70, width: 300 },
                          ]}
                        >
                          <AntDesign name="google" size={25} color="white" />
                          <Text style={tw`text-white ml-4 text-xl font-bold`}>
                            Sign In With Google
                          </Text>
                        </TouchableOpacity>
                      )}
                      {Platform.OS !== 'android' && (
                        <View
                          style={[
                            { width: 300, height: 70 },
                            tw`mt-5 border border-slate-400 rounded-2xl bg-black items-center justify-center`,
                          ]}
                        >
                          <AppleAuthentication.AppleAuthenticationButton
                            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                            cornerRadius={5}
                            style={[{ width: 250, height: 65 }, tw``]}
                            onPress={async () => {
                              await analytics().logLogin({ method: 'Apple' });
                              try {
                                const credential = await AppleAuthentication.signInAsync({
                                  requestedScopes: [
                                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                                  ],
                                })
                                  .then((userToken) => {
                                    if (!userToken.email) {
                                      var decoded = jwt_decode(userToken.identityToken);

                                      signInWithEmailAndPassword(
                                        authent,
                                        decoded.email,
                                        userToken.user,
                                      ).catch((error) => {
                                        if (error.code == 'auth/user-not-found') {
                                          createUserWithEmailAndPassword(
                                            authent,
                                            decoded.email,
                                            userToken.user,
                                          );
                                        }
                                      });
                                    } else {
                                      createUserWithEmailAndPassword(
                                        authent,
                                        userToken.email,
                                        userToken.user,
                                      ).then(() => {
                                        return;
                                      });
                                    }
                                  })
                                  .catch((error) => {
                                    setLoginError(error.message);
                                    if (error.message == 'auth/missing-email') {
                                    }
                                  });
                              } catch (e) {
                                setLoginError(e);
                                if (e.code === 'ERR_REQUEST_CANCELED') {
                                  // User cancelled the authentication
                                } else {
                                  // handle other errors
                                }
                              }
                            }}
                          />
                        </View>
                      )}
                    </MotiView>
                  )}
                  <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mt-10`}>
                    <Text style={tw`text-center text-white text-lg font-bold`}>Go Back</Text>
                  </TouchableOpacity>
                </MotiView>
              </View>
            </>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
