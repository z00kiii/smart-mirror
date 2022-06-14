import React, { useState, useEffect } from "react";

const icons = new Map([
  ["01d", "sun"],
  ["01n", "moon"],
  ["02d", "cloud-sun"],
  ["02n", "cloud-moon"],
  ["03d", "cloud"],
  ["03n", "cloud"],
  ["04d", "cloud"],
  ["04n", "cloud"],
  ["09d", "cloud-showers-heavy"],
  ["09n", "cloud-showers-heavy"],
  ["10d", "cloud-sun-rain"],
  ["10n", "cloud-moon-rain"],
  ["11d", "bolt-lightning"],
  ["11n", "bolt-lightning"],
  ["13d", "snowflake"],
  ["13n", "snowflake"],
  ["50d", "smog"],
  ["50n", "smog"],
]);

const appid = "a09956e0f22ffcf4bec16e921e0dc33e";

const Weather = () => {
  const [weather, setWeather] = useState();

  const getWeather = async () => {
    const params = new URLSearchParams({
      lat: "49.19181",
      lon: "9.22804",
      appid: "a09956e0f22ffcf4bec16e921e0dc33e",
      units: "metric",
    });

    fetch("https://api.openweathermap.org/data/2.5/onecall?" + params)
      .then((res) => res.json())
      .then((res) => {
        setWeather(res);
      });
  };

  const getHours = (time) => {
    time *= 1000;
    let date = new Date(time);
    let hours = String(date.getHours()).padStart(2, "0");
    return hours;
  };

  useEffect(() => {
    getWeather();
    setInterval(() => {
      if (new Date().getMinutes() === 0) {
        getWeather();
      }
    }, 60000);
  }, []);

  if (weather) {
    return (
      <div>
        <div className="mb-1 flex justify-between">
          <div className="mt-0.5 text-5xl">
            {Math.round(weather.current.temp)}°
          </div>
          <div className="text-sm text-right">
            <i
              className={`fa-solid fa-${icons.get(
                weather.current.weather[0].icon
              )}`}
            ></i>
            <div className="font-semibold">
              {weather.current.weather[0].description}
            </div>
            <div className="flex text-xs justify-end">
              <div className="mr-1">
                H: {Math.round(weather.daily[0].temp.max)}
              </div>
              <div>L: {Math.round(weather.daily[0].temp.min)}</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-48 gap-2 overflow-x-auto">
          <ul className="list-none flex">
            {weather.hourly.map((hour) => {
              return (
                <li key={hour.dt} className="mr-3 text-md text-center">
                  <div className="mb-0.5 text-gray-300">
                    {getHours(hour.dt)}
                  </div>
                  <div className="mb-0.5">
                    <i
                      className={`fa-solid fa-${icons.get(
                        hour.weather[0].icon
                      )}`}
                    ></i>
                  </div>
                  <div className="font-semibold">{Math.round(hour.temp)}°</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
};

export default Weather;
