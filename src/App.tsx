import  React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { Nav } from './components/Nav'
import { SettingsCard } from './components/SettingsCard'
import { SettingsCogwheel } from './components/SettingsCogwheel'
import { Timer } from './components/Timer'

export interface ISettings{
        pomoLength:number,
        shortBreak:number,
        longBreak:number,
        font:string,
        color:string
}

const STATUS = {
  STARTED: "started",
  STOPPED: "stopped"
}

function App() {
  const settingsRef = useRef<HTMLDivElement>(null)
  const [settings, setSettings] = useState( () => {
    if(localStorage.getItem("settings")){
      const localSettings =  JSON.parse(localStorage.getItem("settings") || "")
      // fontRef.current = localSettings.font
      // colorRef.current = localSettings.color

      return localSettings
    }
    return{
        pomoLength:0.05,
        shortBreak:0.05,
        longBreak:0.05,
        font:"kumbh",
        color:"hl"
      }
  }
       )

  const [selectedFont, setSelectedFont] = useState("kumbh")
  const [selectedColor, setSelectedColor] = useState("hl")
  const [percentLeft, setPercentLeft] = useState(100)

  // const [secondsRemaining, setSecondsRemaining] = useState(settings.pomoLength * 60)
  const [secondsRemaining, setSecondsRemaining] = useState( 2 )

  const [status, setStatus] = useState(STATUS.STOPPED)
  const intervalRef= useRef(0)

  const [mode, setMode] = useState("pomoLength")

  //reset clock when user changes settings
  useEffect( () => {
    setSecondsRemaining(settings.pomoLength * 60)
    setMode("pomoLength")
    localStorage.setItem("settings",JSON.stringify(settings))
  },[settings])

  function startPomo(){
    if(status === STATUS.STOPPED){
      setStatus(STATUS.STARTED)
      intervalRef.current =  setInterval( () => {
          setSecondsRemaining( secondsRemaining => {
            if(secondsRemaining > 0){
              setPercentLeft( (((secondsRemaining - 1) / 60) / settings[mode]) * 100 )
              return secondsRemaining - 1
              }
          else{
            alert("Times up!")
            clearInterval(intervalRef.current)
            setStatus(STATUS.STOPPED)

            if(mode === "pomoLength"){
              setMode("shortBreak")
              setPercentLeft(100)
              return settings.shortBreak * 60
            }
            else if(mode === "shortBreak"){
              setMode("longBreak")
              setPercentLeft(100)
              return settings.longBreak * 60
            }
            else{
              setMode("pomoLength")
              setPercentLeft(100)
              return settings.pomoLength * 60
            }
          }
          })
      },400)
    }
    //pause the timer
    else{
      setStatus(STATUS.STOPPED)
      clearInterval(intervalRef.current)
    }
  }

  function openSettings(){
    if(settingsRef.current){
      settingsRef.current.style.display = "block"
      setSelectedFont(settings.font)
      setSelectedColor(settings.color)
    }
  }

  function manuallyChangeMode(newMode:string){
    clearInterval(intervalRef.current)
    setStatus(STATUS.STOPPED)
    setSecondsRemaining(settings[newMode] * 60)
    setMode(newMode)
    setPercentLeft(100)
  }

  return (  
    <>
      <div className={`container font-${settings.font} flex flex-col justify-center align-center gap-10`}>
        <h1 className='text-light-purple text-4xl m-auto mt-5 xl:text-5xl'>pomodoro</h1>
        <Nav mode={mode} manuallyChangeMode={manuallyChangeMode} settings={settings} />
        <Timer settings={settings} startPomo={startPomo} percentLeft={percentLeft} secondsRemaining={secondsRemaining} status={status} />
        <SettingsCogwheel openSettings={openSettings} />
      </div>
      <div ref={settingsRef} className={`FULLPAGE hidden w-full h-full fixed top-0 right-0 p-4 bg-grayed-out`}>
        <SettingsCard settingsRef={settingsRef} setSettings={setSettings} selectedFont={selectedFont} setSelectedFont={setSelectedFont} 
        selectedColor={selectedColor} setSelectedColor={setSelectedColor}    />
      </div>
    </>
  )
}

export default App