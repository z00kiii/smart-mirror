import React from "react";
import { mirrorId } from "../Spotify/spotifyData";
import { useState } from "react";
import audio from "./timerBeep.mp3";

const Controlbar = ({ spotifyApi }) => {
  const [timerOn, setTimerOn] = useState(false);
  const [meditateOn, setMeditateOn] = useState(false);
  const [countdownOn, setCountdownOn] = useState(false);
  const [timerInterval, setTimerInterval] = useState();
  const [meditateTimeout, setMeditateTimeout] = useState();
  const [countdownTimeout, setCountdownTimeout] = useState();

  const timerBeep = new Audio(audio);
  timerBeep.volume = 0.5;
  const meditationDuration = 900000;
  const timerDuration = 30000;
  const countdownDuration = 150000;

  const toggleTimer = () => {
    if (meditateOn) {
      clearTimeout(meditateTimeout);
      setMeditateOn(false);
    }
    if (timerOn) {
      clearInterval(timerInterval);
    } else {
      setTimeout(() => {
        timerBeep.play();
        setTimerInterval(
          setInterval(() => {
            timerBeep.play();
          }, timerDuration)
        );
      }, 6000);
    }
    setTimerOn(!timerOn);
  };

  const toggleCountdown = () => {
    if (countdownOn) {
      clearTimeout(countdownTimeout);
    } else {
      setCountdownTimeout(
        setTimeout(() => {
          timerBeep.play();
          setCountdownOn(false);
        }, countdownDuration)
      );
    }
    setCountdownOn(!countdownOn);
  };

  const toggleMeditation = () => {
    if (timerOn) {
      clearInterval(timerInterval);
      setTimerOn(false);
    }
    if (meditateOn) {
      clearTimeout(meditateTimeout);
    } else {
      spotifyApi.skipToNext().then(() => {
        setTimeout(() => {
          console.log("pause");
          spotifyApi.pause();
        }, 1000);
      });
      spotifyApi.setVolume(65);
      setMeditateTimeout(
        setTimeout(() => {
          spotifyApi.transferMyPlayback([mirrorId]).then(() => {
            spotifyApi.play();
            setMeditateOn(false);
          });
        }, meditationDuration)
      );
    }
    setMeditateOn(!meditateOn);
  };

  return (
    <div>
      <div className="flex justify-center mt-8">
        <button onClick={toggleTimer}>
          <i
            className={`fa-solid fa-stopwatch fa-xl ${
              timerOn ? "text-gray-50" : "text-gray-500"
            }`}
          ></i>
        </button>
      </div>
      <div className="flex justify-center mt-8">
        <button onClick={toggleCountdown}>
          <i
            className={`fa-solid fa-xl ${
              countdownOn
                ? "text-gray-50 fa-hourglass-start"
                : "text-gray-500 fa-hourglass-end"
            }`}
          ></i>
        </button>
      </div>
      <div className="flex justify-center mt-8">
        <button onClick={toggleMeditation}>
          <i
            className={`fa-solid fa-spa fa-xl ${
              meditateOn ? "text-gray-50" : "text-gray-500"
            }`}
          ></i>
        </button>
      </div>
    </div>
  );
};

export default Controlbar;
