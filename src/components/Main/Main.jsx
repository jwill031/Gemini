import React, { createContext, useContext, useState } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'
import { ThemeContext } from '../../ThemeContext'

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    setRecentPrompt,
  } = useContext(Context)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const [isListening, setIsListening] = useState(false)

  const askForName = () => {
    let q = window.prompt('Enter your name')
    return q
  }

  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.continuous = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('')
      setInput(transcript)
    }

    recognition.onerror = (event) => {
      alert(`Speech recognition error: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const greeting = () => {
    const now = new Date()
    const hrs = now.getHours()

    if (hrs > 4 && hrs < 12) {
      return `Good Morning`
    } else if (hrs > 12 && hrs < 18) {
      return 'Good Afternoon'
    } else {
      return 'Good Evening'
    }
  }

  return (
    <div className={`main ${theme}`}>
      <div className="nav">
        <p className={`title ${theme}`} onClick={() => window.location.reload()}>
          Gemini
        </p>
        <div className={`profile-container ${theme}`}>
          <button className={`enter-name ${theme}`} onClick={askForName}>
            <img className="gem-icon" src={assets.gemini} alt="" />
            Try Gemini Advanced
          </button>
          <div className={`seperate ${theme}`}>
            <img src={assets.show_apps} className={`show-apps ${theme}`} alt="" />
          </div>
          <img src={assets.jw_pfp} className="pfp" alt="" />
        </div>
      </div>
      <div className={`main-container ${theme}`}>
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>{isListening ? "I'm listening" : greeting()}</span>
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
            <textarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Ask Gemini"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  onSent()
                }
              }}
              onInput={(e) => {
                const target = e.target
                target.style.height = 'auto' // Reset height to calculate new height
                target.style.height = `${Math.min(target.scrollHeight, 200)}px` // Set new height up to max
              }}
            />
            <div className="buttons-container">
              <img onClick={toggleTheme} src={assets.light_mode} alt="Toggle Theme" />
              <img
                onClick={() => {
                  startSpeechRecognition()
                }}
                src={assets.mic}
                alt="Start Speech Recognition"
              />
              {input ? (
                <img
                  className="send-button"
                  onClick={() => onSent()}
                  src={assets.send}
                  alt=""
                  style={{
                    transform: input ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.3s ease-in-out',
                  }}
                />
              ) : null}
            </div>
          </div>
          <p className="bottom-info"></p>
        </div>
      </div>
    </div>
  )
}

export default Main
