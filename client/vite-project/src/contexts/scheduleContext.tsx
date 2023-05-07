import { useContext,createContext,useState } from 'react'

type scheduleContextType={
    schedule1:{
    startingAddress:string,
    destinationAddress:string,
    startingTime:string,
    }[] | null,
    setSchedule1:(schedule1:{
        startingAddress:string,
        destinationAddress:string,
        startingTime:string,
        }[] | null)=>void
  }

  type scheduleContextType2={
    schedule2:{
    startingAddress:string,
    destinationAddress:string,
    startingTime:string,
    }[] | null,
    setSchedule2:(schedule1:{
        startingAddress:string,
        destinationAddress:string,
        startingTime:string,
        }[] | null)=>void
  }

type scheduleContextProviderProps={
    children:React.ReactNode
}

const scheduleContext1=createContext<scheduleContextType | null>(null)
const scheduleContext2=createContext<scheduleContextType2 | null>(null)

export const ScheduleContextProvider1=({children}:scheduleContextProviderProps)=>{
    const [schedule1,setSchedule1]=useState<{
        startingAddress:string,
        destinationAddress:string,
        startingTime:string,}[] | null>(null);
    return(
        <scheduleContext1.Provider value={{schedule1,setSchedule1}}>
            {children}
        </scheduleContext1.Provider>
    )
}


export const useSchedule1=()=>{
    return useContext(scheduleContext1)
}

export const ScheduleContextProvider2=({children}:scheduleContextProviderProps)=>{
    const [schedule2,setSchedule2]=useState<{
        startingAddress:string,
        destinationAddress:string,
        startingTime:string,}[] | null>(null);
    return(
        <scheduleContext2.Provider value={{schedule2,setSchedule2}}>
            {children}
        </scheduleContext2.Provider>
    )
}


export const useSchedule2=()=>{
    return useContext(scheduleContext2)
}