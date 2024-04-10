import { createContext, useContext, useState } from "react";

const DataContext = createContext()

export const DataProvider = ({children}) => {
   
  //Use to Set navbar for User and Service Provider
  const [checkNavBar, setcheckNavBar] = useState("User")
    const updatecheckNavBar = (data) => {
      setcheckNavBar(data);
  }
    
    //To Set the ID of Service Provider in Adding Service
    const [ServiceProviderId, setServiceProviderId] = useState("");
    const updateServiceProviderId = (data) => {
      setServiceProviderId(data);
    }
    
    //To set the Service Information while booking it from Service Page
    const [BookNowData, setBookNowData] = useState()
    const updateBookNowData = (data) =>{
      setBookNowData(data)
    }


    //To set Service by ID when User press MORE button on Home page and gets redirect to Service Page's search bar
    const [serviceById, setserviceById] = useState()
    const updateServiceById = (data) =>{
      setserviceById(data)
    }


    //To set the Data of user at the time of Registration
    const [RegistrationData, setRegistrationData] = useState()
    const updateRegistrationData = (data) =>{
      setRegistrationData(data)
    }


    return(
            <DataContext.Provider value={{
              checkNavBar,updatecheckNavBar,
              ServiceProviderId,updateServiceProviderId,
              BookNowData,updateBookNowData,
              serviceById,updateServiceById,    
              RegistrationData,updateRegistrationData       
              }}>
                {children}
            </DataContext.Provider>        
        )}

        export const useData = () => {
            return useContext(DataContext);
          };