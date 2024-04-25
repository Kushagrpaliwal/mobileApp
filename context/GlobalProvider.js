import { createContext , useContext , useEffect , useState } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext() ;
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
   const [isLoggedIn, setIsLoggedIn] = useState(false) ;
   const [User, setUser] = useState(null) ;
   const [isLoading, setisLoading] = useState(true);

   useEffect(() => {
     getCurrentUser().then((res) => {
      if(res){
        setIsLoggedIn(true);
        setUser(res)
      }else{
        setIsLoggedIn(false);
        setUser(null);
      }
     })
     .catch((error) => {
      console.log(error)
     })
     .finally(() => {
      setisLoading(false) ;
     })
   }, [])
   
  
  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        User,
        setUser,
        isLoading,

      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
export default GlobalProvider;