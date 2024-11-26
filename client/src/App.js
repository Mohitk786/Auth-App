import { Route, Routes } from 'react-router-dom';
import { SignUp } from './components/SignUp'
import { Login } from './components/Login'
import AdminDashboard from "./pages/Admin/AdminDashboard"
import {Home} from "./components/Home"
import StudentDashboard from './pages/Student/StudentDashboard';
import InstructorDashboard from './pages/Instructor/InstructorDashboard';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='signup' element={<SignUp />}/>
      <Route path='login' element={<Login />}/>

      <Route path='student'>
        <Route path='dashboard/:id' element={<StudentDashboard />}/>
      </Route>

      <Route path='instructor'>
        <Route path='dashboard/:id' element={<InstructorDashboard />}/>
      </Route>

      <Route path='admin'>
            <Route path='dashboard'  element={<AdminDashboard />} />
      </Route>

    </Routes>
  );
}

export default App;
