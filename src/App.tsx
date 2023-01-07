import  React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { ProgressBar } from './ProgressBar'

const STATUS = {
  STARTED: "started",
  STOPPED: "stopped"
}

function getMinutes(seconds : number){
  const stringMins = String(seconds / 60).split(".")
  return stringMins[0]
}

function getSeconds(seconds : number){
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
  return String(seconds % 60).padStart(2,"0")
}

function App() {
  const pomodoroRef = useRef<HTMLSelectElement>(null)
  const shortBreakRef = useRef<HTMLSelectElement>(null)
  const longBreakRef = useRef<HTMLSelectElement>(null)
  const fontRef = useRef("kumbh")
  const colorRef = useRef("hl")
  const settingsRef = useRef<HTMLDivElement>(null)
  const [settings, setSettings] = useState( () => {
    if(localStorage.getItem("settings")){
      const localSettings =  JSON.parse(localStorage.getItem("settings") || "")
      fontRef.current = localSettings.font
      colorRef.current = localSettings.color

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

  const focusedStyling = `bg-${colorRef.current} p-4 rounded-full text-dark-bg`
  const [selectedFont, setSelectedFont] = useState("kombh")
  const selectedFontStyling = `text-white bg-black`
  const [selectedColor, setSelectedColor] = useState("hl")

  // const [secondsRemaining, setSecondsRemaining] = useState(settings.pomoLength * 60)
  const [secondsRemaining, setSecondsRemaining] = useState( 2 )

  const [status, setStatus] = useState(STATUS.STOPPED)
  const intervalRef= useRef(0)

  const [mode, setMode] = useState("pomodoro")

  useEffect( () => {
    setSecondsRemaining(settings.pomoLength * 60)
    setMode("pomodoro")
    localStorage.setItem("settings",JSON.stringify(settings))
  },[settings])

  function startPomo(){
    if(status === STATUS.STOPPED){
      setStatus(STATUS.STARTED)
      intervalRef.current =  setInterval( () => {
          setSecondsRemaining( secondsRemaining => {
            if(secondsRemaining > 0){
              return secondsRemaining - 1
              }
          else{
            alert("Times up!")
            clearInterval(intervalRef.current)
            setStatus(STATUS.STOPPED)

            if(mode === "pomodoro"){
              setMode("short break")
              return settings.shortBreak * 60
            }
            else if(mode === "short break"){
              setMode("long break")
              return settings.longBreak * 60
            }
            else{
              setMode("pomodoro")
              return settings.pomoLength * 60
            }
          }
          })
      },1000)
    }
    else{
      setStatus(STATUS.STOPPED)
      clearInterval(intervalRef.current)
    }
  }

  function openSettings(){
    if(settingsRef.current){
      settingsRef.current.style.display = "block"
      fontRef.current = settings.font
      colorRef.current = settings.color
    }
  }

  function closeSettings(){
    if(settingsRef.current){
      settingsRef.current.style.display = "none"
    }
  }

  function handleSubmit(e:React.FormEvent){
    e.preventDefault()

    if(pomodoroRef.current && shortBreakRef.current && longBreakRef.current){
      setSettings(
        {
          pomoLength: parseInt(pomodoroRef.current.value),
          shortBreak: parseInt(shortBreakRef.current.value),
          longBreak: parseInt(longBreakRef.current.value),
          font: fontRef.current,
          color: colorRef.current
        }
      )
    }
    closeSettings()
  }
  return (  
    <>
      <div className={`container font-${fontRef.current} flex flex-col justify-center align-center gap-10`}>
        <h1 className='text-light-purple text-4xl m-auto'>pomodoro</h1>
        <nav className='flex'>
          <ul className='flex items-center justify-around px-4 py-2 gap-9 text-light-purple font-bold bg-dark-bg rounded-full'>
            <li className={mode === "pomodoro" ? focusedStyling : ""}>pomodoro</li>
            <li className={mode === "short break" ? focusedStyling : ""}>short break</li>
            <li className={mode === "long break" ? focusedStyling : ""}>long break</li>
          </ul>
        </nav>

        <main className={`font-${fontRef.current} flex flex-col justify-center items-center text-off-white bg-dark-bg w-[300px] h-[300px] rounded-full shadow-custom m-auto cursor-pointer`}
        onClick={startPomo}>
          {/* <progress className='bg-hl' max="10" value="5" ></progress> */}
          <p className='text-7xl font-bold'>
            {`${getMinutes(secondsRemaining)}:${getSeconds(secondsRemaining)}`}
          </p>
          <p className='text-2xl tracking-[6px]'>{status === "started" ? "PAUSE" : "START"}</p>
        </main>

        <footer className='mx-auto my-16 cursor-pointer'>
          <img onClick={openSettings} src="src/assets/icon-settings.svg" alt="" />
        </footer>
      </div>

      <div ref={settingsRef} className={`FULLPAGE hidden font-${fontRef.current}  w-full h-full absolute top-0 right-0 p-4 bg-grayed-out`}>
       
       <div className="SETTINGS-CARD w-[350px] mx-auto p-4 bg-orange-300">
          <div className='border-b-2 flex justify-between pb-4'>
            <p className='text-xl' >Settings</p>
            <p className='text-slate-400 font-extralight cursor-pointer' onClick={closeSettings}>X</p>
          </div>
        
          <p className='text-center my-5 tracking-widest'>TIME (MINUTES)</p>
          <form action="" className="flex flex-col gap-5"
            onSubmit={e => handleSubmit(e)}>

            <div className="flex justify-between">
              <p className='text-gray-400'>pomodoro</p>
              <select ref={pomodoroRef} name="pomodoro-length" className='bg-off-white pr-16 pl-2 py-1 rounded-md border' >
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="35">35</option>
                <option value="40">40</option>
                <option value="45">45</option>
              </select>
            </div>

          <div className="flex justify-between">
            <p className='text-gray-400'>short break</p>
            <select ref={shortBreakRef} name="short-break" className='bg-off-white pr-16 pl-2 py-1 rounded-md border'>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </div>

          <div className="flex justify-between">
            <p className='text-gray-400'>long break</p>
            <select ref={longBreakRef} name="long-break" className='bg-off-white pr-16 pl-2 py-1 rounded-md border'>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="30">30</option>
              <option value="35">35</option>
              <option value="40">40</option>
            </select>
          </div>

          <div className='border-t-2 mt-4'>
            <p className='text-center my-5 tracking-widest'>FONT</p>
            <div className='flex justify-center gap-5'>
              <p onClick={() => {setSelectedFont("kumbh"); fontRef.current="kumbh"}} className={`${selectedFont === "kumbh" ? selectedFontStyling :   "bg-off-white"} p-2 rounded-full w-10 text-center cursor-pointer`}>Aa</p>
              <p onClick={() => {setSelectedFont("roboto"); fontRef.current="roboto"}}  className={`${selectedFont === "roboto" ? selectedFontStyling :   "bg-off-white"} font-roboto p-2 w-10 text-center rounded-full cursor-pointer`}>Aa</p>
              <p onClick={() => {setSelectedFont("space"); fontRef.current="space"}}  className={`${selectedFont === "space" ? selectedFontStyling :   "bg-off-white"} font-space p-2 w-10 text-center rounded-full cursor-pointer`}>Aa</p>
            </div>
          </div>

          <div className='border-t-2 mt-4'>
            <p className='text-center my-5 tracking-widest'>COLOR</p>
            <div className='flex justify-center gap-5'>
              <div className='bg-hl w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
                onClick={() =>{setSelectedColor("hl"); colorRef.current="hl"}}
              >
                {selectedColor==="hl" ? "X" : "" }
              </div>
              <div className='bg-teal w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
                onClick={() =>{setSelectedColor("teal"); colorRef.current="teal"}}
              >
                {selectedColor==="teal" ? "X" : "" }
              </div>
              <div className='bg-violet w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
                onClick={() =>{setSelectedColor("violet"); colorRef.current="violet"}}
              >
                {selectedColor==="violet" ? "X" : "" }
              </div>
            </div>
          </div>
          <input type="submit" className={`bg-${selectedColor} w-min mt-5 -mb-10 mx-auto px-8 py-2 rounded-full cursor-pointer text-white`}
          />
        </form>
       </div>
      </div>
    </>
  )
}

export default App
