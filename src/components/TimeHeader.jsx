import { useEffect, useState } from "react";
import { useAppData } from "../context/useAppData";
import { getESTTime, getISTTime } from "../utils/timeEngine";
import { useTranslation } from "../utils/useTranslation";

export default function TimeHeader() {
  const { appData } = useAppData();
  const { dayName } = useTranslation();

  const [clock, setClock] = useState({
    est: getESTTime(),
    ist: getISTTime()
  });

  useEffect(() => {

    const updateClock = () => {
      setClock({
        est: getESTTime(),
        ist: getISTTime()
      });
    };

    const timer = setInterval(updateClock, 60000);

    return () => clearInterval(timer);

  }, []);

  return (
    <p style={{ color:"var(--app-muted)", marginBottom:"16px" }}>
      {appData.settings.timezoneDisplay === "est" && `${dayName(clock.est.day)} - EST ${clock.est.time}`}
      {appData.settings.timezoneDisplay === "ist" && `IST ${clock.ist}`}
      {appData.settings.timezoneDisplay === "both" && `${dayName(clock.est.day)} - EST ${clock.est.time} | IST ${clock.ist}`}
    </p>
  );
}
