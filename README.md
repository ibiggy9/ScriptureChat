# ScriptureChat - AI-Powered Bible Study Companion

[![React Native](https://img.shields.io/badge/React%20Native-0.76.7-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-52.0.37-black.svg)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10.6.0-orange.svg)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)

> **The first generative AI-powered Bible study app on iOS (March 2023)**

I built ScriptureChat because I noticed that generative AI could be incredibly powerful for having meaningful conversations about faith and spiritual topics. As someone who values both technology and spirituality, I wanted to create a tool that could help people explore their faith journey through intelligent, scripture-based discussions.

The idea came from seeing how AI was being used for various applications, but I hadn't seen anything focused on spiritual growth and Bible study. I thought - what if we could create an AI companion that actually understands biblical context and can help people dive deeper into their faith?

## What It Does

ScriptureChat is a mobile app that provides an AI-powered companion for Bible study and spiritual reflection. Users can have conversations about scripture, ask questions about faith, and get personalized guidance based on their denomination and spiritual journey.

Key features include:
- **AI Chat**: Intelligent conversations about scripture and faith topics
- **Personalized Experience**: Customizable based on denomination, knowledge level, and spiritual focus
- **Cross-Platform**: Works on both iOS and Android
- **Premium Features**: Advanced customization and unlimited conversations for subscribers

## Tech Stack

- **Frontend**: React Native with Expo for cross-platform development
- **Backend**: Firebase for authentication, database, and analytics
- **AI Integration**: Custom API endpoints for AI-powered conversations
- **State Management**: React Context for app-wide state
- **Styling**: Tailwind CSS for consistent design
- **Payments**: React Native Purchases for subscription management

## Architecture

The app follows a typical React Native architecture with:
- Navigation handled by React Navigation
- State management through Context API
- Firebase integration for backend services
- Custom AI chat components for the core functionality

## What's in This Repo

This repository contains the complete React Native frontend, including:
- All UI components and screens
- Navigation and state management
- Authentication flow
- AI chat interface
- Premium subscription handling
- Platform-specific configurations

## What's Not Included

To protect the core AI functionality and business logic, the following aren't included:
- Backend AI service code
- Database schemas and user data models
- Revenue analytics and tracking
- Server infrastructure

## Getting Started

### Prerequisites
- Node.js 18+ 
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/yourusername/scripturechat.git
   cd scripturechat
   npm install
   ```

2. **Configure Firebase**
   - Copy `google-services.json.template` to `google-services.json` and add your Firebase project details
   - Copy `GoogleService-Info.plist.template` to `ios/ScriptureChat/GoogleService-Info.plist` and add your Firebase project details
   - Copy `env.template` to `.env` and add your Firebase API keys

3. **Start development**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## Why I Built This

I've always been interested in how technology can enhance our spiritual lives. When I started exploring generative AI, I realized it could be perfect for creating meaningful faith-based conversations. Most AI applications were focused on productivity or entertainment, but I saw an opportunity to use this technology to help people grow spiritually.

The challenge was building something that felt authentic and genuinely helpful, not just another AI chatbot. I wanted to create an experience that could adapt to different denominations, knowledge levels, and spiritual needs.

## What I Learned

Building ScriptureChat taught me a lot about:
- Integrating AI APIs into mobile apps
- Managing complex conversation state
- Building subscription-based revenue models
- Creating personalized user experiences
- Handling sensitive topics with appropriate AI prompts

## License

This project is proprietary software. The code is provided for demonstration purposes only.

---

**Built with React Native and a lot of curiosity about AI + faith** 