interface IColorOptionProps{
    colorRef: React.MutableRefObject<string>,
    selectedColor: string,
    setSelectedColor:React.Dispatch<React.SetStateAction<string>>,
    color:string
}

export const ColorOption = ( {colorRef, selectedColor, setSelectedColor, color}:IColorOptionProps ) => {
    return(
        <div className={`bg-${color} w-10 h-10 rounded-full flex justify-center items-center cursor-pointer`}
                onClick={() =>{setSelectedColor(color); colorRef.current=color}}
                >
            <div className={`${selectedColor===color ? "scale-1" : "scale-0"} duration-200`}>
                X
            </div>
        </div>
    )
}