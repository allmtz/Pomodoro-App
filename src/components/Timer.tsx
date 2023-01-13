import { ProgressBar } from "./ProgressBar"
import { ISettings } from "../App"

interface ITimer{
    settings: ISettings,
    startPomo: React.MouseEventHandler,
    percentLeft:number,
    secondsRemaining:number,
    status:string,
}

function getMinutes(seconds : number){
    const stringMins = String(seconds / 60).split(".")
    return stringMins[0]
}
  
function getSeconds(seconds : number){
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
    return String(seconds % 60).padStart(2,"0")
}

export const Timer = ( {settings, startPomo, percentLeft, secondsRemaining, status }:ITimer ) => {
    return(
        <main className={`relative font-${settings.font} flex justify-center items-center text-off-white  
            w-[340px] h-[340px] rounded-full m-auto cursor-pointer bg-gradient-to-br from-dark-bg to-lighter-bg shadow-2xl
            xl:w-[500px] xl:h-[500px]`}
            onClick={startPomo}>
            <div className="flex flex-col justify-center rounded-full bg-dark-bg items-center h-[305px] w-[305px] xl:h-[465px] xl:w-[465px]">
                <ProgressBar percentLeft={percentLeft} settings={settings} />
                <p className='text-7xl font-bold xl:text-8xl'>
                    {`${getMinutes(secondsRemaining)}:${getSeconds(secondsRemaining)}`}
                </p>
                <p className='text-2xl tracking-[6px] mt-4 xl:text-4xl'>
                    {status === "started" ? "PAUSE" : "START"}
                </p>
            </div>
      </main>
    )
}