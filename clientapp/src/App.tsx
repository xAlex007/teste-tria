import { BrowserRouter, Route, Switch } from "react-router-dom"
import { Empresas } from "./pages/Empresas"
import { Navbar } from "./components/Navbar"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path="/Empresas" exact component={Empresas} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
