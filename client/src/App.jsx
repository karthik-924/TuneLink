import './App.css'
import Routes from './Routes'
import AuthProvider from './auth/AuthProvider'

function App() {

  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
}

export default App
