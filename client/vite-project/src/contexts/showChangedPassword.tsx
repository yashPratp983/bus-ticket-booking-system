import { useContext,createContext } from "react";
import { useState } from "react";

type showContextType={
    show:boolean,
    setShow:(show:boolean)=>void
}

type showContextProviderProps={
    children:React.ReactNode
}

const showContext=createContext<showContextType | null>(null)

export const ShowContextProvider=({children}:showContextProviderProps)=>{
    const [show,setShow]=useState<boolean>(false);
    return(
        <showContext.Provider value={{show,setShow}}>
            {children}
        </showContext.Provider>
    )
}


export const useShow=()=>{
    return useContext(showContext)
}
