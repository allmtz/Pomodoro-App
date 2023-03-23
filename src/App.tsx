//TODO
// proper types

import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Nav } from "./components/Nav";
import { SettingsCard } from "./components/SettingsCard";
import { SettingsCogwheel } from "./components/SettingsCogwheel";
import { Tasks } from "./components/Tasks";
import { Timer } from "./components/Timer";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { UserView } from "./components/UserView";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgRsrcA7heoARZ-4NcJXdF0bqE757kPeI",
  authDomain: "pomodoro-48216.firebaseapp.com",
  projectId: "pomodoro-48216",
  storageBucket: "pomodoro-48216.appspot.com",
  messagingSenderId: "587005010419",
  appId: "1:587005010419:web:5cbf5b5630644d14b0f286",
  measurementId: "G-VMBKDEBSTG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();
const provider = new GoogleAuthProvider();

export interface ISettings {
  pomoLength: number;
  shortBreak: number;
  longBreak: number;
  font: string;
  color: string;
}

const STATUS = {
  STARTED: "started",
  STOPPED: "stopped",
};

const defaultSettings = {
  pomoLength: 0.05,
  shortBreak: 0.05,
  longBreak: 0.05,
  font: "kumbh",
  color: "hl",
};

function App() {
  const settingsRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState(() => {
    if (localStorage.getItem("settings")) {
      const localSettings = JSON.parse(localStorage.getItem("settings") || "");
      return localSettings;
    }
    return defaultSettings;
  });

  const [selectedFont, setSelectedFont] = useState("kumbh");
  const [selectedColor, setSelectedColor] = useState("hl");
  const [percentLeft, setPercentLeft] = useState(100);

  const [secondsRemaining, setSecondsRemaining] = useState(2);

  const [status, setStatus] = useState(STATUS.STOPPED);
  const intervalRef: any = useRef(0);

  const [mode, setMode] = useState("pomoLength");

  const [focusedTask, setFocusedTask] = useState<any>(null);

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>("");

  function signin() {
    signInWithPopup(auth, provider).then((result) => {
      setUserName(result.user.displayName);
      setIsSignedIn(true);
    });
  }

  function signout() {
    auth.signOut();
    setIsSignedIn(false);
    setUserName("");
  }

  //reset clock when user changes settings
  useEffect(() => {
    setSecondsRemaining(settings.pomoLength * 60);
    setMode("pomoLength");
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  function startPomo() {
    if (status === STATUS.STOPPED) {
      setStatus(STATUS.STARTED);
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((secondsRemaining) => {
          if (secondsRemaining > 0) {
            setPercentLeft(
              ((secondsRemaining - 1) / 60 / settings[mode]) * 100
            );
            return secondsRemaining - 1;
          } else {
            alert("Times up!");
            clearInterval(intervalRef.current);
            setStatus(STATUS.STOPPED);

            if (mode === "pomoLength") {
              if (focusedTask) {
                focusedTask.completedPomos += 1;
              }
              setMode("shortBreak");
              setPercentLeft(100);
              return settings.shortBreak * 60;
            } else if (mode === "shortBreak") {
              setMode("longBreak");
              setPercentLeft(100);
              return settings.longBreak * 60;
            } else {
              setMode("pomoLength");
              setPercentLeft(100);
              return settings.pomoLength * 60;
            }
          }
        });
      }, 1000);
    }
    //pause the timer
    else {
      setStatus(STATUS.STOPPED);
      clearInterval(intervalRef.current);
    }
  }

  function openSettings() {
    if (settingsRef.current) {
      settingsRef.current.style.display = "block";
      setSelectedFont(settings.font);
      setSelectedColor(settings.color);
    }
  }

  function manuallyChangeMode(newMode: string) {
    clearInterval(intervalRef.current);
    setStatus(STATUS.STOPPED);
    setSecondsRemaining(settings[newMode] * 60);
    setMode(newMode);
    setPercentLeft(100);
  }

  return (
    <>
      <div
        className={`container font-${settings.font} flex flex-col justify-center align-center gap-10`}
      >
        <h1 className="text-light-purple text-4xl m-auto mt-5 xl:text-5xl">
          pomodoro
        </h1>

        <div className="m-auto absolute top-5 right-20">
          <UserView
            signin={signin}
            isSignedIn={isSignedIn}
            userName={userName}
            signout={signout}
          />
        </div>

        <Nav
          mode={mode}
          manuallyChangeMode={manuallyChangeMode}
          settings={settings}
        />
        <Timer
          settings={settings}
          startPomo={startPomo}
          percentLeft={percentLeft}
          secondsRemaining={secondsRemaining}
          status={status}
        />

        <Tasks focusedTask={focusedTask} setFocusedTask={setFocusedTask} />

        <SettingsCogwheel openSettings={openSettings} />
      </div>
      <div
        ref={settingsRef}
        className={`FULLPAGE hidden w-full h-full fixed top-0 right-0 p-4 bg-grayed-out`}
      >
        <SettingsCard
          settingsRef={settingsRef}
          setSettings={setSettings}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      </div>
    </>
  );
}

export default App;
