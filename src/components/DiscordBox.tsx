export default function DiscordBox({ channelName, channelId }: { channelName: string, channelId: string }) {
    return (
        <div className="w-[500px] h-[600px] border rounded-lg shadow-lg p-4 bg-white text-black">
            <h3 className="text-xl font-semibold mb-2">{channelName}</h3>
            <iframe
                src={`https://discord.com/widget?id=${channelId}&theme=light`}
                width="100%"
                height="90%"
                allowTransparency={true}
                frameBorder="0"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            ></iframe>
        </div>
    );
}
