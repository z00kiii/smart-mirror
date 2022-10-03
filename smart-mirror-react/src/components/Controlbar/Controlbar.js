import React from "react";
import "./Controlbar.css";
import "./ControlbarButton.js";
import { mirrorId } from "../Spotify/spotifyData";
import { useState } from "react";
import audio from "./timerBeep.mp3";
import ControlbarButton from "./ControlbarButton.js";

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

  const reloadPage = () => {
    window.location = "/";
  };

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
      spotifyApi.setVolume(50);
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
      <ControlbarButton
        callback={reloadPage}
        style={"fa-redo"}
        status={false}
      ></ControlbarButton>
      <ControlbarButton
        callback={toggleTimer}
        style={"fa-stopwatch"}
        status={timerOn}
      ></ControlbarButton>
      <ControlbarButton
        callback={toggleCountdown}
        style={"fa-hourglass-end"}
        toggledStyle={"fa-hourglass-start"}
        status={countdownOn}
      ></ControlbarButton>
      <ControlbarButton
        callback={toggleMeditation}
        style={"fa-spa"}
        status={meditateOn}
      ></ControlbarButton>
    </div>
  );
};

export default Controlbar;
