import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import Config from 'react-native-config';
import {
  createUserWithEmailAndPassword,
  signout,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  getUserByEmail,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  GoogleAuthProvider,
  getRedirectResult,
} from 'firebase/auth';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import * as AppleAuthentication from 'expo-apple-authentication';

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
import app from '../firebaseConfig';
import { AppContext } from '../App';
import tw from 'twrnc';
import useRevHook from '../Components/useRevHook';
import analytics from '@react-native-firebase/analytics';
import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FleurContext = createContext();

export function useFleur() {
  return useContext(FleurContext);
}

export function FleurProvider({ children, navigation }) {
  const [isFleur, setIsFleur] = useState(false);
  const [chatMenuShow, setChatMenuShow] = useState(true);
  const [fleurHelperRun, setFleurHelperRun] = useState(false);
  const textInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const auth = getAuth(app);
  const { width, height } = useWindowDimensions();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [clicked, setClicked] = useState(false);
  const apiKey = Config.API_KEY;
  const scrollRef = useRef();
  const { isProMember } = useRevHook();
  const transcriptRef = useRef([
    {
      role: 'system',
      content: `You are a world class christian leader. Your job is to provide highly personalized support to those who come to you by understanding their issues and helping them with scripture-based discussion and advice to help.  You may need to ask for more information before providing advice. ${denomination && denomination.length != 0 && `This person is a ${denomination}, cater the advice accordingly.`} ${knowledge && knowledge.length != 0 && `This persons knowledge level of scripture is ${knowledge}, cater the advice accordingly.`} ${primeFocus && primeFocus.length != 0 && `This persons primary focus in their faith journey is currently ${primeFocus}. Cater your advice accordingly`}`,
    },
    {
      role: 'assistant',
      content:
        "Hi I'm Ezra, your biblical research assistant. Please ask me any questions and I will do my best to engage with you in a scripture-based discussion about that topic.",
    },
  ]);
  const [error, setError] = useState(false);
  const [fleurResponse, setFleurResponse] = useState('');
  const [conversationString, setConversationString] = useState('');
  const [helper, setHelper] = useState(false);
  const [usageCount, setUsageCount] = useState();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [userLeft, setUserLeft] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [startSelection, setStartSelection] = useState(null);
  const [messageList, setMessageList] = useState([
    <Message
      type={'fleur'}
      key={Math.random() * 1000}
      content="Hi I'm Ezra, your biblical research assistant. Please ask me any questions and I will do my best to engage with you in a scripture-based discussion about that topic."
    />,
  ]);
  const [denomination, setDenomination] = useState();
  const [knowledge, setKnowledge] = useState();
  const [primeFocus, setPrimeFocus] = useState();

  const approaches = [
    {
      title: 'Finding Peace in Turmoil',
      description:
        'Explore scriptures that provide solace and peace during times of chaos and emotional turmoil.',
      message: "I'm feeling overwhelmed. Can you share scriptures that bring peace?",
    },
    {
      title: 'Overcoming Fear and Anxiety',
      description:
        "Meditate on verses that address fear and anxiety, drawing strength from God's promises of protection and presence.",
      message: "I'm anxious and afraid. What does the Bible say about overcoming these feelings?",
    },
    {
      title: 'Healing After Loss',
      description:
        'Find comfort in scriptures that speak to the heartbreak of loss and the hope of reunion and resurrection.',
      message: "I'm grieving a loss. Can you guide me to scriptures that offer healing?",
    },
    {
      title: 'Battling Loneliness',
      description:
        "Discover verses that remind us of God's constant companionship and the importance of community.",
      message: 'I feel alone. What does the Bible say about loneliness?',
    },
    {
      title: 'Dealing with Betrayal',
      description:
        'Reflect on biblical accounts of betrayal and the lessons on forgiveness, healing, and moving forward.',
      message: "I've been betrayed. How does the Bible guide me through this?",
    },
    {
      title: 'Reassurance in Times of Doubt',
      description:
        'Engage with scriptures that provide reassurance and faith when faced with doubt and uncertainty.',
      message: "I'm doubting my faith. Can you share scriptures that offer reassurance?",
    },
    {
      title: 'Finding Strength in Weakness',
      description:
        "Meditate on verses that speak of God's power being made perfect in our weakness and the strength we can find in Him.",
      message: 'I feel weak and defeated. How can I find strength in God?',
    },
    {
      title: 'Hope in Despair',
      description:
        "Discover scriptures that offer hope, even in the bleakest of circumstances, reminding us of God's eternal plan and love.",
      message: 'Everything seems hopeless. Can you guide me to verses that offer hope?',
    },
    {
      title: 'Comfort in Suffering',
      description:
        'Explore biblical passages that address suffering, offering perspective and comfort in the midst of trials.',
      message:
        "I'm going through a tough time. What does the Bible say about finding comfort in suffering?",
    },
    {
      title: 'Overcoming Temptation',
      description:
        'Reflect on scriptures that provide guidance and strength to resist temptation and stay on a righteous path.',
      message: "I'm struggling with temptation. Can the Bible guide me through this?",
    },
    {
      title: 'Restoration and Renewal',
      description:
        "Meditate on verses that speak of God's ability to restore, renew, and rejuvenate even the most broken spirits.",
      message: 'I feel broken. How does the Bible speak of restoration and renewal?',
    },
  ];

  const exercises = [
    {
      title: 'Praise and Worship Session',
      description:
        'Engage in a time of reflection, praise, and worship to draw nearer to God and celebrate His greatness.',
      message: 'Can you guide me through a praise and worship session?',
    },
    {
      title: "Reflecting on God's Goodness",
      description:
        "A devotional exercise that focuses on recounting and meditating on the manifold blessings and goodness of God in one's life.",
      message: 'Help me meditate on the goodness of God.',
    },
    {
      title: 'Seeking Wisdom in Decisions',
      description:
        "Find biblical verses and principles that offer guidance for making wise choices in life's crossroads.",
      message: "I'm facing a tough decision. Can you show me relevant Bible verses to guide me?",
    },
    {
      title: 'Moral and Ethical Dilemmas',
      description:
        'Explore biblical teachings that provide insight into moral and ethical situations, helping to discern the right path.',
      message: "I'm grappling with an ethical issue. Can you share Bible teachings related to it?",
    },
    {
      title: 'Deepening Relationship with God',
      description:
        "Engage in exercises and reflections that help nurture and deepen one's personal relationship with the Creator.",
      message: 'How can I grow closer to God?',
    },
    {
      title: "Understanding God's Character",
      description:
        'Delve into scriptures that reveal the nature and attributes of God, fostering a deeper understanding and connection.',
      message:
        "I want to understand more about God's character. Can you guide me through relevant scriptures?",
    },
    {
      title: 'Daily Spiritual Nourishment',
      description:
        'Begin each day with a scripture and reflection that feeds the soul and provides spiritual sustenance.',
      message: 'Can you provide a scripture for my daily spiritual nourishment?',
    },
    {
      title: 'Meditative Prayer Session',
      description:
        "Engage in a meditative prayer session, focusing on quieting the mind and listening to God's whispers.",
      message: 'Guide me through a meditative prayer session.',
    },
    {
      title: 'Exploring Spiritual Gifts',
      description:
        "Discover and delve into the spiritual gifts mentioned in the Bible, understanding how they can be nurtured and used in one's life.",
      message: 'Help me explore and understand my spiritual gifts.',
    },
    {
      title: 'Fasting and Spiritual Renewal',
      description:
        'Learn about the biblical principles of fasting and its role in spiritual renewal and drawing closer to God.',
      message:
        "I'm considering fasting for spiritual reasons. Can you guide me through its biblical significance?",
    },
    {
      title: "Reflecting on God's Promises",
      description:
        'Meditate on the promises God has made in the scriptures, drawing strength, hope, and assurance from them.',
      message: "Can you share some of God's promises for reflection?",
    },
  ];

  const initialSuggestions = [
    {
      title: 'Biblical Historical Context',
      description:
        'Dive deep into the historical background of the Bible, exploring the events, cultures, and settings of the scriptures.',
      message:
        'Can you guide me through the historical context of a specific biblical book or event?',
    },
    {
      title: 'Theological Doctrines Explored',
      description: 'Understand the fundamental doctrines of Christianity and their biblical basis.',
      message:
        "I'd like to study the doctrine of [specific doctrine, e.g., Trinity]. Can you help?",
    },
    {
      title: 'Literary Techniques in the Bible',
      description:
        'Examine the various literary techniques, styles, and structures used in the biblical text.',
      message: 'Show me examples of literary techniques in the Bible.',
    },
    {
      title: 'Prophecy and Fulfillment',
      description:
        'Trace prophecies in the Old Testament and their fulfillment in the New Testament, understanding the interconnectedness of scripture.',
      message:
        'Can you guide me through prophecies related to [specific event/person, e.g., the Messiah]?',
    },
    {
      title: 'Biblical Languages: Hebrew and Greek',
      description:
        'Study the original languages of the Bible to gain deeper insights into the text.',
      message:
        'I want to understand the meaning of a specific Hebrew/Greek word in the Bible. Can you help?',
    },
    {
      title: 'Comparative Religions',
      description:
        'Explore how biblical teachings compare and contrast with other religious texts and beliefs.',
      message:
        "How does the Bible's teaching on [specific topic, e.g., afterlife] compare with other religions?",
    },
    {
      title: 'Church History',
      description:
        'Trace the history of the Christian church from its inception to modern times, understanding its evolution and key events.',
      message: 'Guide me through the early history of the Christian church.',
    },
    {
      title: 'Biblical Canon Formation',
      description:
        'Discover how the books of the Bible were chosen, compiled, and recognized as inspired scripture.',
      message: 'How was the biblical canon formed?',
    },
    {
      title: 'Biblical Criticism and Interpretation',
      description:
        'Engage in critical methods of studying the Bible, from textual criticism to literary and historical analyses.',
      message: 'Can you introduce me to methods of biblical criticism?',
    },
    {
      title: 'Parables and Their Meanings',
      description:
        'Delve into the parables of Jesus, exploring their deeper meanings and applications.',
      message: 'Help me understand the parable of [specific parable, e.g., the Prodigal Son].',
    },
    {
      title: 'Apologetics: Defending the Faith',
      description:
        'Equip yourself with arguments and reasoning to defend Christian beliefs against objections and challenges.',
      message:
        "I'd like to learn more about apologetics concerning [specific topic, e.g., the resurrection]. Can you guide me?",
    },
  ];

  function runFocus(kbHeight) {
    try {
      scrollRef.current.scrollToEnd({ animated: true });
    } catch {}
    setIsFocused(true);
  }

  function runBlur() {
    setIsFocused(false);
  }

  async function getProfile() {
    try {
      const jsonValue = await AsyncStorage.getItem('userPreferences');

      if (jsonValue != null) {
        const retrievedObject = JSON.parse(jsonValue);

        const { Denomination, KnowledgeLevel, Focus } = retrievedObject;

        setDenomination(Denomination);
        setKnowledge(KnowledgeLevel);
        setPrimeFocus(Focus);
      }
    } catch (error) {
      console.error('Error retrieving data', error);
    }
  }

  async function review() {
    if (usageCount % 11 === 0) {
      // Check if usageCount is a multiple of 3
      if (await StoreReview.hasAction()) {
        // you can call StoreReview.requestReview()
        StoreReview.requestReview();
      }
    }
  }

  async function storeChatData(value) {
    try {
      await AsyncStorage.setItem('chatUsage', String(value));
    } catch (error) {
      console.error('Error storing data:', error);
    }
  }

  async function getChatData() {
    try {
      const value = await AsyncStorage.getItem('chatUsage');
      if (value != null) {
        setUsageCount(Number(value));
      } else {
        storeChatData(20);
      }
    } catch (error) {
      console.error('Error retrieving data', error);
    }
  }

  useEffect(() => {
    getProfile();
    getChatData();
  }, []);

  useEffect(() => {
    if (clicked && Platform.OS != 'ios') {
      setTimeout(() => {
        textInputRef.current && textInputRef.current.focus();
      }, 10);
    }
  }, [clicked]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      } else {
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (AppState.currentState != 'active' && loading == true) {
      cancelRun();
    }
  }, [AppState.currentState]);

  function clear() {
    setHelper(false);
    setError();
    setUserLeft(false);
    setMessageList([
      <Message
        type={'fleur'}
        content="Hi I'm Ezra, your biblical research assistant. Please ask me any questions and I will do my best to engage with you in a scripture-based discussion about that topic."
      />,
    ]);

    setConversationString('');
    transcriptRef.current = [
      {
        role: 'system',
        content: `You are a world class christian leader. Your job is to provide highly personalized support to those who come to you by understanding their issues and helping them with scripture-based discussion and advice to help.  You may need to ask for more information before providing advice. ${denomination && denomination.length != 0 && `This person is a ${denomination}, cater the advice accordingly.`} ${knowledge && knowledge.length != 0 && `This persons knowledge level of scripture is ${knowledge}, cater the advice accordingly.`} ${primeFocus && primeFocus.length != 0 && `This persons primary focus in their faith journey is currently ${primeFocus}. Cater your advice accordingly`}`,
      },
      {
        role: 'assistant',
        content:
          "Hi I'm Ezra, your biblical research assistant. Please ask me any questions and I will do my best to engage with you in a scripture-based discussion about that topic.",
      },
    ];
  }

  async function fleurHelper(latestResponse) {
    setFleurHelperRun(true);
    abortControllerRef.current = new AbortController();
    const conversation = [
      {
        role: 'system',
        content: `The user is a christian leader and you are a christian seeking help for something. Generate a 2-5 questions about the church leader's advice to get more insight into their advice. ${denomination && denomination.length != 0 && `This person is a ${denomination}, cater the advice accordingly.`} ${knowledge && knowledge.length != 0 && `This persons knowledge level of scripture is ${knowledge}, cater the advice accordingly.`} ${primeFocus && primeFocus.length != 0 && `This persons primary focus in their faith journey is currently ${primeFocus}. Cater your advice accordingly`}`,
      },
      {
        role: 'user',
        content:
          "Prayer is a personal and intimate communication with God. It's not about using the right words or phrases, but expressing your heart sincerely to Him. Here are some steps that might help you. 1) Adoration 2) Confession 3) Thanksgiving 4) Supplication 5) Listening.",
      },
      {
        role: 'assistant',
        content:
          '1. How can I ensure that my prayers are sincere and not just recitations? 2. Can you provide more guidance on how to listen for Gods voice during prayer? 3. What should I do if I feel like my prayers arent being answered? 4. Could you give me an example of a personal prayer following the steps you outlined? 5. How can we maintain consistency in our prayer life, especially during challenging times?',
      },
      { role: 'user', content: latestResponse },
    ];

    var raw = JSON.stringify(conversation);
    var myHeaders = new Headers();

    myHeaders.append('Content-Type', 'application/json');
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
      signal: abortControllerRef.current.signal,
    };
    const response = await fetch(`${Config.API_BASE_URL}/gpt/flourish`, requestOptions);

    setFleurResponse(false);
    const respJson = await response.json();
    setTimeout(() => (!respJson ? cancelFleurRequest('timeout') : null), 7000);

    const str = respJson.choices[0].message.content;
    const sentences = str.split(/\d+\./).filter(Boolean);

    const questions = sentences.map((sentence) => {
      return { q: sentence.trim() };
    });

    setFleurHelperRun(false);
    setHelper(!questions.includes('As an') ? questions : null);
  }

  async function fleurResponseFunc(latestInput, accessToken) {
    abortControllerRef.current = new AbortController();
    transcriptRef.current.push({ role: 'user', content: latestInput });
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${accessToken}`);
    setFleurResponse(false);

    var raw = JSON.stringify(transcriptRef.current);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
      signal: abortControllerRef.current.signal,
    };

    try {
      const response = await fetch(`${Config.API_BASE_URL}/gpt/flourish`, requestOptions);
      const respJson = await response.json();

      setTimeout(() => (!respJson ? cancelFleurRequest('timeout') : null), 7000);
      return respJson;
    } catch (error) {
      return error;
    }
  }

  async function processFleurResponse(response, accessToken) {
    setError(false);
    if (response) {
      await analytics().logEvent('fleurResponse', { id: response });

      var resString = response.choices[0].message.content;

      setLoading(false);
      var messageObj = { role: 'assistant', content: resString };
      var messageComponent = <Message type="fleur" content={resString} />;

      setMessageList((prev) => [...prev, messageComponent]);
      transcriptRef.current.push(messageObj);
      if (usageCount) {
        await storeChatData(usageCount - 1);
      }
      await getChatData();
    }

    return;
  }

  async function addMessage(type, input, navigation, accessToken) {
    getChatData();
    if (!isProMember && usageCount <= 0) {
      navigation.navigate('Paywall');
    } else {
      if (usageCount) {
        review();
      }
      setHelper(false);
      let tempText = text;
      await analytics().logEvent('fleurMessageSent', {
        id: tempText,
      });
      setText('');
      setUserLeft(false);
      setLoading(true);

      var messageObj = { role: 'user', content: input };
      var newMessage = <Message type="user" content={tempText} />;

      setMessageList((prev) => [...prev, newMessage]);

      try {
        let fleurResp = await fleurResponseFunc(tempText, accessToken);

        let processed = await processFleurResponse(fleurResp, accessToken);
      } catch (error) {}
    }
  }

  const scrollToBottom = () => {
    scrollRef.current.scrollToEnd({ animated: true });
    setIsFocused(true);
  };

  function scrollToTop() {
    scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
  }

  function reTry() {
    setError('Sorry, there was an error, retrying...');
    fleurResponseFunc();
  }

  function cancelRun() {
    cancelFleurRequest();
    const lastMessage = transcriptRef.current[transcriptRef.current.length - 1];
    setMessageList(messageList.slice(0, -1));
    setText(lastMessage.content);
    transcriptRef.current.pop();
    setUserLeft(true);
    setLoading(false);
    setHelper(false);
  }

  function cancelFleurRequest(reasonCode) {
    setLoading(false);
    reasonCode == 'timeout' &&
      setError('Either the network timed out or there was a server error. Retry sending');
    abortControllerRef.current && abortControllerRef.current.abort();
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      runFocus(e.endCoordinates.height);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (e) => {
      setKeyboardHeight(0);
      runBlur();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  function Message({ type, content }) {
    if (type == 'fleur') {
      return (
        <View style={tw`flex-row`}>
          <View
            id="text-Fleur"
            style={[
              tw`${Platform.OS == 'android' ? `bg-slate-600` : `bg-slate-600`} ml-2 justify-center mt-3 items-start rounded-2xl bg-opacity-60 p-2`,
              { maxWidth: width / 1.5 },
            ]}
          >
            <Text style={[tw`p-1 text-white `, { fontSize: 17 }]}>{content}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View id="row" style={[{ width: width }, tw`items-end`]}>
          <View
            id="text-Fleur"
            style={[
              tw`${Platform.OS == 'android' ? `bg-blue-500` : `bg-blue-600`}  mr-2 mt-1 justify-end items-start mt-3 rounded-2xl bg-opacity-60 p-2`,
              { maxWidth: width / 1.5 },
            ]}
          >
            <Text style={[tw`p-1 text-white `, { fontSize: 17 }]}>{content}</Text>
          </View>
        </View>
      );
    }
  }

  const value = {
    isFleur,
    setIsFleur,
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
    usageCount,
    setUsageCount,
    appStateVisible,
    setAppStateVisible,
    appState,
    //AndroidKey,
    initialSuggestions,
    runFocus,
    runBlur,

    clear,

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
    exercises,
    approaches,
    scrollToTop,
    storeChatData,
    getChatData,
    getProfile,
    denomination,
    knowledge,
    primeFocus,
    setDenomination,
    setPrimeFocus,
    setKnowledge,
  };

  return <FleurContext.Provider value={value}>{children}</FleurContext.Provider>;
}
