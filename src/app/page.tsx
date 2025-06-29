import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import DiscordBox from "@/components/DiscordBox";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="flex min-h-screen">
            <Sidebar />
            <section className="pl-64 ml-10 px-6 py-12">
                <Hero />
                <div className="flex justify-center gap-6 my-12">
                    <DiscordBox channelName="길드 채팅" channelId="guild" />
                    <DiscordBox channelName="보스 모집" channelId="boss" />
                    <DiscordBox channelName="자유 채팅" channelId="free" />
                </div>
                <Footer />
            </section>
        </main>
    );
}
