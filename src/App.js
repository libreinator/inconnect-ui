import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Components/LandingPage/LandingPage';
import Uploader from './Components/FileUpload/Uploader';
import Footer from './Components/Footer/Footer';
import Login from './Components/reg_and_log/Login';
import Register from './Components/reg_and_log/Register';
import Dashboard from './Components/Chat/Dashboard';
import { useContext } from 'react';
import { AuthContext } from './Components/context/AuthContext';
function App() {

  const { currentUser } = useContext(AuthContext)

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/Login" />
    }
    return children
  };
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<>
            <LandingPage />
            <Uploader />
            <Footer />
          </>} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
