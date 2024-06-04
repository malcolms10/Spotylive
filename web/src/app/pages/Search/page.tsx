'use client'

import Sidebar from '@/components/Sidebar'
import { Avatar, AvatarIcon } from '@nextui-org/react'
import React, { useState, useEffect } from "react";
import {Input, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import { SearchIcon } from '../../../../public/SearchIcon'
import CardM from "../../../components/Card";
import Footer from '@/components/Footer';



export default function Search() {

    

    useEffect(() => {
        
    }, []); // Empty dependency array ensures the effect runs only once on component mount


    return(
        <>
            <div className="h-screen flex flex-col">
                <div className="flex flex-1">
                    <Sidebar></Sidebar>
                    <main className="flex-1 bg-zinc-900 p-6">
                        <div className="flex justify-between items-center">
                            <div className="w-[50%] flex flex-col gap-4">
                                <div className="w-full px-8 rounded-2xl flex justify-center items-center  text-white ">
                                    <Input
                                        label="Procura"
                                        radius="lg"
                                        placeholder="O que quer reproduzir?"
                                        startContent={
                                        <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" onClick={()=>console.log('Busca')}/>
                                        }
                                    />
                                </div>

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
                    </main>
                </div>
            </div>
        </>
    )
}
