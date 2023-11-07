
import Carlist from './components/Carlist.jsx'
import { AppBar, Typography,Toolbar } from '@mui/material'
import './App.css'

function App() {


  return (
    <>
  <AppBar position="static">
    <Toolbar>
        <Typography variant="h6">
Car Shop
        </Typography>
        </Toolbar>
      </AppBar>
      <Carlist />
</>
 
  )
}

export default App
