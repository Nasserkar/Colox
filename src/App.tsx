import { Route, Routes } from "react-router-dom";
import { RootLayout } from "@/layouts";
import { Home } from "@/pages/home";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
