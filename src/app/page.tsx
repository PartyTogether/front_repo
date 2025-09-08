"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DiscordBox from "@/components/DiscordBox";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <>
            <Header />

            <main className="pt-16">
                <section className="px-4 md:px-6 py-12">
                    <Hero />
                    <div className="flex flex-col md:flex-row justify-center gap-6 my-12">
                        <DiscordBox channelName="망가진 용의 둥지" channelId="guild" />
                        <DiscordBox channelName="다크 와이번의 둥지" channelId="boss" />
                        <DiscordBox channelName="불과 어둠의 전장" channelId="free" />
                    </div>

                </section>
                <Footer />
            </main>
        </>
    );
}