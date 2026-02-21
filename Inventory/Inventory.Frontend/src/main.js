
import "./style.css";

import { renderShell } from "./components/layout/shell";
import { handleRoute } from "./router/router";

const app = document.querySelector("#app");

if(!app) 
{
  throw new Error("Elementi #app nuk u gjet ne index.html");
}

app.innerHTML = renderShell();

handleRoute();

window.addEventListener("hashchange", handleRoute)

