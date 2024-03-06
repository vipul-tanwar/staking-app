import AppComponent from "@/components/AppComponent";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>
        Staking App
      </div>
      <AppComponent />
    </main>
  );
}
