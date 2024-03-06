import AppComponent from "@/components/AppComponent";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center  p-20">
        <div className=" font-bold text-3xl " >
        Staking App
      </div>
      <AppComponent />
    </main>
  );
}
