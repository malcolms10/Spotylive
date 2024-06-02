"use client"

import { HomeIcon, Search, Library, BoomBox, Plus } from "lucide-react";
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react';


export default function Sidebar() {

    const router = useRouter()

    function handleLogOut(params:type) {
        localStorage.clear()
        router.push('/')
    }

    return(
        <aside className="w-[20%] bg-zinc-950 p-6">
            <nav className="space-y-4 mb-5 pb-5 border-b border-zinc-800">
                <a href="/pages/Home" className="text-zinc-300 font-semibold text-sm gap-4 flex items-center"><HomeIcon></HomeIcon> Página Inicial</a>
                <a href="" className="text-zinc-300 font-semibold text-sm gap-4 flex items-center"><Search></Search> Procurar</a>
                <a href="" className="text-zinc-300 font-semibold text-sm gap-4 flex items-center"><Library></Library> Sua Biblioteca</a>
                <a href="/pages/Radio" className="text-zinc-300 font-semibold text-sm gap-4 flex items-center"><BoomBox></BoomBox> Rádio</a>
            </nav>
            <div className="space-y-4">
                <a href="/pages/NewMidia" className="flex items-center justify-between text-zinc-100">Nova mídia<Plus className="hover:bg-zinc-800 rounded-full" /></a>
                <a href="/pages/Playlist" className="flex items-center justify-between text-zinc-100">Nova playlist<Plus className="hover:bg-zinc-800 rounded-full" /></a>
            </div>
            
            <div className="mt-5 pt-5 border-t border-zinc-800">
                <div className="flex text-zinc-300 font-semibold text-sm gap-4 items-center" onClick={handleLogOut}>
                    <LogOut /><p>Terminar sessão</p>
                </div>
            </div>
            
        </aside>
    )
}