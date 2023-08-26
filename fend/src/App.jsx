import './App.css'
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Nav from './pages/Nav';
import GetBio from './pages/GetBio';
import UserInfo from './pages/UserInfo';
import Partner from './pages/Partner';
import EditBio from './pages/EditBio';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Registration/>} />
          <Route path='/biodata' element={<GetBio/>} />
          <Route path='/info' element={<UserInfo/>} />
          <Route path='/partner' element={<Partner/>} />
          <Route path='/editbio' element={<EditBio/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
