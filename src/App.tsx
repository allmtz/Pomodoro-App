import  React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { ProgressBar } from './ProgressBar'

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

  const focusedStyling = `bg-${settings.color} p-4 rounded-full text-dark-bg text-center cursor-pointer duration-700`
  const [selectedFont, setSelectedFont] = useState("kombh")
  const selectedFontStyling = `text-white bg-black`
  const [selectedColor, setSelectedColor] = useState("hl")
  const [percentLeft, setPercentLeft] = useState(100)

  // const [secondsRemaining, setSecondsRemaining] = useState(settings.pomoLength * 60)
  const [secondsRemaining, setSecondsRemaining] = useState( 2 )

  const [status, setStatus] = useState(STATUS.STOPPED)
  const intervalRef= useRef(0)

  const [mode, setMode] = useState("pomoLength")

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
    //pausing the timer
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

  function closeSettings(){
    if(settingsRef.current){
      settingsRef.current.style.display = "none"
    }
  }

  function manuallyChangeMode(newMode:string,settingsName:string){
    clearInterval(intervalRef.current)
    setStatus(STATUS.STOPPED)
    setSecondsRemaining(settings[settingsName] * 60)
    setMode(newMode)
    setPercentLeft(100)
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
      <div className={`container font-${settings.font} flex flex-col justify-center align-center gap-10`}>
        <h1 className='text-light-purple text-4xl m-auto mt-5 xl:text-5xl'>pomodoro</h1>
        <nav className='flex max-sm:text-xs'>
          <ul className='flex items-center justify-around px-4 py-2 gap-9 text-light-purple font-bold bg-dark-bg rounded-full m-auto xl:scale-110'>
            <li className={mode === "pomoLength" ? focusedStyling : "cursor-pointer p-4 text-center"}
              onClick={()=>manuallyChangeMode("pomoLength","pomoLength")}
            >pomodoro</li>
            <li className={mode === "shortBreak" ? focusedStyling : "cursor-pointer p-4 text-center"}
              onClick={()=>manuallyChangeMode("shortBreak","shortBreak")}
            >short break</li>
            <li className={mode === "longBreak" ? focusedStyling : "cursor-pointer p-4  text-center"}
              onClick={()=>manuallyChangeMode("longBreak","longBreak")}
            >long break</li>
          </ul>
        </nav>

        <main className={`relative font-${settings.font} flex justify-center items-center text-off-white  
          w-[340px] h-[340px] rounded-full  m-auto cursor-pointer bg-gradient-to-br from-dark-bg to-lighter-bg shadow-2xl
          xl:w-[500px] xl:h-[500px]`}
          onClick={startPomo}>
          <div className="flex flex-col justify-center rounded-full bg-dark-bg items-center h-[305px] w-[305px] xl:h-[465px] xl:w-[465px]">
            <ProgressBar percentLeft={percentLeft} settings={settings} />
            <p className='text-7xl font-bold xl:text-8xl'>
              {`${getMinutes(secondsRemaining)}:${getSeconds(secondsRemaining)}`}
            </p>
            <p className='text-2xl tracking-[6px] mt-4 xl:text-4xl'>{status === "started" ? "PAUSE" : "START"}</p>
          </div>
        </main>

        <footer className='mx-auto my-16 cursor-pointer'>
          <img onClick={openSettings} src="./icon-settings.svg" alt="" />
        </footer>
      </div>

      <div ref={settingsRef} className={`FULLPAGE hidden font-${fontRef.current}  w-full h-full fixed top-0 right-0 p-4 bg-grayed-out`}>
       
       <div className="SETTINGS-CARD max-w-[350px] mx-auto p-4 bg-white rounded-2xl">
          <div className='border-b-2 flex justify-between pb-4'>
            <p className='text-xl' >Settings</p>
            <p className='cursor-pointer' onClick={closeSettings}>X</p>
          </div>
        
          <p className='text-center my-5 tracking-widest'>TIME (MINUTES)</p>
          <form className="flex flex-col gap-5"
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
                <div className={`${selectedColor==="hl" ? "scale-1" : "scale-0"} duration-200`}>X</div>
              </div>
              <div className='bg-teal w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
                onClick={() =>{setSelectedColor("teal"); colorRef.current="teal"}}
              >
                <div className={`${selectedColor==="teal" ? "scale-1" : "scale-0"} duration-200`}>X</div>
              </div>
              <div className='bg-violet w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
                onClick={() =>{setSelectedColor("violet"); colorRef.current="violet"}}
              >
                <div className={`${selectedColor==="violet" ? "scale-1" : "scale-0"} duration-200`}>X</div>
              </div>
            </div>
          </div>
          <input  type="submit" value="Apply" className={`bg-${selectedColor} w-min mt-5 -mb-10 mx-auto px-8 py-2 rounded-full cursor-pointer text-white hover:brightness-90 duration-200`}
          />
        </form>
       </div>
      </div>
    </>
  )
}

export default App
