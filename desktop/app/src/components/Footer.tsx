import Image from "next/image"
import i from '../../public/imageR.jpeg'

export default function Footer({title, nome}) {
    return(
        <footer className="bg-zinc-800 border-zinc-700 border-t p-2 flex items-center justify-between fixed bottom-0 w-full">
            <div className="flex items-center gap-3">
                <Image src={i} alt="cover" width={84} height={84}></Image>
                <div className="flex flex-col">
                    <strong className="font-normal">{title}</strong>
                    <span className="text-xs text-zinc-400">{nome}</span>
                </div>
            </div>
            <div className="">
            </div>
            <div></div>
        </footer>
    )
}