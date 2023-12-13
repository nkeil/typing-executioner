"use client";

import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { clsx } from "clsx";
import { getWordDifference } from "@/utils/typing";

const words = "The quick brown fox jumped over the lazy dog".split(" ");

export function Typing() {
  const [currentWord, setCurrentWord] = useState(0);
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const [numMistakes, setNumMistakes] = useState(0);

  const difference = useMemo(() => {
    return getWordDifference(input.trimEnd(), words[currentWord]);
  }, [input, currentWord]);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput(e.target.value);
    if (e.target.value.length > input.length) playAudio();
  };

  const finishWord = useCallback(() => {
    setNumMistakes((m) => m + difference.result);
    if (currentWord + 1 < words.length) setCurrentWord((value) => value + 1);
    else setDone(true);
    setInput("");
  }, [currentWord, difference.result]);

  const restart = () => {
    setCurrentWord(0);
    setInput("");
    setDone(false);
    setNumMistakes(0);
  };

  const playAudio = () => {
    new Audio("/sniper.mp3")?.play();
  };

  useEffect(() => {
    if (input.includes(" ")) finishWord();
  }, [finishWord, input]);

  return (
    <div className="p-10 bg-transparent text-blood-red">
      {done ? (
        <div className="flex flex-col gap-5 items-center">
          <div>
            Done. You made{" "}
            {numMistakes === 1 ? "1 mistake" : `${numMistakes} mistakes`}.
          </div>
          <button className="px-5 py-2" onClick={restart}>
            Restart?
          </button>
        </div>
      ) : (
        <div className={"w-full flex flex-col gap-5 items-center text-white"}>
          <div className="text-center">
            <span>{words.slice(0, currentWord).join(" ")}</span>
            <span>{currentWord > 0 ? " " : ""}</span>
            <span className="bg-red-700">
              {difference.diff.map((char, i) => (
                <span
                  key={i}
                  className={clsx({
                    "bg-yellow-900": char.type === "CORRECT",
                    "bg-gray-800": char.type === "FUTURE",
                    "bg-[#8A0707]":
                      char.type === "MISSING" ||
                      char.type === "WRONG" ||
                      char.type === "EXTRA",
                  })}
                >
                  {char.value}
                </span>
              ))}
            </span>
            <span>{currentWord < words.length - 1 ? " " : ""}</span>
            <span>{words.slice(currentWord + 1).join(" ")}</span>
          </div>
          <div className="mx-auto text-white border border-red-500">
            <input
              className="bg-black"
              onChange={onInputChange}
              value={input}
            />
          </div>
          <div>Current word difference: {difference.result}</div>
          <div>Total number of mistakes: {numMistakes}</div>
        </div>
      )}
    </div>
  );
}
