import { Route, Routes } from "react-router-dom";
import { RootLayout } from "@/layouts";
import { Home } from "@/pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
