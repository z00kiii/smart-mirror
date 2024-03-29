import React, { useState } from "react";

const Date = () => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [sek, setSek] = useState("");

  const weekday = new Array(
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  );

  const getDate = () => {
    let today = new window.Date();
    let hours = String(today.getHours()).padStart(2, "0");
    let min = String(today.getMinutes()).padStart(2, "0");
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    let dayOfWeek = weekday[today.getDay()];

    setDate(dayOfWeek + ", " + dd + "." + mm + "." + yyyy);
    setTime(hours + ":" + min);
    setSek(String(today.getSeconds()).padStart(2, "0"));
  };

  setTimeout(() => {
    getDate();
  }, 1000);

  return (
    <div className="tracking-wider">
      <div className="text-3xl">{date}</div>
      <div className="flex justify-end text-6xl mt-0.5">
        {time}
        <span className="align-top text-4xl text-gray-300">{sek}</span>
      </div>
    </div>
  );
};

export default Date;
