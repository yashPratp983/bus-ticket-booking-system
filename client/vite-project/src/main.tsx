import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from "react-router-dom"
import { ScheduleContextProvider1,ScheduleContextProvider2 } from './contexts/scheduleContext.tsx'
import { UserContextProvider } from './contexts/users.tsx'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <UserContextProvider>
    <ScheduleContextProvider1>
      <ScheduleContextProvider2>
          <App />
      </ScheduleContextProvider2>
    </ScheduleContextProvider1>
    </UserContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
