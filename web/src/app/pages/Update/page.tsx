'use client'

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Avatar, AvatarIcon } from "@nextui-org/react";
import {Spinner} from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import { BiImageAdd, BiSolidArrowToBottom } from "react-icons/bi";
import ImagePicker from "@/components/ImagePicker";
import {api, baseURL} from '../../lib/api'

export default function UpdateMidia() {

    const [id,setId] =useState()
    const [titulo,setTitulo] = useState('')
    const [autor,setAutor] = useState('')
    const [historia,setHistoria] = useState('')
    const [grupo,setGrupo] = useState('')
    const [compo,setCompo] = useState('')
    const [editor,setEditor] = useState('')
    const [state,setState] = useState('')
    const [capa,setCapa] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [email,setEmail] = useState('')

    const router = useRouter()

    const handleTitle = (event) => {
        setTitulo(event.target.value)
    }

    const handleAutor = (event) => {
        setAutor(event.target.value)
    }

    const handleCompo = (event) => {
        setCompo(event.target.value)
    }

    const handleHistory = (event) => {
        setHistoria(event.target.value)
    }

    const handleEditor = (event) => {
        setEditor(event.target.value)
    }

    const handleGroup = (event) => {
        setGrupo(event.target.value)
    }

    function handleCancel() {
        localStorage.removeItem('midia')
        router.push('/pages/Home')
    }

    async function loadMidia(str) {
        await api.get(`midias/${str}`).
        then(async response => {

            const [c, d] = response.data.capa.split("uploads/");

            setCapa(d)
            setTitulo(response.data.titulo);
            setGrupo(response.data.grupo);
            setCompo(response.data.compositor);
            setEditor(response.data.editora);
            setHistoria(response.data.historia);
            setAutor(response.data.autor)
            setId(response.data.id);
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(()=>{

        const storedData = localStorage.getItem("user");
        const userData = JSON.parse(storedData);
        if (userData==null) {
            router.push('/');
        }
        setEmail(userData.data.email); 
        const storedMidia = localStorage.getItem("midia")
        loadMidia(storedMidia)
    },[])

    async function handleUpdateMedia(event) {
        event.preventDefault();

        setIsLoading(true);
        setState("Aguarde enquanto a sua mídia é editada")

        await api.put(`midias/${id}`,
        {
          
          titulo: titulo,
          autor: autor,
          grupo: grupo,
          compositor: compo,
          editora: editor,
          historia: historia,
        })

        setTitulo('');
        setGrupo('');
        setCompo('');
        setEditor('');
        setHistoria('');
        setAutor('')

        localStorage.removeItem('midia')
        
        // Definir o atraso para 15 segundos (15000 milissegundos)
        const delayInMilliseconds = 15000; // 15 segundos

        // Agendar a execução do redirecionamento após 15 segundos
        const timerId = setTimeout(() => {
            router.push('/pages/Home');
        }, delayInMilliseconds);
        
        setState("Mídia actualizada")
        setIsLoading(false);
        
        // Lembre-se de limpar o timer ao desmontar o componente para evitar vazamentos de memória
        return () => clearTimeout(timerId);

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
                                        />                            </div>
                        </div>
                        <h2 className="font-semibold text-2xl mt-10 flex justify-center">Edite os dados da mídia aqui</h2>
                        <form onSubmit={handleUpdateMedia}>
                            <div className="flex justify-center p-[50px] space-x-20 border-gray-100 border-1 rounded-sm">
                                <div className="w-[50%]">    
                                    <img src={`${baseURL}/uploads/${capa}`} alt=""/>
                                </div>
                                
                                <div className="flex-col">
                                    <div>
                                    <label
                                    htmlFor="titulo">
                                    </label>
                                        <input name="titulo" required onChange={handleTitle} type="text" value={titulo} placeholder="Título *" className="w-[100%] rounded-md pl-2 h-10 mb-4 outline-none"/>
                                    </div>
                                    <div>
                                        <label
                                        htmlFor="autor">
                                        </label>
                                        <input name="autor" required onChange={handleAutor} type="text" value={autor} placeholder="Autor *" className="w-[100%] rounded-md pl-2 h-10 mb-4 outline-none"/>
                                    </div>
                                    <div>
                                    <label
                                    htmlFor="grupo">
                                    </label>
                                        <input name="grupo" onChange={handleGroup} type="text" value={grupo} placeholder="Grupo" className="w-[100%] rounded-md pl-2 h-10 mb-4 outline-none"/>
                                    </div>
                                    <div>
                                    <label
                                    htmlFor="compositor">
                                    </label>
                                        <input name="compositor" onChange={handleCompo} type="text" value={compo} placeholder="Compositor(a)" className="w-[100%] rounded-md pl-2 h-10 mb-4 outline-none"/>
                                    </div>
                                    <div>
                                        <label
                                        htmlFor="editor">
                                        </label>
                                        <input name="editor" onChange={handleEditor} type="text" value={editor} placeholder="Editor(a)" className="w-[100%] rounded-md pl-2 h-10 mb-4 outline-none"/>
                                    </div>
                                    <div>
                                        <label
                                        htmlFor="historia">
                                        </label>
                                        <textarea name="historia" rows="5" cols="50" onChange={handleHistory} value={historia} placeholder="História" className="w-[100%] rounded-md pl-2 h-20 mb-4 outline-none"></textarea>
                                    </div>
                                    <div className="space-x-2">
                                        <button className="text-gray-100 border-2 border-gray-200 rounded-xl w-[40%] p-2 hover:border-green-600 hover:text-green-600" onClick={handleCancel}> Cancelar </button>
                                        <button className="text-gray-100 border-2 border-gray-200 rounded-xl w-[40%] p-2 hover:border-green-600 hover:text-green-600" type="submit"> Guardar edição </button>
                                    </div>
                                    <div className="mt-2 text-gray-100">
                                        {isLoading && <Spinner color="success"/>}
                                        {state}
                                    </div>
                                    <div className="text-gray-100 mt-3">
                                        Att: os campo com * são obrigatórios!
                                    </div>

                            </div>
                            </div>
                            </form>
                               
                    </main>
                </div>
            </div>
        </>
    )
}