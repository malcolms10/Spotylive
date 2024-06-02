'use client'

import Image from "next/image";
import { SetStateAction, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import { api } from "../../lib/api";
import l from '../../../../public/image.png'

export default function Home() {


  const[password, setPassword] = useState("")
  const[vPass,setPass] = useState("")
  const[email, setEmail] = useState('')
  const[isError, setIsError] = useState('')

  const router = useRouter()

  const validateEmail = (email: string) => {
    const regex = /^\d{8}@isptec\.co\.ao$/;
    return regex.test(email);
  };

  const handleEmailChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setEmail(event.target.value);
  };

  const handlePassChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setPassword(event.target.value);
  };

  const handleVPassChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setPass(event.target.value);
  };

  async function submit(e){

    e.preventDefault()

    if (!validateEmail(email)) {
      setIsError('E-mail ou Palavra-passe inválido')
      return
    }
    else if (password!==vPass) {
      setIsError('As palavras passe devem ser iguais')
      return
    }
    else {
      const data =  { email: email,password: password,admin: "no", about:""}
      const response  = await api.post(`user`, data)
      .then(response => {
        setIsError('')
        setEmail('')
        setPass('')
        setPassword('')
        router.push('/')
      })
      .catch(function (error) {
        console.log(error);
        setIsError('Este E-mail já existe!')
      });
      
    }

  }

  return (
    <div className="bg-second h-max space-y-[2%]">
      <header className="bg-primary w-full p-[2%]">
        <Image src={l} alt="logo" height={50} className="ml-[2%]"></Image>
      </header>
      <div className="flex justify-center text-white">
        <div className="bg-primary rounded-md w-[50%] flex justify-center items-center p-[10%] mb-[2%]">
          <div className="flex-row justify-center items-center space-y-4">
            <h1 className="text-3xl font-semibold">Registar no Spotify</h1>
            <hr />
            <form className="space-y-5" action="" onSubmit={submit}>
              <div className="flex flex-col space-y-2">
                <label htmlFor="email">Email</label>
                <input className="bg-transparent outline-none border-white border-2 rounded-md h-8 p-3" onChange={handleEmailChange} type="e-mail" value={email} name="email" id="email" placeholder="nome@isptec.co.ao" required />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="password">Palavra-Passe</label>
                <input className="bg-transparent outline-none border-white border-2 rounded-md h-8 p-3" onChange={handlePassChange} type="password" value={password} name="password" id="password" placeholder="Palavra-passe" required/>
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="cpassword">Confirmar Palavra-Passe</label>
                <input className="bg-transparent outline-none border-white border-2 rounded-md h-8 p-3" onChange={handleVPassChange} type="password" value={vPass} name="cpassword" id="cpassword" placeholder="Confirmar Palavra-passe" required/>
              </div>
              <div>
                {isError}
              </div>
              <button className="text-black text-lg font-bold bg-green-500 rounded-full p-3 w-full">
                Registar
              </button>
              <div>
                <p className="text-gray-400">Já tens uma conta? <Link href={'/'} className="text-white hover:text-green-500">Inicia sessão no Spotify</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
      
    </div>
    
  );
}
