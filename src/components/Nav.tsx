import { ISettings } from "../App"

interface INavProps{
    mode:string,
    manuallyChangeMode: Function ,
    settings: ISettings,
}

export const Nav = ( { mode, manuallyChangeMode, settings }:INavProps ) => {
    const focusedStyling = `bg-${settings.color} p-4 rounded-full text-dark-bg text-center cursor-pointer duration-700`
    const defaultStyling = "cursor-pointer p-4 text-center" 

    return(
        <nav className='flex max-sm:text-xs'>
            <ul className='flex items-center justify-around px-4 py-2 gap-9 text-light-purple font-bold bg-dark-bg rounded-full m-auto xl:scale-110'>
                <li className={mode === "pomoLength" ? focusedStyling : defaultStyling}
                onClick={()=>manuallyChangeMode("pomoLength")}
                >pomodoro</li>
                <li className={mode === "shortBreak" ? focusedStyling : defaultStyling}
                onClick={()=>manuallyChangeMode("shortBreak")}
                >short break</li>
                <li className={mode === "longBreak" ? focusedStyling : defaultStyling}
                onClick={()=>manuallyChangeMode("longBreak")}
                >long break</li>
            </ul>
        </nav>
    )
}