interface ISettingsCogwheel {
  openSettings: () => void;
}

export const SettingsCogwheel = ({ openSettings }: ISettingsCogwheel) => {
  return (
    <footer className="mx-auto my-16 cursor-pointer">
      <img onClick={openSettings} src="./icon-settings.svg" alt="cogwheel" />
    </footer>
  );
};
