import { BrowserRouter, Route, Switch } from "react-router-dom"
import { Empresas } from "./pages/Empresas"
import { Clientes } from "./pages/Clientes"
import { Navbar } from "./components/Navbar"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path="/Empresas" exact component={Empresas} />
        <Route path="/Clientes" exact component={Clientes} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
