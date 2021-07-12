import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { NotFound } from "./components/NotFound";
import { Empresas } from "./pages/Empresas";
import { Clientes } from "./pages/Clientes";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster />
      <Switch>
        <Route exact path="/Empresas" component={Empresas} />
        <Route exact path="/Clientes" component={Clientes} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
