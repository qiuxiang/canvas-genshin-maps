import { render } from "react-dom";
import { initStore } from "./store";
import { initTilemap } from "./store/tilemap";

function Main() {
  return (
    <>
      <div ref={initTilemap} className="h-full w-full absolute" />
    </>
  );
}

initStore();
render(<Main />, document.getElementById("main")!);
