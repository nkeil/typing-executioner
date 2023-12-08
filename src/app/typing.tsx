"use client";

import { ChangeEventHandler, useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { getWordDifference } from "@/utils/typing";

const words = "The quick brown fox jumped over the lazy dog".split(" ");

export function Typing() {
  const [currentWord, setCurrentWord] = useState(0);
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const [numMistakes, setNumMistakes] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setAudio(new Audio("/sniper.mp3"));
  }, []);

  const difference = useMemo(() => {
    return getWordDifference(input.trimEnd(), words[currentWord]);
  }, [input, currentWord]);

  useEffect(() => {
    if (input.includes(" ")) {
      setNumMistakes((m) => m + difference.result);
      if (currentWord + 1 < words.length) setCurrentWord((value) => value + 1);
      else setDone(true);
      setInput("");
    }
  }, [input, currentWord, difference]);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput(e.target.value);
    if (e.target.value.length > input.length) playAudio();
  };

  const restart = () => {
    setCurrentWord(0);
    setInput("");
    setDone(false);
    setNumMistakes(0);
  };

  const playAudio = () => {
    console.log("calling playAudio");
    audio?.play();
  };

  return (
    <div>
      {done ? (
        <div className="flex flex-col gap-5 items-center">
          <div>Done! You made {numMistakes} mistakes.</div>
          <button
            className="bg-black text-white rounded-md px-5 py-2"
            onClick={restart}
          >
            Restart?
          </button>
        </div>
      ) : (
        <div
          className={clsx([
            "w-full flex flex-col gap-5 items-center",
            {
              "bg-green-500": difference.result === 0,
              "bg-red-500": difference.result > 0,
            },
          ])}
        >
          <div className="text-center">
            <span>{words.slice(0, currentWord).join(" ")}</span>
            <span>{currentWord > 0 ? " " : ""}</span>
            <span className="bg-red-700">
              {difference.diff.map((char, i) => (
                <span
                  key={i}
                  className={clsx({
                    "bg-green-300": char.type === "CORRECT",
                    "bg-gray-300": char.type === "FUTURE",
                    "bg-red-800":
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
          <div className="mx-auto">
            <input onChange={onInputChange} value={input} />
          </div>
          <div>Difference: {difference.result}</div>
          <div>Number of mistakes: {numMistakes}</div>
        </div>
      )}
    </div>
  );
}
