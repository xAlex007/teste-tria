import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Sidenav } from "./components/Sidenav";
import { NotFound } from "./components/NotFound";
import { Home } from "./pages/Home";
import { Empresas } from "./pages/Empresas";
import { Clientes } from "./pages/Clientes";
import { ClientesEmpresas } from "./pages/ClientesEmpresas";

function App() {
  return (
    <BrowserRouter>
      <Sidenav />
      <Toaster />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/Empresas" component={Empresas} />
        <Route exact path="/Clientes" component={Clientes} />
        <Route exact path="/ClientesEmpresas" component={ClientesEmpresas} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
