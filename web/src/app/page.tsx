"use client"

import Image from "next/image";
import l from '../../public/image.png'
import Link from "next/link";
import { SetStateAction, useState } from "react";
import { useRouter } from 'next/navigation'
import { api } from "./lib/api";



export default function Home() {


  const[password, setPassword] = useState("")
  const[email, setEmail] = useState('')
  const[isError, setIsError] = useState('')

  const router = useRouter()


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePassChange = (event) => {
    setPassword(event.target.value);
  };

  async function submit(e){
    e.preventDefault()
    await api.get(`user/${email}`)
    .then(response => {
      
      console.log(response);
      if (password!=response.data.password) {
        setIsError('E-mail ou Palavra-passe inválido')
      } 
      else{
        setEmail('')
        setPassword('')
        setIsError('')
        localStorage.setItem("user", JSON.stringify(response));
        router.push('/pages/Home')
      }
    })
    .catch(function (error) {
      console.log(error);
      setIsError('E-mail ou Palavra-passe inválido')
    });
  }

  return (
    <div className="bg-second h-max space-y-[5%] pb-[5%]">
      <header className="bg-primary w-full p-[2%]">
        <Image src={l} alt="logo" height={50} className="ml-[2%]"></Image>
      </header>
      <div className="flex justify-center">
        <div className="bg-primary rounded-md w-[50%] flex justify-center items-center p-[9%] mb-[2%]">
          <div className="flex-row justify-center items-center space-y-4">
            <h1 className="text-3xl font-semibold">Iniciar sessão no Spotify</h1>
            <hr />
            <form className="space-y-5 mx-[5%]" action="" onSubmit={submit}>
              <div className="flex flex-col space-y-2">
                <label htmlFor="email">Email</label>
                <input className="bg-transparent outline-none border-white border-2 rounded-md h-8 p-3" type="email" name="email" id="email" placeholder="E-mail" required onChange={handleEmailChange} value={email}/>
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="password">Palavra-Passe</label>
                <input className="bg-transparent outline-none border-white border-2 rounded-md h-8 p-3" type="password" name="password" id="password" placeholder="Palavra-passe" required onChange={handlePassChange} value={password}/>
              </div>
              <div>
                {isError}
              </div>
                  <button className="text-black text-lg font-bold bg-green-500 rounded-full p-3 w-full">
                    Iniciar sessão
                  </button>
                
              <div>
                <p className="text-gray-400">Não tens conta? <Link href={'/pages/Signin'} className="text-white hover:text-green-500">Regista-te no Spotify</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
      
    </div>
    
  );
}
