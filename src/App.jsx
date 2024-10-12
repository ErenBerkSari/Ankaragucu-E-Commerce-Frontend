import "./App.css";
import RouterConfig from "./config/RouterConfig";
import Header from "../src/components/Header";
import { useDispatch } from "react-redux";
import axiosInstance, { setDispatch } from "../src/utils/axiosInstance";
import { useEffect } from "react";
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    setDispatch(dispatch);
  }, [dispatch]);
  return (
    <div>
      <Header />
      <RouterConfig />
    </div>
  );
};

export default App;
