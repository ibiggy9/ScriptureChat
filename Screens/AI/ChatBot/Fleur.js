import {
  View,
  Text,
  useWindowDimensions,
  Easing,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  AppState,
  Pressable,
  SafeAreaView,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import tw from 'twrnc';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { TypingAnimation } from 'react-native-typing-animation';
import useRevHook from '../../../Components/useRevHook';
import { getAuth } from 'firebase/auth';
import app from '../../../firebaseConfig';
import { useFleur } from '../../../Context/FleurContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { useAuth } from '../../../Context/AuthContext';
import axios from 'axios';
import Config from 'react-native-config';
import * as Crypto from 'expo-crypto';

export default function Fleur({ navigation }) {
  const { isProMember } = useRevHook();
  const [appState, setAppState] = useState(AppState.currentState);

  const auth = getAuth(app);

  const {
    isFleur,
    setIsFleur,
    scrollToTop,
    usageCount,
    exercises,
    chatMenuShow,
    setChatMenuShow,
    fleurHelperRun,
    setFleurHelperRun,
    textInputRef,
    abortControllerRef,
    width,
    height,
    text,
    setText,
    loading,
    setLoading,
    isFocused,
    setIsFocused,
    clicked,
    setClicked,
    scrollRef,
    transcriptRef,
    error,
    setError,
    fleurResponse,
    setFleurResponse,
    conversationString,
    setConversationString,
    helper,
    setHelper,
    getChatData,
    setUsageCount,
    appStateVisible,
    setAppStateVisible,

    AndroidKey,
    initialSuggestions,
    runFocus,
    runBlur,
    storeChatData,
    clear,
    classifier,
    fleurHelper,
    fleurResponseFunc,
    processFleurResponse,
    addMessage,
    scrollToBottom,
    reTry,
    cancelRun,
    cancelFleurRequest,
    userLeft,
    setUserLeft,
    messageList,
    setMessageList,
    Message,
    setKeyboardHeight,
    keyboardHeight,
    startSelection,
    setStartSelection,
    approaches,
    denomination,
    primeFocus,
    knowledge,
  } = useFleur();

  useEffect(() => {
    getChatData();
  }, []);

  useEffect(() => {
    scrollToTop();
    heartbeat();
  }, []);

  useEffect(() => {
    if (!isProMember) {
      deleteProfile();
    }
  }, []);

  const { accessToken, setAccessToken } = useAuth();

  async function deleteProfile() {
    await AsyncStorage.removeItem('userPreferences');
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        heartbeat();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  async function heartbeat() {
    try {
      const deviceId = await DeviceInfo.getUniqueId();
      const buildId = await DeviceInfo.getBuildId();
      const combinedId = `${deviceId}:${buildId}`;
      const hashedId = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        combinedId,
      );
      const response = await axios.post(`${Config.API_BASE_URL}/heartbeat`, {
        device_id: hashedId,
      });
      setAccessToken(response.data.access_token);
    } catch (error) {}
  }

  return (
    <>
      {Platform.OS == 'ios' && (
        <View
          style={[
            tw` flex-1 ${Platform.OS == 'android' ? `bg-black` : `bg-slate-900`}`,
            { height: height },
          ]}
        >
          <SafeAreaView style={tw`h-full ${Platform.OS == 'android' && ``} `}>
            <View style={tw`justify-start items-center `}>
              {Platform.OS == 'android' ? (
                <Text
                  style={tw`text-orange-300 text-2xl text-center ${Platform.OS == 'android' && ``}`}
                >
                  Chat with Fleur
                </Text>
              ) : (
                <Text style={tw`text-orange-300 text-2xl text-center `}>
                  <FontAwesome5 name="cross" size={24} color="#E5962D" /> ScriptureChat{' '}
                  {isProMember && 'Premium'}
                </Text>
              )}
              {!isProMember && (
                <Text style={[tw`text-white`, {}]}>
                  {usageCount >= 0 ? usageCount : 0} Message{usageCount != 1 && 's'} Remaining On
                  Free Tier
                </Text>
              )}
              {isProMember && (denomination || knowledge || primeFocus) && (
                <Text style={tw`text-orange-300`}>Running with your custom profile</Text>
              )}
            </View>

            <ScrollView
              contentContainerStyle={tw`pb-100`}
              extraScrollHeight={Platform.OS == 'ios' ? 50 : 0}
              scrollToEnd={{ animated: true }}
              style={tw` `}
              onContentSizeChange={() =>
                messageList.length !== 1 ? scrollRef.current.scrollToEnd({ animated: true }) : null
              }
              scrollEventThrottle={16}
              ref={scrollRef}
              keyboardShouldPersistTaps="handled"
            >
              {messageList}

              {userLeft && (
                <View style={tw`mr-30 px-5 py-3`} onPress={() => clear()}>
                  <Text style={tw`text-white`}>
                    Please don't leave the app while Fleur is responding. Please send your message
                    again.
                  </Text>
                </View>
              )}
              {loading && (
                <View style={tw`ml-10 mt-10 mb-20`}>
                  <TypingAnimation
                    dotStyles={tw`mb-3`}
                    dotColor="silver"
                    dotMargin={15}
                    dotSpeed={0.2}
                    dotRadius={5}
                    dotX={20}
                  />
                </View>
              )}
              {error && (
                <View style={tw`mr-30 px-5 py-3 mb-2 `} onPress={() => clear()}>
                  <Text style={tw`text-white`}>{error}</Text>
                </View>
              )}
              {messageList.length > 1 && !loading && (
                <TouchableOpacity style={tw`mr-30 ml-4 py-1 mb-5`} onPress={() => clear()}>
                  <Text style={tw`text-white `}>Close this conversation</Text>
                </TouchableOpacity>
              )}

              {messageList.length === 1 && !loading && chatMenuShow == false && (
                <>
                  <Text style={[tw`ml-4 mb-1 text-white font-bold mt-3`, { fontSize: 17 }]}>
                    Some things you can try: {startSelection != null && '(Tap to send)'}
                  </Text>
                  {startSelection == null && (
                    <View>
                      <View style={tw`flex-col  ml-4`}>
                        <TouchableOpacity
                          onPress={() => setStartSelection('exercises')}
                          style={[
                            tw`border border-white  rounded-2xl justify-center items-center my-2 px-2`,
                            { width: width / 1.5, height: height / 20 },
                          ]}
                        >
                          <Text style={[tw`text-white  text-center`, { fontSize: 16 }]}>
                            Spiritual Growth & Nourishment
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setStartSelection('scenarios')}
                          style={[
                            tw`border border-white rounded-2xl justify-center items-center my-2`,
                            { width: width / 1.5, height: height / 20 },
                          ]}
                        >
                          <Text style={[tw`text-white  text-center`, { fontSize: 16 }]}>
                            Academic & Theological Study
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setStartSelection('approaches')}
                          style={[
                            tw`border border-white rounded-2xl justify-center items-center my-2`,
                            { width: width / 1.5, height: height / 20 },
                          ]}
                        >
                          <Text style={[tw`text-white  text-center`, { fontSize: 16 }]}>
                            Comfort & Support
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {startSelection == 'scenarios' && (
                    <>
                      <View>
                        <FlatList
                          data={initialSuggestions}
                          showsHorizontalScrollIndicator={false}
                          pagingEnabled
                          horizontal
                          keyboardShouldPersistTaps="handled"
                          snapToEnd
                          snapToStart
                          snapToInterval={width / 1.25}
                          decelerationRate="fast"
                          renderItem={(itemData) => {
                            return (
                              <>
                                <View style={[{ width: width / 1.25 }, tw`mt-1`]}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      setText(itemData.item.message);
                                      setClicked(true);
                                      setChatMenuShow(false);
                                    }}
                                    style={[tw`ml-2  rounded-2xl p-2 `]}
                                  >
                                    <Text style={tw`text-white  font-bold`}>
                                      {itemData.item.title}
                                    </Text>
                                    <Text style={[tw`text-white `, { fontSize: 16 }]}>
                                      {itemData.item.description}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </>
                            );
                          }}
                        />

                        <TouchableOpacity
                          style={tw`ml-4 mt-3  mx-10 items-center`}
                          onPress={() => setStartSelection(null)}
                        >
                          <Text style={[tw`text-white font-extrabold text-lg`, { fontSize: 16 }]}>
                            Go Back
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {startSelection == 'exercises' && (
                    <>
                      <View>
                        <FlatList
                          data={exercises}
                          showsHorizontalScrollIndicator={false}
                          pagingEnabled
                          horizontal
                          keyboardShouldPersistTaps="handled"
                          snapToEnd
                          snapToStart
                          snapToInterval={width / 1.25}
                          decelerationRate="fast"
                          renderItem={(itemData) => {
                            return (
                              <>
                                <View style={[{ width: width / 1.25 }, tw`mt-1`]}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      setText(itemData.item.message);
                                      setClicked(true);
                                      setChatMenuShow(false);
                                    }}
                                    style={[tw`ml-2  rounded-2xl p-2 `]}
                                  >
                                    <Text style={tw`text-white  font-bold`}>
                                      {itemData.index + 1}. {itemData.item.title}
                                    </Text>
                                    <Text style={[tw`text-white `, { fontSize: 16 }]}>
                                      {itemData.item.description}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </>
                            );
                          }}
                        />

                        <TouchableOpacity
                          style={tw`ml-4 mt-3  mx-10 items-center`}
                          onPress={() => setStartSelection(null)}
                        >
                          <Text style={tw`text-white font-extrabold text-lg`}>Go Back</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {startSelection == 'approaches' && (
                    <>
                      <View>
                        <FlatList
                          data={approaches}
                          showsHorizontalScrollIndicator={false}
                          pagingEnabled
                          horizontal
                          keyboardShouldPersistTaps="handled"
                          snapToEnd
                          snapToStart
                          snapToInterval={width / 1.25}
                          decelerationRate="fast"
                          renderItem={(itemData) => {
                            return (
                              <>
                                <View style={[{ width: width / 1.25 }, tw`mt-1`]}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      setText(itemData.item.message);
                                      setClicked(true);
                                      setChatMenuShow(false);
                                    }}
                                    style={[tw`ml-2  rounded-2xl p-2 `]}
                                  >
                                    <Text style={tw`text-white  font-bold`}>
                                      {itemData.index + 1}. {itemData.item.title}
                                    </Text>
                                    <Text style={[tw`text-white `, { fontSize: 16 }]}>
                                      {itemData.item.description}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </>
                            );
                          }}
                        />

                        <TouchableOpacity
                          style={tw`ml-4 mt-3  mx-10 items-center`}
                          onPress={() => setStartSelection(null)}
                        >
                          <Text style={[tw`text-white font-extrabold text-lg`, { fontSize: 16 }]}>
                            Go Back
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </>
              )}

              {helper ? (
                <>
                  {helper.length > 1 ? (
                    <>
                      {helper ? (
                        <Text style={[tw`ml-4 mb-1 text-white font-bold`, { fontSize: 15 }]}>
                          Suggested Reponses (Tap to send)
                        </Text>
                      ) : (
                        <>
                          {' '}
                          <ActivityIndicator size="large" />{' '}
                        </>
                      )}
                      <FlatList
                        data={helper ? helper : null}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        horizontal
                        keyboardShouldPersistTaps="handled"
                        snapToEnd
                        snapToStart
                        snapToInterval={width / 1.25}
                        decelerationRate="fast"
                        renderItem={(itemData) => {
                          return (
                            <>
                              {itemData.item.q.includes('Thank you') ||
                              itemData.item.q.includes(':') ||
                              itemData.item.q == '.' ? null : (
                                <View style={[{ width: width / 1.25 }, tw`mt-1`]}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      setText(itemData.item.q);
                                      setClicked(true);
                                    }}
                                    style={[tw`ml-2  rounded-2xl p-2 `]}
                                  >
                                    <Text style={[tw`text-white `, { fontSize: 16 }]}>
                                      {itemData.item.q}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              )}
                            </>
                          );
                        }}
                      />
                    </>
                  ) : (
                    <>
                      {helper ? (
                        <Text style={[tw`ml-4 mb-1 text-white font-bold`, { fontSize: 15 }]}>
                          Suggested Reponses (Tap to send)
                        </Text>
                      ) : (
                        <>
                          {' '}
                          <ActivityIndicator size="large" />{' '}
                        </>
                      )}
                      <FlatList
                        data={helper ? helper : null}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        keyboardShouldPersistTaps="handled"
                        snapToEnd
                        snapToStart
                        snapToInterval={width}
                        decelerationRate="fast"
                        renderItem={(itemData) => {
                          return (
                            <>
                              <View style={[{ width: width / 1.25 }, tw`mt-1`]}>
                                <TouchableOpacity
                                  onPress={() => {
                                    setText(itemData.item.q);
                                    setClicked(true);
                                  }}
                                  style={tw`ml-2  rounded-2xl  p-2`}
                                >
                                  <Text style={[tw`text-white `, { fontSize: 16 }]}>
                                    {itemData.item.q}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </>
                          );
                        }}
                      />
                    </>
                  )}
                </>
              ) : (
                <View>
                  {fleurHelperRun == true && <ActivityIndicator size="large" color="white" />}
                </View>
              )}
            </ScrollView>

            {Platform.OS == 'ios' && (
              <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={0}
                style={[tw`flex-row items-center absolute bottom-0`, { width: width }]}
              >
                {chatMenuShow == false && (
                  <View
                    id="outer-container"
                    style={[
                      { width: width, maxHeight: height / 2 },
                      tw`bg-slate-700 flex-row  bg-opacity-90   ${!isFocused ? `min-h-10 pb-5` : `min-h-12`}`,
                    ]}
                  >
                    <View id="inner-container" style={[tw`rounded-2xl `, { width: width }]}>
                      <View style={tw`flex-row   my-2 justify-center w-full`}>
                        <TouchableOpacity
                          style={tw`mr-1 mb-1 justify-end`}
                          onPress={() => setChatMenuShow(true)}
                        >
                          <AntDesign name="minuscircleo" size={24} color="white" />
                        </TouchableOpacity>

                        <TextInput
                          multiline
                          autoFocus={Platform.OS == 'ios' ? true : false}
                          numberOfLines={2}
                          style={[
                            tw`p-2 ml-2 ${!isFocused && text.length > 20 && ``} justify-end  items-center max-h-30  text-white bg-black rounded-2xl`,
                            { width: width / 1.3, fontSize: 17 },
                          ]}
                          placeholder={loading ? 'Ezra is responding ~10 secs...' : ''}
                          ref={textInputRef}
                          value={text}
                          maxLength={750}
                          onBlur={() => setIsFocused(false)}
                          onChangeText={setText}
                          onFocus={() => scrollToBottom()}
                        />

                        <TouchableOpacity
                          style={tw`flex-col ml-3 justify-end mb-1 `}
                          onPress={() =>
                            loading ? null : addMessage('user', text, navigation, accessToken)
                          }
                        >
                          {text.length > 650 ? (
                            <Text style={tw`font-light  text-slate-200`}>
                              {text.length > 650 && text.length - 750}
                            </Text>
                          ) : null}
                          <View style={tw`bg-yellow-600 p-1 rounded-2xl`}>
                            <Ionicons name="send" size={20} color="black" />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}

                {chatMenuShow == true && (
                  <TouchableOpacity
                    style={tw`flex-1 items-center justify-center mb-30 `}
                    onPress={() => {
                      setChatMenuShow(false);
                    }}
                  >
                    <View>
                      <Ionicons name="add-circle" size={45} color="white" />
                    </View>
                  </TouchableOpacity>
                )}
              </KeyboardAvoidingView>
            )}
          </SafeAreaView>
        </View>
      )}
    </>
  );
}
