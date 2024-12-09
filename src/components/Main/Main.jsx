import React, { createContext, useContext, useState } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import { ThemeContext } from "../../ThemeContext";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    setRecentPrompt
  } = useContext(Context);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isListening, setIsListening] = useState(false);

  const startSpeechRecognition = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      alert(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className={`main ${theme}`}>
      <div className="nav">
        <p className={`title ${theme}`} onClick={() => window.location.reload()}>Gemini</p>
        <img src={assets.jw_pfp} alt="" />
      </div>
      <div className={`main-container ${theme}`}>
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>{isListening ? "I'm listening" : "Hello, there"}</span>
              </p>
            </div>
          </>
        ) : (
          <div className={`result ${theme}`}>
            <div className="result-title">
              <img src={assets.jw_pfp} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className={`search-box ${theme}`}>
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Ask Gemini"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSent();
                }
              }}
            />
            <div>
              <img
                onClick={toggleTheme}
                src={assets.light_mode}
                alt="Toggle Theme"
              />
              <img
                onClick={() => {
                  startSpeechRecognition();
                }}
                src={assets.mic}
                alt="Start Speech Recognition"
              />
              {input ? (
                <img
                  onClick={() => onSent()}
                  src={assets.send_icon}
                  alt=""
                  style={{
                    transform: input ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.3s ease-in-out",
                  }}
                />
              ) : null}
            </div>
          </div>
          <p className="bottom-info"></p>
        </div>
      </div>
    </div>
  );
};

export default Main;
