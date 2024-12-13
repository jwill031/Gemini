import { createContext, useEffect, useState } from 'react';
import runChat from '../config/gemini';
import Prism from 'prismjs';
import 'prism-themes/themes/prism-vsc-dark-plus.css';
import { assets } from '../assets/assets';

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState('');
  const [recentPrompt, setRecentPrompt] = useState('');
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState('');

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const copy = (text) => {
    text.select();
    navigator.clipboard.writeText(text.value);
  };

  const formatCodeBlocks = (text) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

    return text.replace(codeBlockRegex, (match, lang, code) => {
      const highlightedCode = Prism.highlight(
        code,
        Prism.languages[lang] || Prism.languages.javascript,
        lang
      );

      return `<div class="code-block"><pre class="language-${lang}"><code class="language-${lang}">${highlightedCode}</code></pre></div>`;
    });
  };

  const replaceOutsideCodeBlocks = (text, replacementFn) => {
    const codeBlockRegex = /```[\s\S]*?```/g;
    let lastIndex = 0;
    let result = '';

    const matches = [...text.matchAll(codeBlockRegex)];

    matches.forEach((match) => {
      result += replacementFn(text.slice(lastIndex, match.index));
      result += match[0];
      lastIndex = match.index + match[0].length;
    });

    result += replacementFn(text.slice(lastIndex));
    return result;
  };

  const onSent = async (prompt) => {
    setResultData('');
    setLoading(true);
    setShowResult(true);

    let response;
    if (prompt !== undefined) {
      response = await runChat(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await runChat(input);
    }

    const formattedResponse = replaceOutsideCodeBlocks(
      response,
      (text) =>
        text
          .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
          .replace(/(?<!`)\*(.*?)\*/g, '&#8226; $1')
          .replace(/\n+/g, '<br>')
    );

    const finalResponse = formatCodeBlocks(formattedResponse);

    let newResponseArr = finalResponse.split(' ');

    for (let i = 0; i < newResponseArr.length; i++) {
      const nextWord = newResponseArr[i];
      delayPara(i, nextWord + ' ');
    }

    setLoading(false);
    setInput('');
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
  };

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;
