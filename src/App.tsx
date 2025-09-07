import { Route, Routes } from "react-router-dom";
import { RootLayout } from "@/layouts";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import Inputs from "@/pages/inputs";

function App() {
  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="inputs" element={<Inputs />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
