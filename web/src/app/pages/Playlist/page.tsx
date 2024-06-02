'use client'

import Sidebar from "@/components/Sidebar";
import { Avatar, AvatarIcon } from "@nextui-org/react";
import {api} from '../../lib/api'
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'



export default function Playlist() {

    const router = useRouter()

    const [playlists,setPlaylists] = useState([])
    const [nome,setNome] = useState()
    const [checkbox1, setCheckbox1] = useState(false);
    const [userId,setUserId] = useState()

    const handleNome = (event) => {
        setNome(event.target.value)
    }

    const handleCheckbox1 = () => {
        setCheckbox1(!checkbox1);
    };

    const handleCreate = async () =>{
        const data = {
            userId, nome: nome, visibility: String(checkbox1)
        }
        await api.post(`/playlist`,data)
        setCheckbox1(!checkbox1)
        setNome('')
    }

    async function loadPlaylists(id) {
        
        await api.get(`playlist/${id}`)
        .then(async reply =>{
            console.log(reply.data)
            setPlaylists(reply.data)
        })
    }

    useEffect(() => {
        const storedData = localStorage.getItem("user");
        if (storedData) {
            const userData = JSON.parse(storedData);
            if (userData == null) {
                router.push('/');
            } else {
                setUserId(userData.data.id); 
                loadPlaylists(userId)
            }
        } else {
            router.push('/');
        }
    }, [playlists]);
    
    return(
        <>
        <div className="h-screen flex flex-col">
            <div className="flex flex-1">
                <Sidebar></Sidebar>
                <main className="flex-1 bg-zinc-900 p-6">
                    <div className="flex justify-end">
                        <div className="flex items-center gap-3">
                        <Avatar
                                    icon={<AvatarIcon />}
                                    classNames={{
                                    base: "bg-gradient-to-br from-[#00FF00] to-[#32CD32]",
                                    icon: "text-black/80",
                                    }}
                                /> 
                        </div>
                    </div>
                    <h2 className="font-semibold text-2xl mt-10 flex justify-center">Adicionar nova playlist</h2>
                    <div className="ml-4 mt-10">
                        <label
                        htmlFor="titulo" className="text-black">
                        
                        <input name="nome" required onChange={handleNome} type="text" value={nome} placeholder="Nome da Plalyst *" className="w-[100%] rounded-md pl-2 h-10 mb-4 outline-none bg-zinc-800"/>
                        </label>
                        <label className="text-zinc-50 rounded-lg p-2 mr-4">
                                <input className="mr-2" type="checkbox" id="checkbox1" onClick={handleCheckbox1} checked={checkbox1}/>
                                Tornar playlist pública
                        </label>
                        <button className="text-gray-100 border-2 border-gray-200 rounded-xl w-[40%] p-2 hover:border-green-600 hover:text-green-600" onClick={handleCreate}> Criar playlist </button>

                    </div>   
                    <h2 className="mt-10 mb-2 text-xl text-center">Minhas Playlists</h2>
                    {playlists.map(playlist=>{ 
                        return(
                            <div key={playlist.id} className="text-gray-100">
                                <div className="ml-4 pl-2 mt-2 border-b-2">
                                    {playlist.nome}
                                </div>                                    
                            </div>
                        )
                        })
                    }    
                </main>
            </div>
        </div>
    </>
    )
}