import { Typing } from "./typing";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black">
      <div id="spotlight" className="mx-auto"></div>
      <Typing />
    </main>
  );
}
