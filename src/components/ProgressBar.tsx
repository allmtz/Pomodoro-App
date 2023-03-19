import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ISettings } from "../App";

interface IProgressProps {
  percentLeft: number;
  settings: ISettings;
}

export const ProgressBar = ({ percentLeft, settings }: IProgressProps) => {
  return (
    <div className="absolute w-[280px] h-[280px] xl:w-[440px] xl:h-[440px]">
      <CircularProgressbar
        value={percentLeft}
        strokeWidth={3}
        styles={buildStyles({
          pathColor: `${
            settings.color === "hl"
              ? "#f87070"
              : settings.color === "teal"
              ? "#70f3f8"
              : "#d881f8"
          }`,
          trailColor: `#161932`,
        })}
      />
    </div>
  );
};
