import  { useRef, useState } from 'react'
import './App.css'
import { ProgressBar } from './ProgressBar'

// let focus = "short break"
let focus = "pomodoro"


function App() {
  const pomodoroRef = useRef<HTMLSelectElement>(null)
  const shortBreakRef = useRef<HTMLSelectElement>(null)
  const longBreakRef = useRef<HTMLSelectElement>(null)
  const fontRef = useRef("kumbh")
  const colorRef = useRef("hl")
  const settingsRef = useRef<HTMLDivElement>(null)
  const [settings, setSettings] = useState({
    pomodoro:25,
    shortBreak:5,
    longBreak:30,
    font:"kumbh",
    color:"hl"
  })

const focusedStyling = `bg-${colorRef.current} p-4 rounded-full text-dark-bg`

  function openSettings(){
    if(settingsRef.current){
      settingsRef.current.style.display = "block"
    }
  }

  function closeSettings(){
    if(settingsRef.current){
      settingsRef.current.style.display = "none"
    }
  }

  function handleSubmit(e:React.FormEvent){
    e.preventDefault()
    console.log("fired")

    if(pomodoroRef.current && shortBreakRef.current && longBreakRef.current){
      setSettings(
        {
          pomodoro: parseInt(pomodoroRef.current.value),
          shortBreak: parseInt(shortBreakRef.current.value),
          longBreak: parseInt(longBreakRef.current.value),
          font: fontRef.current,
          color: colorRef.current
        }
      )
    }
  }

  return (
    <>
      <div className={`container font-${fontRef.current} flex flex-col justify-center align-center gap-10`}>
        <h1 className='text-light-purple text-4xl m-auto'>pomodoro</h1>
        <nav className='flex'>
          <ul className='flex items-center justify-around w-[400px] p-2 gap-9 text-light-purple font-bold bg-dark-bg rounded-full '>
            <li className={focus === "pomodoro" ? focusedStyling : ""}>pomodoro</li>
            <li className={focus === "short break" ? focusedStyling : ""}>short break</li>
            <li className={focus === "long break" ? focusedStyling : ""}>long break</li>
          </ul>
        </nav>

        <main className={`font-${fontRef.current} flex flex-col justify-center items-center text-off-white bg-dark-bg w-[300px] h-[300px] rounded-full shadow-custom m-auto`}>
          {/* <progress className='bg-hl' max="10" value="5" ></progress> */}
          
          <p className='text-7xl font-bold'>17:59</p>
          <p className='text-2xl tracking-[6px]'>PAUSE</p>
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

            <div className="flex justify-around">
              <p className='text-gray-400'>pomodoro</p>
              <select ref={pomodoroRef} name="pomodoro-length" className='bg-off-white pr-16 pl-2 py-1 rounded-md border' >
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="35">35</option>
                <option value="40">40</option>
                <option value="45">45</option>
              </select>
            </div>

          <div className="flex justify-around">
            <p className='text-gray-400'>short break</p>
            <select ref={shortBreakRef} name="short-break" className='bg-off-white pr-16 pl-2 py-1 rounded-md border'>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="30">30</option>
            </select>
          </div>

          <div className="flex justify-around">
            <p className='text-gray-400'>long break</p>
            <select ref={longBreakRef} name="long-break" className='bg-off-white pr-16 pl-2 py-1 rounded-md border'>
              <option value="30">30</option>
              <option value="35">35</option>
              <option value="40">40</option>
              <option value="45">45</option>
              <option value="50">50</option>
              <option value="55">55</option>
              <option value="60">60</option>
            </select>
          </div>

          <div className='border-t-2 mt-4'>
            <p className='text-center my-5 tracking-widest'>FONT</p>
            <div className='flex justify-center gap-5'>
              <p onClick={() => fontRef.current="kumbh"} className='bg-black text-white p-2 rounded-full cursor-pointer'>Aa</p>
              <p onClick={() => fontRef.current="roboto"}  className='bg-off-white font-roboto font-thin p-2 rounded-full border cursor-pointer'>Aa</p>
              <p onClick={() => fontRef.current="space"}  className='bg-off-white font-space p-2 rounded-full border cursor-pointer'>Aa</p>
            </div>
          </div>

          <div className='border-t-2 mt-4'>
            <p className='text-center my-5 tracking-widest'>COLOR</p>
            <div className='flex justify-center gap-5'>
              <div className='bg-hl w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
                onClick={() => colorRef.current="hl"}>
                X
              </div>
              <div className='bg-teal w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
              onClick={() => colorRef.current="teal"}
              >
                X
              </div>
              <div className='bg-violet w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
                onClick={() => colorRef.current="violet"}
              >
                X
              </div>
            </div>
          </div>

          <input type="submit" className={`bg-hl w-min mt-5 -mb-10 mx-auto px-8 py-2 rounded-full cursor-pointer text-white`}
          />
        </form>
       </div>
      </div>
    </>
  )
}

export default App
