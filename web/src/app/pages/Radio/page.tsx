'use client'

import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import Image from 'next/image'
import { Avatar, AvatarIcon } from '@nextui-org/react'
import React, { useState, useEffect } from "react";
import { RadioBrowserApi } from 'radio-browser-api';
import i from '../../../../public/imageR.jpeg'
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";


export default function Radio() {

    const api = new RadioBrowserApi('My Radio App');
    const [stationsA, setStationsA] = useState([]);
    const [stationsName, setStationsName] = useState('Angola');
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null); // State to track currently playing audio
    const [title, setTitle] = useState('')
    const [button,setButton] = useState('Tocar')

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const stationsData = await api.searchStations({
                    country: stationsName,
                    limit: 30,
                });       
                setStationsA(stationsData)         
            } catch (error) {
                console.error("Error fetching stations:", error);
                // Handle error or display an error message
            }
        };

        fetchStations();
    }, [stationsName]); // Empty dependency array ensures the effect runs only once on component mount

    const handlePlay = (stationUrl, stationName) => {
        // Pause currently playing audio, if any
        if (currentlyPlaying) {
            currentlyPlaying.pause();
        }

        if (stationName==title && currentlyPlaying) {
            currentlyPlaying.pause();
            setTitle('')
            setButton('Tocar')
            return
        }

        // Start playing the selected station
        const audio = new Audio(stationUrl);
        audio.play();
        setCurrentlyPlaying(audio);
        setTitle(stationName)
        setButton('Parar')
    };

    const handleCountryChange = (key) => {
        setStationsName(key);
    };

    return(
        <>
            <div className="h-screen flex flex-col">
                <div className="flex flex-1">
                    <Sidebar></Sidebar>
                    <main className="flex-1 bg-zinc-900 p-6">
                        <div className="flex justify-end">
                        <Avatar
                                    icon={<AvatarIcon />}
                                    classNames={{
                                    base: "bg-gradient-to-br from-[#00FF00] to-[#32CD32]",
                                    icon: "text-black/80",
                                    }}
                                />    
                        </div>
                        <h2 className="font-semibold text-2xl mt-10 flex justify-center">Estações</h2>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button 
                                variant="bordered" 
                                >
                                Escolha o país
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions" onAction={handleCountryChange}>
                                <DropdownItem key="Angola">Angola</DropdownItem>
                                <DropdownItem key="Portugal">Portugal</DropdownItem>
                                <DropdownItem key="Brazil">Brazil</DropdownItem>
                                <DropdownItem key="United States">Estados Unidos</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <h3 className='mt-2 ml-2'>{stationsName}</h3>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            {stationsA.map((station, index) => (
                                <div className="bg-white/5 flex flex-col gap-2 p-3 rounded hover:bg-white/10" key={index}>
                                    <Image src={i} alt="cover" className="w-full h-[60%]"></Image>
                                    <strong className="font-semibold">{station.name}</strong>
                                    {/* Use an <audio> tag to play the radio station */}
                                    <button onClick={() => handlePlay(station.urlResolved, station.name)} className="bg-green-500 text-white rounded-md p-2">{(title == station.name) ?  <p>{button}</p> : <p>Reproduzir</p> }</button>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
                <Footer title={title} nome={'Estação em reprodução'}></Footer>
            </div>
        </>
    )
}
