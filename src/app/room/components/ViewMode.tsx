import {cn} from "@/lib/utils";
import { tw } from "@/styles/common";
import {validators} from "tailwind-merge";
interface ViewModeProps{
    viewMode : string;
    setViewMode : (mode:string) => void;
}
export default function( {viewMode, setViewMode}:ViewModeProps){
    const style = {
        roomInfoNavDiv: "flex justify-center gap-10 pb-2 border-gray-300 ",
        roomInfoNavBtn: "text-gray-700 font-medium rounded-lg py-2 px-4 hover:bg-gray-200 hover:text-[#5865F2]",
    }

    return(
        <div className={style.roomInfoNavDiv}>
            <button className={cn(style.roomInfoNavBtn, viewMode === "MY_PARTY"
                && tw.selectedBtn)}
                    onClick={() => {
                        setViewMode("MY_PARTY");
                    }}
            >
                내 파티 보기
            </button>
            <button className={cn(style.roomInfoNavBtn, viewMode === "OTHER_PARTY"
                && tw.selectedBtn)}
                    onClick={() => {
                        setViewMode("OTHER_PARTY");
                    }}
            >
                다른 파티 보기
            </button>
            <button className={cn(style.roomInfoNavBtn, viewMode === "MAKE_PARTY"
                && tw.selectedBtn)}
                    onClick={() => {
                        setViewMode("MAKE_PARTY");
                    }}
            >
                파티 만들기
            </button>
        </div>
    );
}