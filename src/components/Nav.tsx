import { useEffect } from "react"
import { ISettings } from "../App"

interface INavProps{
    mode:string,
    manuallyChangeMode: Function ,
    settings: ISettings,
}

export const Nav = ( { mode, manuallyChangeMode, settings }:INavProps ) => {

    
    // const focusedStyling = `bg-${settings.color} p-4 rounded-full text-dark-bg text-center cursor-pointer duration-700`
    const defaultStyling = "cursor-pointer p-4 text-center" 

    return(
        <nav className='flex max-sm:text-xs'>
            <ul className='flex items-center justify-around px-4 py-2 gap-9 text-light-purple font-bold bg-dark-bg rounded-full m-auto xl:scale-110'>
                <li className={mode === "pomoLength" ? `bg-${settings.color} p-4 rounded-full text-dark-bg text-center cursor-pointer duration-700` : defaultStyling}
                onClick={()=>manuallyChangeMode("pomoLength")}
                >pomodoro

                {settings.color}</li>

                <li className={mode === "shortBreak" ? `bg-${settings.color} p-4 rounded-full text-dark-bg text-center cursor-pointer duration-700`  : defaultStyling}
                onClick={()=>manuallyChangeMode("shortBreak")}
                >short break</li>
                <li className={mode === "longBreak" ?  `bg-${settings.color} p-4 rounded-full text-dark-bg text-center cursor-pointer duration-700`  : defaultStyling}
                onClick={()=>manuallyChangeMode("longBreak")}
                >long break</li>
            </ul>
        </nav>
    )
}


{/* <nav className='flex max-sm:text-xs'>
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
</nav> */}