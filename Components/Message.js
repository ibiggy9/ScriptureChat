import React from 'react';
import { View, Text, Animated, useWindowDimensions, Platform } from 'react-native';
import tw from 'twrnc';

// Use Animated from React Native instead of Moti
const Message = ({ type, content }) => {
  const { width } = useWindowDimensions();

  if (type === 'fleur') {
    return (
      <View style={tw`flex-row`}>
        <View
          style={[
            tw`${Platform.OS === 'android' ? 'bg-slate-600' : 'bg-slate-600'} ml-2 justify-center mt-3 items-start rounded-2xl bg-opacity-60 p-2`,
            { maxWidth: width / 1.5 },
          ]}
        >
          <Text style={[tw`p-1 text-white`, { fontSize: 17 }]}>{content}</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={[{ width: width }, tw`items-end`]}>
        <View
          style={[
            tw`${Platform.OS === 'android' ? 'bg-blue-500' : 'bg-blue-600'} mr-2 mt-1 justify-end items-start mt-3 rounded-2xl bg-opacity-60 p-2`,
            { maxWidth: width / 1.5 },
          ]}
        >
          <Text style={[tw`p-1 text-white`, { fontSize: 17 }]}>{content}</Text>
        </View>
      </View>
    );
  }
};

export default Message;
