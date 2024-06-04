'use client'

import { Avatar, Button, ButtonGroup } from "@nextui-org/react";
import Sidebar from "@/components/Sidebar"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { api } from "@/app/lib/api";
import { baseURL } from "@/app/lib/api";
import { ListPlus, PenLine, Play, Turtle } from "lucide-react";


export default function Perfil() {

    const router = useRouter()
    
    const [id,setId] = useState('')
    const [admA,setAdmA] = useState('')
    const [user,setUser] = useState()
    const [email,setEmail] = useState()
    const [adm,setAdm] = useState('')
    const [seguidores, setSeguidores] = useState(Number);
    const [seguindo, setSeguindo] = useState(Number);
    const [title, setTitle] = useState('');
    const [cover, setCover] = useState('');
    const [autor,setAutor] = useState('')
    const [midias, setMidias] = useState([])
    const [musicas,setMusicas] = useState([])
    const [videos,setVideos] = useState([])
    const [playlists,setPlaylists] = useState([])
    const [selectedOption, setSelectedOption] = useState('musicas');

    const handleMusicClick = () => {
        setSelectedOption('musicas');
    };

    const handleVideoClick = () => {
        setSelectedOption('videos');
    };

    const handlePlaylistClick = () => {
        setSelectedOption('playlist');
    };

    function getPerfil(id) {
        api.get(`/userId/${id}`).
        then(response=>{
            setSeguidores(response.data.followers)
            setSeguindo(response.data.following)
            setAdm(response.data.admin)
        }).
        catch(erro=>{
            console.log(erro)
        })
    }

    function loadMidias(str) {
        api.get(`/midia/${str}`)
            .then(async response => {
                const midiasA = response.data
                setMidias(response.data)
                console.log('Response Data:', midias);
    
                const musicasFiltradas = midiasA.filter((midia) => midia.tipo === 'audio');
                const videosFiltrados = midiasA.filter((midia) => midia.tipo === 'video')
    
                console.log('Filtered Music:', musicasFiltradas);
                console.log('Filtered Videos:', videosFiltrados);
    
                setMusicas(musicasFiltradas);
                setVideos(videosFiltrados);
            }).catch(error => {
                console.error('Error fetching midias:', error);
        });
    }

    async function loadPlaylists(id) {
        
        await api.get(`playlist/${id}`)
        .then(async reply =>{
            console.log(reply.data)
            setPlaylists(reply.data)
        })
    }

    function turnAdmin(str) {
        api.put(`/user/${str}/admin`)
            .then(() => {
                getPerfil(str); // Atualiza o estado do perfil após tornar admin
            })
            .catch(error => {
                console.error('Error turning user to admin:', error);
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

    useEffect(() => {
        const storedData = localStorage.getItem("user");
        const storedDataA = localStorage.getItem("perfil");
        if (storedData) {
            const userData = JSON.parse(storedData);
            if(storedDataA){
                const userDataA = JSON.parse(storedDataA);
                getPerfil(userDataA.data.id)
                const [c, d] = userDataA.data.email.split("@");
                setEmail(c)
                loadMidias(userDataA.data.id);
                loadPlaylists(userDataA.data.id)
                setUser(userDataA.data.id)
                setAdm(userDataA.data.admin)
            }
            if (userData == null) {
                router.push('/');
            } else {
                setId(userData.data.id);
                setAdmA(userData.data.admin)
                console.log(admA)

            }
        } else {
            router.push('/');
        }
    }, [router]);

    return(
        <>
            <div className="h-screen flex flex-col">
                <div className="flex flex-1">
                    <Sidebar></Sidebar>
                    <main className="flex-1 bg-zinc-900 rounded-md p-2">
                        <div className="flex justify-between items-center bg-green-800 p-[4%] rounded-lg rounded-b-none">
                            <div className="flex items-center gap-3">
                                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" className="w-20 h-20 text-large"/>
                                <div>
                                    <p className="text-zinc-50 text-2xl">{email}</p>
                                    <p className="text-zinc-300 text-sm">{seguidores} seguidores</p>
                                </div>
                            </div>
                            <div className="space-x-4">
                                {user != id &&(
                                    <Button color="default" variant="bordered">
                                        Seguir
                                    </Button>
                                )}
                                  
                                {admA === 'true' && adm === 'no' && (
                                    <Button color="default" variant="bordered" onClick={() => turnAdmin(user)}>
                                        Tornar admin
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="rounded-lg bg-green-900 rounded-t-none p-[4%]">
                            <div className="flex space-x-4">
                                <ButtonGroup>
                                    <Button color="default" variant="shadow" onClick={handleMusicClick}>Músicas</Button>
                                    <Button color="default" variant="bordered" onClick={handleVideoClick}>Vídeos</Button>
                                    <Button color="default" variant="shadow" onClick={handlePlaylistClick}>Playlist</Button>
                                </ButtonGroup>
                            </div>
                            
                            {selectedOption === 'musicas' && 
                                <>
                                    <h2 className="font-semibold text-2xl mt-10">Músicas</h2>
                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            {musicas.map(musica=>{ 

                                            const [c, d] = musica.capa.split("uploads/");

                                                return(
                                                    <div key={musica.id} className="bg-white/5 flex flex-col gap-2 p-2 rounded hover:bg-white/10 w-48 justify-center">
                                                        <img src={`${baseURL}/uploads/${d}`} alt={musica.titulo} className="w-[160px] h-[120px] ml-2 rounded-lg"/> 
                                                        <div className="flex justify-between items-center">
                                                            <strong className="font-semibold">{musica.titulo}</strong>
                                                            <div className="flex items-center gap-2">
                                                                {(adm === 'true' || musica.userId === id) && (
                                                                    <PenLine onClick={(event) => handleEdit(event, musica.id)} />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className="text-sm text-zinc-400">{musica.historia}</span>
                                                    </div>
                                                )
                                            })}                                    
                                        </div>
                                </>
                            }
                            
                            {selectedOption === 'videos' && 
                                <>
                                    <h2 className="font-semibold text-2xl mt-10">Vídeos</h2>
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        {videos.map(video => {

                                            const [c, d] = video.capa.split("uploads/");

                                            return(
                                                    <div key={video.id} onClick={() => handleView(video.id)} className="bg-white/5 flex flex-col gap-2 p-2 rounded hover:bg-white/10">
                                                        <img src={`${baseURL}/uploads/${d}`} alt={video.titulo} className="w-full h-[220px]" />
                                                        <div className="flex justify-between items-center">
                                                            <strong className="font-semibold">{video.titulo}</strong>
                                                            <div className="flex items-center gap-2">
                                                                {(adm === 'true' || video.userId === id) && (
                                                                    <PenLine onClick={(event) => handleEdit(event, video.id)} />
                                                                )}
                                                            </div>
                                                        
                                                        </div>
                                                        <span className="text-sm text-zinc-400">{video.historia}</span>
                                                    </div>
                                        )})}
                                    </div>
                                </>
                            } 

                            {selectedOption === 'playlist' && 
                                <>
                                    <h2 className="mt-10 mb-2 text-xl text-center">Playlists</h2>
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
                                </>
                            }       
                            
                            
                        </div>
                        
                        
                    
                        
                    </main>
                </div>
            </div>
            
        </>
    )
}