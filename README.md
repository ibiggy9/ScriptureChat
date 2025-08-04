# ScriptureChat - AI-Powered Bible Study Companion

[![React Native](https://img.shields.io/badge/React%20Native-0.76.7-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-52.0.37-black.svg)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10.6.0-orange.svg)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)

> **The first generative AI-powered Bible study app on iOS (March 2023) - Combining spiritual guidance with cutting-edge technology**

ScriptureChat is a comprehensive mobile application that provides users with an intelligent, AI-driven companion for Bible study, spiritual reflection, and faith-based conversations. **Launched in March 2023, ScriptureChat became the first generative AI-powered Bible study application available on the iOS App Store**, pioneering the integration of artificial intelligence with spiritual guidance. Built with React Native and Expo, it offers a seamless cross-platform experience with advanced features like AI chat, personalized faith customization, and premium subscription management.

## 🚀 Key Features

- **AI-Powered Bible Chat**: Intelligent conversations about scripture and faith
- **Cross-Platform**: Native iOS and Android support via React Native
- **Authentication**: Secure user authentication with Firebase and Google Sign-In
- **Premium Subscriptions**: Revenue optimization with React Native Purchases
- **Customizable Faith Experience**: Personalized spiritual journey settings
- **Modern UI/UX**: Beautiful, intuitive interface with haptic feedback
- **Offline Capability**: Core functionality works without internet connection

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   Expo SDK 52   │    │   Firebase      │
│   Frontend      │◄──►│   Development   │◄──►│   Backend       │
│   (iOS/Android) │    │   Platform      │    │   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Navigation    │    │   State         │    │   Authentication│
│   (React Nav)   │    │   Management    │    │   & Analytics   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Chat       │    │   Premium       │    │   User          │
│   Components    │    │   Subscriptions │    │   Preferences   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React Native 0.76.7** - Cross-platform mobile development
- **Expo SDK 52** - Development platform and build tools
- **React Navigation 7** - Navigation and routing
- **React Native Reanimated** - Smooth animations and gestures
- **Tailwind CSS** - Utility-first styling

### Backend & Services
- **Firebase 10.6.0** - Authentication, analytics, and cloud services
- **Google Sign-In** - Social authentication
- **React Native Purchases** - Subscription management
- **Axios** - HTTP client for API requests

### Development Tools
- **Expo Dev Client** - Development and testing
- **Metro** - JavaScript bundler
- **Babel** - JavaScript compiler
- **PostCSS** - CSS processing

## 📱 What's in this Repository?

This repository contains the complete React Native frontend codebase for ScriptureChat, including:

- **Complete UI Components**: All screens, navigation, and user interface elements
- **State Management**: Context providers for authentication and app state
- **AI Chat Integration**: Frontend components for AI-powered conversations
- **Authentication Flow**: Complete login/signup implementation
- **Premium Features**: Paywall and subscription management UI
- **Customization**: Faith preference settings and personalization
- **Platform Configuration**: iOS and Android specific settings

### Key Files & Directories

```
├── App.js                    # Main application entry point
├── Screens/                  # All application screens
│   ├── AI/ChatBot/          # AI chat functionality
│   ├── Home.js              # Main dashboard
│   ├── Login.js             # Authentication screen
│   ├── Paywall2.js          # Premium subscription UI
│   └── Settings.js          # User preferences
├── Components/              # Reusable UI components
├── Context/                 # React Context providers
├── assets/                  # App icons and splash screens
└── ios/android/            # Platform-specific configurations
```

## 🔒 What's Not in this Repository?

To protect the core intellectual property and commercial viability of ScriptureChat, the following components are not included in this public repository:

- **AI Backend Services**: The proprietary AI conversation management system and API endpoints
- **Database Schemas**: User data models and conversation history structures
- **Revenue Analytics**: Detailed subscription and monetization tracking
- **Server Infrastructure**: Backend deployment and scaling configurations

These components contain critical business logic and user experience features that are essential to ScriptureChat's unique value proposition and commercial success.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scripturechat.git
   cd scripturechat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Copy `google-services.json.template` to `google-services.json` and fill in your Firebase project details
   - Copy `GoogleService-Info.plist.template` to `ios/ScriptureChat/GoogleService-Info.plist` and fill in your Firebase project details
   - Copy `env.template` to `.env` and add your Firebase API keys
   - Update `firebaseConfig.js` with your Firebase project credentials

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 📊 Code Highlights

### Architecture Patterns
- **Context API**: Global state management for authentication and app settings
- **Custom Hooks**: Reusable logic for revenue tracking and user preferences
- **Component Composition**: Modular, reusable UI components
- **Platform Abstraction**: Cross-platform compatibility with native optimizations

### Notable Implementations
- **`Screens/AI/ChatBot/Fleur.js`**: Advanced AI chat interface with typing animations and message handling
- **`Context/AuthContext.js`**: Secure authentication state management
- **`Components/Tabs.js`**: Custom tab navigation with smooth transitions
- **`Screens/Paywall2.js`**: Professional subscription management UI

## 🎯 Business Impact

ScriptureChat demonstrates the successful combination of:
- **Market Leadership**: First-to-market generative AI Bible study app on iOS (March 2023)
- **Technical Excellence**: Modern React Native architecture with optimal performance
- **Product Thinking**: User-centric design focused on spiritual growth
- **Revenue Optimization**: Strategic implementation of premium features
- **Scalability**: Architecture designed for growth and feature expansion

## 📄 License

This project is proprietary software. The code in this repository is provided for demonstration purposes only and is not licensed for commercial use without explicit permission.

## 🤝 Contributing

This is a private repository showcasing a commercial application. For business inquiries or collaboration opportunities, please contact the development team.

---

**Built with ❤️ using React Native and Expo** 