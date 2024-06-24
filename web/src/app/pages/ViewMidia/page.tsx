'use client'

import Sidebar from '@/components/Sidebar'
import Image from 'next/image'
import { Avatar,AvatarIcon } from '@nextui-org/react'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { api } from '@/app/lib/api';
import i from '../../../../public/imageR.jpeg'
import { SendHorizontal } from 'lucide-react'
import { baseURL } from '@/app/lib/api'

export default function Radio() {

    const router = useRouter()

    const [email,setEmail] = useState()
    const [titulo,setTitulo] = useState()
    const [autor,setAutor] = useState()
    const [historia,setHistoria] = useState()
    const [grupo,setGrupo] = useState()
    const [compo,setCompo] = useState()
    const [editor,setEditor] = useState()
    const [path,setPath] = useState()
    const [coment,setComent] = useState('')
    const [mId,setMid] = useState()
    const [uId,setUid] = useState()
    const [name,setName] = useState()
    const [capa,setCapa] = useState()
    const [tipo,setTipo] = useState()
    const [coments,setComents] = useState([])
    const [midias,setMidias] = useState([])

    async function loadComents(str) {
        await api.get(`comments/${str}`).
        then(async response => {
            setComents(response.data)
        }).catch(error => {
            console.log(error)
        })
    }

    const handleComentChange = (event) => {
        setComent(event.target.value);
    };

    async function handleCreateComent() {
        const data = { coment: coment, userId: uId, midiaId: mId }
        await api.post(`/coments`,data)
        setComent('')
    }

    async function loadMidia(str) {
        await api.get(`midias/${str}/${uId}`).
        then(async response => {

            const [c, d] = response.data.path.split("uploads/");
            const [i, j] = response.data.capa.split("uploads/");

            setPath(d)
            setCapa(j)
            setTipo(response.data.tipo)
            setTitulo(response.data.titulo);
            setGrupo(response.data.grupo);
            setCompo(response.data.compo);
            setEditor(response.data.editor);
            setHistoria(response.data.historia);
            setName(response.data.userId)
            getUser(response.data.userId)
            setMid(response.data.id);
        }).catch(error => {
            console.log(error)
        })
    }

    function getUser(id) {
        api.get(`userId/${id}`).
        then(response=>{
            const [c, d] = response.data.email.split("@");
            setAutor(c)
            console.log(autor)
        }).
        catch(erro=>{
            console.log(erro)
        })
    }

    useEffect(()=>{
        const storedData = localStorage.getItem("user");
        if (storedData) {
            const userData = JSON.parse(storedData);
            if (userData == null) {
                router.push('/');
            } else {
                setEmail(userData.data.email); 
                setUid(userData.data.id)
                const storedMidia = localStorage.getItem("midia")
                setMid(storedMidia)
                loadMidia(storedMidia)
                loadComents(storedMidia)
            }
        } else {
            router.push('/');
        }
        
    },[])

    function handleUser(str) {
        api.get(`userId/${str}`).
        then(response=>{
            localStorage.setItem('perfil',JSON.stringify(response))
        }).
        catch(erro=>{
            console.log(erro)
        })
        router.push('/pages/Perfil')
    }

    return(
        <>
            <div className="h-screen flex flex-col">
                <div className="flex flex-1">
                    <Sidebar></Sidebar>
                    <main className="flex-1 bg-zinc-900 p-6">
                        <div className="flex justify-end">
                            <div className="flex items-center gap-3">
                                <p className="text-zinc-50">{email}</p>
                                <Avatar
                                            icon={<AvatarIcon />}
                                            classNames={{
                                            base: "bg-gradient-to-br from-[#00FF00] to-[#32CD32]",
                                            icon: "text-black/80",
                                            }}
                                        />
                            </div>
                        </div>

                        {/* apresentação da mídia */}
                        <div className="flex gap-6 mt-4">
                            <div className="w-[70%] ml-4">
                                <div className="">
                                    <video src={`${baseURL}/uploads/${path}`} controls className="w-[800px] h-[500px]" />
                                </div>
                                <div className="mt-2 mb-2"> 
                                    <p className="text-xl mb-4">{titulo}</p>
                                    <div className='flex items-center gap-3' onClick={()=>handleUser(name)}>
                                        <Avatar
                                            icon={<AvatarIcon />}
                                            classNames={{
                                            base: "bg-gradient-to-br from-[#00FF00] to-[#32CD32]",
                                            icon: "text-black/80",
                                            }}
                                        />
                                        <p className='text-xl'>{autor}</p>
                                    </div>
                                    
                                    <div className='bg-zinc-700 rounded-md w-full mt-4 mb-4 p-[1%]'>{historia}</div>
                                </div>
                                <div>
                                    Secção de comentários
                                    <div className="flex items-center space-x-1">
                                        <input onChange={handleComentChange} type="text" value={coment} className="w-[80%] bg-transparent border-b-2 border-gray-100 outline-none pl-2 mb-2 mt-4" placeholder='Adicione um comentário...'/>
                                        <SendHorizontal onClick={handleCreateComent}/>
                                    </div>
                                    <div className="mb-2">
                                    {coments.map(comment=>{ 
                                        return(
                                            <div key={comment.id} className="text-gray-100">
                                                <div>
                                                    {comment.coment}
                                                </div>                                    
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            </div>
                            <div className="flex-col">
                                <ol  className="mb-3">
                                    <li><Image src={i} alt="logo" className="w-[180px] h-[110px] transition-transform duration-300 transform-gpu hover:scale-110"/>Bad B</li>
                                    <li><Image src={i} alt="logo" className="w-[180px] h-[110px] transition-transform duration-300 transform-gpu hover:scale-110"/>Bad B</li>
                                    <li><Image src={i} alt="logo" className="w-[180px] h-[110px] transition-transform duration-300 transform-gpu hover:scale-110"/>Bad B</li>
                                    <li><Image src={i} alt="logo" className="w-[180px] h-[110px] transition-transform duration-300 transform-gpu hover:scale-110"/>Bad B</li>
                                    <li><Image src={i} alt="logo" className="w-[180px] h-[110px] transition-transform duration-300 transform-gpu hover:scale-110"/>Bad B</li>
                                </ol>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}
