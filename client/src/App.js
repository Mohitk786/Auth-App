import { Route, Routes } from 'react-router-dom';
import { SignUp } from './components/SignUp'
import { Login } from './components/Login'
import AdminDashboard from "./pages/Admin/AdminDashboard"
import {Home} from "./components/Home"

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='signup' element={<SignUp />}/>
      <Route path='login' element={<Login />}/>

      <Route path='admin'>
            <Route path='dashboard'  element={<AdminDashboard />} />
      </Route>

    </Routes>
  );
}

export default App;
