import { useRef } from "react"
import { ISettings } from "../App"
import { DurationSelector } from "./DurationSelector"

interface ISettingsCardProps{
    settingsRef: React.RefObject<HTMLDivElement>,
    setSettings: React.Dispatch<ISettings>,
    selectedFont:string,
    setSelectedFont:React.Dispatch<React.SetStateAction<string>>,
    selectedColor:string,
    setSelectedColor:React.Dispatch<React.SetStateAction<string>>,
}

const selectedFontStyling = `text-white bg-black`

export const SettingsCard = ( { settingsRef, setSettings, selectedFont, setSelectedFont, selectedColor, setSelectedColor }:ISettingsCardProps ) => {
    const pomodoroRef = useRef<HTMLSelectElement>(null)
    const shortBreakRef = useRef<HTMLSelectElement>(null)
    const longBreakRef = useRef<HTMLSelectElement>(null)
    const fontRef = useRef("kumbh")
    const colorRef = useRef("hl")

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
    return(

        <div className={`SETTINGS-CARD font-${fontRef.current}  max-w-[350px] mx-auto p-4 bg-white rounded-2xl`}>
          <div className='border-b-2 flex justify-between pb-4'>
            <p className='text-xl' >Settings</p>
            <p className='cursor-pointer' onClick={closeSettings}>X</p>
          </div>
          <p className='text-center my-5 tracking-widest'>TIME (MINUTES)</p>
          <form className="flex flex-col gap-5"
            onSubmit={e => handleSubmit(e)}>

            <DurationSelector mode={"pomodoro"} options={ [25,30,35,40,45] } ref={pomodoroRef} />
            <DurationSelector mode={"short break"} options={ [5,10,15] } ref={shortBreakRef} />
            <DurationSelector mode={"long break"} options={ [20,25,30,35,40] } ref={longBreakRef} />

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
    )
}