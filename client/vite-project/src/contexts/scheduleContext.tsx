import { useContext,createContext,useState } from 'react'

type scheduleContextType={
    schedule:{
    starting_address:string,
    destination_address:string,
    leaving_time:string,
    journey_id:number,
    bus_name:string
    }[] | null,
    setSchedule:(schedule:{
        starting_address:string,
        destination_address:string,
        leaving_time:string,
        journey_id:number,
        bus_name:string
        }[] | null)=>void
  }

type scheduleContextProviderProps={
    children:React.ReactNode
}

const scheduleContext=createContext<scheduleContextType | null>(null)

export const ScheduleContextProvider=({children}:scheduleContextProviderProps)=>{
    const [schedule,setSchedule]=useState<{
        starting_address:string,
        destination_address:string,
        leaving_time:string,
        journey_id:number,
        bus_name:string   
    }[] | null>(null);
    return(
        <scheduleContext.Provider value={{schedule,setSchedule}}>
            {children}
        </scheduleContext.Provider>
    )
}


export const useSchedule=()=>{
    return useContext(scheduleContext)
}
