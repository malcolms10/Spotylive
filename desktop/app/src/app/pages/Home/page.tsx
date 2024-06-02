'use client'

import { Avatar, AvatarIcon, Button, Checkbox, Image } from "@nextui-org/react";
import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from 'next/navigation';
import { api, baseURL } from '../../lib/api';
import { Play, ListPlus, PenLine } from "lucide-react";

export default function Home() {
    const router = useRouter();

    const [id,setId] = useState('');
    const [adm,setAdm] = useState('');
    const [email, setEmail] = useState('');
    const [midias, setMidias] = useState([]);
    const [musicas, setMusicas] = useState([]);
    const [videos, setVideos] = useState([]);
    const [titulo,setTitulo] = useState()
    const [autor,setAutor] = useState()
    const [historia,setHistoria] = useState()
    const [grupo,setGrupo] = useState()
    const [compo,setCompo] = useState()
    const [editor,setEditor] = useState()
    const [path,setPath] = useState()
    const [capa,setCapa] = useState()
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    const dialogRef = useRef(null);
    const [playlists, setPlaylists] = useState([]);
    const [visible,setVisible] = useState(false)

    function handleView(id) {
        localStorage.setItem("midia", id);
        router.push('/pages/ViewMidia');
    }

    const handleEdit = (event, id) => {
        event.stopPropagation();
        localStorage.setItem("midia", id);
        router.push('/pages/Update');
    };

    const handlePlay = async (id) => {
        setVisible(true)
        
            await api.get(`midias/${id}`).
            then(async response => {
    
                const [c, d] = response.data.path.split("uploads/");
                const [i, j] = response.data.capa.split("uploads/");
    
                setPath(d)
                setCapa(j)
                setTitulo(response.data.titulo);
                setGrupo(response.data.grupo);
                setCompo(response.data.compositor);
                setEditor(response.data.editora);
                setHistoria(response.data.historia);
                setAutor(response.data.autor)
                //setName(response.data.userId)
                //getUser(response.data.userId)
                //setMid(response.data.id);
            }).catch(error => {
                console.log(error)
            })

    }

    function loadMidias() {
        api.get('midias')
            .then(async response => {
                const midiasA = response.data;
                setMidias(midiasA);
                console.log('Response Data:', midiasA);

                const musicasFiltradas = midiasA.filter(midia => midia.tipo === 'audio');
                const videosFiltrados = midiasA.filter(midia => midia.tipo === 'video');

                console.log('Filtered Music:', musicasFiltradas);
                console.log('Filtered Videos:', videosFiltrados);

                setMusicas(musicasFiltradas);
                setVideos(videosFiltrados);
            })
            .catch(error => {
                console.error('Error fetching midias:', error);
            });
    }

    const abrirPopUp = (event) => {
        event.stopPropagation();
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    };

    const fecharPopUp = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
    };

    const handleAdicionarMidia = async (playlistId, midiaId) => {
        console.log(playlistId+' '+midiaId)
        try {
            const response = await api.post('/adicionar-midia-na-playlist', {
                playlistId: playlistId,
                midiaId: midiaId,
            });

            console.log(response.data.message);
        } catch (error) {
            console.error('Erro ao adicionar mídia na playlist:', error);
        }
    };

    const handleCheckboxChange = (id) => {
        setSelectedPlaylists(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(playlistId => playlistId !== id)
                : [...prevSelected, id]
        );
    };

    async function loadPlaylists() {
        await api.get('playlist')
            .then(async reply => {
                console.log(reply.data);
                setPlaylists(reply.data);
            });
    }

    useEffect(() => {
        const storedData = localStorage.getItem("user");
        if (storedData) {
            const userData = JSON.parse(storedData);
            if (userData == null) {
                router.push('/');
            } else {
                setEmail(userData.data.email);
                setId(userData.data.id)
                setAdm(userData.data.admin)
                loadMidias();
                loadPlaylists();
            }
        } else {
            router.push('/');
        }
    }, []);

    return (
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
                        <h2 className="font-semibold text-2xl mt-10">Músicas</h2>
                        <div className="grid grid-cols-4 gap-3 mt-4">
                            
                            {musicas.map(musica => {

                                const [c, d] = musica.capa.split("uploads/");

                                return(
                                        <div key={musica.id} onClick={() => handlePlay(musica.id)} className="bg-white/5 flex flex-col gap-2 p-2 rounded hover:bg-white/10 w-48 justify-center">
                                            <dialog ref={dialogRef} className="w-[20%] rounded-lg p-[2%]">
                                                <div className="space-y-4 space-x-4 p-[2%]">
                                                    <div className="flex flex-col gap-3">
                                                        {playlists.map(playlist => (
                                                            <div key={playlist.id} className="text-gray-100">
                                                                <div className="ml-4 pl-2 mt-2 border-b-2">
                                                                    <Checkbox
                                                                        value={playlist.id}
                                                                        isSelected={selectedPlaylists.includes(playlist.id)}
                                                                        onChange={() => handleCheckboxChange(playlist.id)}
                                                                    >
                                                                        {playlist.nome}
                                                                    </Checkbox>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="flex items-center justify-between">
                                                            <Button color="success" variant="bordered" onClick={fecharPopUp}>
                                                                Cancelar
                                                            </Button>
                                                            <Button color="success" variant="bordered" onClick={() => {
                                                                selectedPlaylists.forEach(playlistId => handleAdicionarMidia(playlistId, musica.id));
                                                                fecharPopUp();
                                                            }}>
                                                                Adicionar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </dialog>
                                            <img src={`${baseURL}/uploads/${d}`} alt={musica.titulo} className="w-[160px] h-[120px] ml-2 rounded-lg"/> 
                                            <div className="flex justify-between items-center">
                                                <strong className="font-semibold">{musica.titulo}</strong>
                                                <div className="flex items-center gap-2">
                                                    <ListPlus onClick={abrirPopUp} />
                                                    {(adm === 'true' || musica.userId === id) && (
                                                        <PenLine onClick={(event) => handleEdit(event, musica.id)} />
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-sm text-zinc-400">{musica.historia}</span>
                                        </div>
                                    )})}
                        </div>
                        <h2 className="font-semibold text-2xl mt-10">Vídeos</h2>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            
                            {videos.map(video => {

                                const [c, d] = video.capa.split("uploads/");

                                return(
                                        <div key={video.id} onClick={() => handleView(video.id)} className="bg-white/5 flex flex-col gap-2 p-2 rounded hover:bg-white/10">
                                            <dialog ref={dialogRef} className="w-[20%] rounded-lg p-[2%]">
                                                <div className="space-y-4 space-x-4 p-[2%]">
                                                    <div className="flex flex-col gap-3">
                                                        {playlists.map(playlist => (
                                                            <div key={playlist.id} className="text-gray-100">
                                                                <div className="ml-4 pl-2 mt-2 border-b-2">
                                                                    <Checkbox
                                                                        value={playlist.id}
                                                                        isSelected={selectedPlaylists.includes(playlist.id)}
                                                                        onChange={() => handleCheckboxChange(playlist.id)}
                                                                    >
                                                                        {playlist.nome}
                                                                    </Checkbox>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="flex items-center justify-between">
                                                            <Button color="success" variant="bordered" onClick={fecharPopUp}>
                                                                Cancelar
                                                            </Button>
                                                            <Button color="success" variant="bordered" onClick={() => {
                                                                selectedPlaylists.forEach(playlistId => handleAdicionarMidia(playlistId, video.id));
                                                                fecharPopUp();
                                                            }}>
                                                                Adicionar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </dialog>
                                            <img src={`${baseURL}/uploads/${d}`} alt={video.titulo} className="w-full h-[80%]" />
                                            <div className="flex justify-between items-center">
                                                <strong className="font-semibold">{video.titulo}</strong>
                                                <div className="flex items-center gap-2">
                                                    <ListPlus onClick={abrirPopUp} />
                                                    {(adm === 'true' || video.userId === id) && (
                                                        <PenLine onClick={(event) => handleEdit(event, video.id)} />
                                                    )}
                                                </div>
                                            
                                            </div>
                                            <span className="text-sm text-zinc-400">{video.historia}</span>
                                        </div>
                                    )})}
                        </div>
                    </main>
                    { (visible) && (
                        <div className="w-[23%] p-2 pt-0 pr-0 space-y-2">
                            <div className="rounded-md rounded-t-none bg-zinc-900 p-3 space-y-3">
                                <p>{autor}</p>
                                <Image
                                isBlurred
                                width={240}
                                src={`${baseURL}/uploads/${capa}`}
                                alt="Cover"
                                />
                                <p className="text-xl">{titulo}</p>
                                <audio src={`${baseURL}/uploads/${path}`} controls></audio>
                            </div>
                            <div className="rounded-md bg-zinc-900 p-4 space-y-2">
                                <h3>Informações adicionais:</h3>
                                <p>Editora: {editor}</p>
                                <p>Composta por: {compo}</p>
                                <p>Grupo: {grupo}</p>
                                <p>Descrição: {historia}</p>
                            </div>
                            
                        </div>
                    ) }
                    
                </div>
            </div>
        </>
    );
}
