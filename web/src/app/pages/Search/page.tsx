'use client'

import Sidebar from '@/components/Sidebar'
import { Avatar, AvatarIcon } from '@nextui-org/react'
import React, { useState, useEffect } from "react";
import { DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import { SearchIcon } from '../../../../public/SearchIcon'
import CardM from "../../../components/CardM";
import { api, baseURL } from '@/app/lib/api';
import { useRouter } from 'next/navigation';
import { PenLine } from 'lucide-react';


export default function Search() {

    const [adm,setAdm] = useState('')
    const [search,setSearch] = useState('')
    const [midias, setMidias] = useState([])
    const [musicas,setMusicas] = useState([])
    const [videos,setVideos] = useState([])
    const [midiasF,setMidiaF] = useState([])
    const [visible,setVisible] = useState(false)

    const router = useRouter()
    
    function loadMidias() {
        api.get(`/midias`)
            .then(async response => {
                const midiasA = response.data
                setMidias(response.data)
                console.log('Response Data:', midias);
    
                const musicasFiltradas = midiasA.filter((midia) => midia.tipo === 'audio');
                const videosFiltrados = midiasA.filter((midia) => midia.tipo === 'video')
    
                setMusicas(musicasFiltradas);
                setVideos(videosFiltrados);
            }).catch(error => {
                console.error('Error fetching midias:', error);
        });
    }

    function handleView(id) {
        localStorage.setItem("midia",id)
        router.push('/pages/ViewMidia')
    }

    const handleEdit = (event, id) => {
        event.stopPropagation();
        localStorage.setItem("midia", id);
        router.push('/pages/Update');
    };

    const handleBring = () => {
        setVisible(true);
        const searchLower = search.toLowerCase();
      
        // Filtrar mídias que correspondam a qualquer uma das propriedades: título, autor, editora, compositor ou grupo
        const midiasFiltradas = midias.filter((midia) =>
          midia.titulo.toLowerCase().includes(searchLower) ||
          midia.autor.toLowerCase().includes(searchLower) ||
          midia.editora.toLowerCase().includes(searchLower) ||
          midia.compositor.toLowerCase().includes(searchLower) ||
          midia.grupo.toLowerCase().includes(searchLower)
        );
      
        setMidiaF(midiasFiltradas);
    };
      

    const handleSearch = (event) => {
        setSearch(event.target.value);
      };

    useEffect(() => {
        const storedData = localStorage.getItem("user");
        const userData = JSON.parse(storedData);

        if (userData===null) 
            router.push('/');
        
        setAdm(userData.data.admin)
        loadMidias()
        
    }, []);


    return(
        <>
            <div className="h-screen flex flex-col">
                <div className="flex flex-1">
                    <Sidebar></Sidebar>
                    <main className="flex-1 bg-zinc-900 p-6">
                        <div className="flex justify-between items-center">
                            <div className="w-[50%] flex items-center border-zinc-500 hover:border-zinc-50 border-1 rounded-3xl h-[55px]">
                                <input type="text" value={search} onChange={handleSearch} className='w-[80%] h-full bg-transparent rounded-3xl rounded-r-none pl-4 outline-zinc-100' placeholder='O que quer ouvir?'/> 
                                <Button className='bg-green-800 h-full w-[20%] rounded-3xl rounded-l-none' onClick={()=>handleBring()}>Procurar</Button>
                            </div>
                            <div>
                                <Avatar
                                    icon={<AvatarIcon />}
                                    classNames={{
                                    base: "bg-gradient-to-br from-[#00FF00] to-[#32CD32]",
                                    icon: "text-black/80",
                                    }}
                                />  
                            </div>  
                        </div>
                        <h2 className="font-semibold text-2xl mt-10 flex justify-center">Procura tudo</h2>
                        {
                            (!visible || search==='') && 
                            <>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div  className="bg-white/5 flex flex-col gap-2 p-2 rounded hover:bg-white/10">
                                        <CardM></CardM>
                                    </div>
                                    <div  className="bg-white/5 flex flex-col gap-2 p-2 rounded hover:bg-white/10">
                                        <CardM></CardM>
                                    </div>
                                    <div  className="bg-white/5 flex flex-col gap-2 p-2 rounded hover:bg-white/10">
                                        <CardM></CardM>
                                    </div>
                                    <div  className="bg-white/5 flex flex-col gap-2 p-2 rounded hover:bg-white/10">
                                        <CardM></CardM>
                                    </div>
                                </div>
                            </>
                        }
                        {
                            (visible && search!=='') && 
                            <>
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {midiasF.map(midia => {

                                        const [c, d] = midia.capa.split("uploads/");

                                        return(
                                                <div key={midia.id} onClick={() => handleView(midia.id)} className="bg-white/5 flex flex-col gap-2 p-2 rounded hover:bg-white/10">
                                                    <img src={`${baseURL}/uploads/${d}`} alt={midia.titulo} className="w-full h-[220px]" />
                                                    <div className="flex justify-between items-center">
                                                        <strong className="font-semibold">{midia.titulo}</strong>
                                                        <div className="flex items-center gap-2">
                                                            {(adm === 'true') && (
                                                                <PenLine onClick={(event) => handleEdit(event, midia.id)} />
                                                            )}
                                                        </div>
                                                    
                                                    </div>
                                                    <span className="text-sm text-zinc-400">{midia.tipo}</span>
                                                    <span className="text-sm text-zinc-400">{midia.historia}</span>
                                                </div>
                                    )})}
                                </div>
                            </>
                        }
                        
                    </main>
                </div>
            </div>
        </>
    )
}
