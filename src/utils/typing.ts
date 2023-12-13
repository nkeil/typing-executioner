interface Difference {
  type: "FUTURE" | "CORRECT" | "MISSING" | "WRONG" | "EXTRA";
  value: string;
}

export function getWordDifference(word1: string, word2: string) {
  const memo = new Map<string, { diff: Difference; result: number }>();

  function helper(i1: number, i2: number) {
    const key = `${i1}:${i2}`;
    if (memo.has(key)) return memo.get(key)!;

    let ret: { diff: Difference; result: number };
    if (i1 >= word1.length) {
      ret = {
        diff: { type: "FUTURE", value: word2.substring(i2) },
        result: word2.length - i2,
      };
    } else if (i2 >= word2.length) {
      ret = {
        diff: { type: "EXTRA", value: word1.substring(i1) },
        result: word1.length - i1,
      };
    } else if (word1[i1] === word2[i2]) {
      ret = {
        diff: { type: "CORRECT", value: word1[i1] },
        result: helper(i1 + 1, i2 + 1).result,
      };
    } else {
      const add1 = helper(i1, i2 + 1);
      const sub1 = helper(i1 + 1, i2);
      const replace = helper(i1 + 1, i2 + 1);
      if (add1.result <= sub1.result && add1.result <= replace.result) {
        ret = {
          diff: { type: "MISSING", value: word2[i2] },
          result: 1 + add1.result,
        };
      } else if (sub1.result <= add1.result && sub1.result <= replace.result) {
        ret = {
          diff: { type: "EXTRA", value: word1[i1] },
          result: 1 + sub1.result,
        };
      } else {
        ret = {
          diff: { type: "WRONG", value: word2[i2] },
          result: 1 + replace.result,
        };
      }
    }

    memo.set(key, ret);
    return ret;
  }
  const { result } = helper(0, 0);

  const fullDiff = [];
  let [i1, i2] = [0, 0];
  while (i1 <= word1.length && i2 <= word2.length) {
    const nextDiff = memo.get(`${i1}:${i2}`);
    if (!nextDiff) throw new Error();
    fullDiff.push(nextDiff.diff);
    if (i1 === word1.length || i2 === word2.length) break;
    if (nextDiff.diff.type === "CORRECT") {
      i1++;
      i2++;
    } else if (nextDiff.diff.type === "MISSING") {
      i2++;
    } else if (nextDiff.diff.type === "EXTRA") {
      i1++;
    } else if (nextDiff.diff.type === "WRONG") {
      i1++;
      i2++;
    }
  }
  return { result, diff: fullDiff };
}
