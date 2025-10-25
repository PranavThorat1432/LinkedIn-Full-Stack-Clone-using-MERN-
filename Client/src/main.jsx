import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import AuthContext from './Context/AuthContext.jsx';
import UserContext from './Context/userContext.jsx';
import { SocketProvider } from './Context/SocketContext.jsx';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthContext>
      <UserContext>
        <SocketProvider>
          <App />
        </SocketProvider>
      </UserContext>
    </AuthContext>
  </BrowserRouter>,
)
