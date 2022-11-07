import React, { useState } from "react";

export default function useVisualMode(initialMode) {

  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  function transition(newMode, replace = false) {
    if(replace === true){
      history.pop();
    }
    setMode(newMode);
    history.push(newMode);
    setHistory(history);
  }
  function back() {
    if(history.length <= 1){
      return;
    }
    let oldMode = history.pop(); 
    setMode(history[history.length-1]);
    setHistory(history);
  }

  return { mode, transition, back };
}