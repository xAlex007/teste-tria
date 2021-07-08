import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Empresas } from "./pages/Empresas";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/Empresas" exact component={Empresas} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
