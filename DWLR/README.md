
# 🌊 Real time Groundwater resource evaluation using DWLR data


A comprehensive groundwater monitoring and management mobile application for the **Department of Water and Land Resources**.  
Built with **React Native and Expo**, this app provides **real-time monitoring, data visualization, and alerting capabilities** to strengthen groundwater management in India.  

---

## 📖 Background

Groundwater is central to India's drinking, agricultural, and industrial water needs. Despite covering an area of **3.3 million km²** and being home to **16% of the global population**, India has only **4% of the world's freshwater resources**.  

This limited availability, combined with **uneven distribution, overexploitation, and climate change**, highlights the urgent need for **sustainable groundwater management**.  

---

## 💡 Proposed Solution

The app integrates with **5,260 DWLR (Digital Water Level Recorder) stations** across India that provide high-frequency water level data.  
This enables stakeholders to:  

- 📊 Analyze **real-time water level fluctuations**  
- 💧 Estimate **dynamic recharge**  
- 📈 Evaluate **groundwater resources in real time**  

---

## 🚀 Key Features

### 📌 Dashboard
- Real-time groundwater monitoring (e.g., current level: **7.2m**)  
- Interactive charts for trends & rainfall correlation  
- Hero metrics for quick water level insights  
- Alert system (e.g., orange alerts for weather)  
- Detailed data cards:
  - Groundwater trends
  - Recharge & availability metrics
  - Rainfall & climate info
  - Water quality monitoring (pH, TDS)
  - Aquifer & geological data  

### 🗺️ Interactive Maps & GIS
- Visual mapping of monitoring stations  
- Multi-layer filtering:
  - Water level (Blue)  
  - Quality monitoring (Green)  
  - Rainfall gauges (Orange)  
  - Recharge zones (Cyan)  
- Tap markers for detailed station info  
- Zoom & pan with location services  
- Dynamic legend with color coding  

### 🔍 Monitoring System
- Real-time water depth measurement  
- Quality monitoring (pH, TDS)  
- Recharge rate monitoring  
- Status indicators (**Good, Warning, Critical**)  

### ⚡ Alert Management
- Weather alerts (e.g., thunderstorms)  
- Water level threshold alerts  
- Water quality threshold notifications  
- Instant **real-time updates**  

---

## 🏗️ Technical Architecture

### Frontend
- **React Native 0.81.4** (cross-platform)  
- **Expo 54.0.7** (build & development tools)  
- **TypeScript 5.9.2** (type safety)  
- **Expo Router 6.0.4** (file-based navigation)  

### UI/UX
- Blue **gradient theme**  
- **Glass-morphism cards** (blur effects)  
- Responsive layouts with safe area handling  
- **Material & Lucide icons**  
- Consistent theme system (colors & typography)  

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)  
- npm or yarn  
- Expo CLI  
- Android Studio (for Android)  
- Xcode (for iOS)  

### Installation
```bash
# Clone the repo
git clone <repository-url>
cd DWLR

# Install dependencies
npm install

# Start development server
npm start
````

### Available Scripts

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm start`             | Start Expo development server  |
| `npm run android`       | Run on Android device/emulator |
| `npm run ios`           | Run on iOS device/simulator    |
| `npm run web`           | Run web version                |
| `npm run lint`          | Run ESLint for code quality    |
| `npm run reset-project` | Reset project to initial state |

---

## 📱 Platform Support

* ✅ **Android**: Adaptive icons, edge-to-edge display
* ✅ **iOS**: Safe area handling (iPhone & iPad)
* ✅ **Web**: Progressive Web App (PWA) support

---

## 🎨 Design System

### Color Palette

* Primary Gradient: `#1a237e → #283593 → #3949ab`
* Water Level: `#2563eb` (Blue)
* Quality: `#10b981` (Green)
* Rainfall: `#f59e42` (Orange)
* Recharge: `#22d3ee` (Cyan)
* Success: `#10b981` | Warning: `#f59e42` | Critical: `#ef4444`

---

## 📦 Dependencies

### Core

* **React** 19.1.0
* **React Native** 0.81.4
* **Expo** 54.0.7
* **Expo Router** 6.0.4

### UI & Visualization

* `@expo/vector-icons` 15.0.2
* `expo-linear-gradient` 15.0.7
* `lucide-react-native` 0.544.0
* `react-native-svg` 15.12.1

### Navigation & Layout

* `@react-navigation/native` 7.1.6
* `@react-navigation/bottom-tabs` 7.3.10
* `react-native-safe-area-context` 5.6.0

### Dev Tools

* **TypeScript** 5.9.2
* **ESLint** 9.25.0
* `@babel/core` 7.25.2

---

## 🚢 Deployment

* 📲 **Android** → Google Play Store (via EAS Build)
* 🍏 **iOS** → Apple App Store (via EAS Build)
* 🌐 **Web** → Static export + PWA support

---

## 🌍 Impact
✨Transforms groundwater management from reactive to proactive through real-time data and AI-driven forecasts.

✨Empowers millions of farmers and policymakers with timely insights that drive informed water conservation decisions.

✨Prevents water scarcity risks and crop failures by enabling early intervention strategies and resource allocation.

✨Enables governments to mitigate "Day Zero" occurrences by lowering costs of water crisis interventions through efficient planning.



