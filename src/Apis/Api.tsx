// import { Base_Url } from "../Globle/Api";
import { Base_Url } from "@/Globle/Api";
import axios from "axios";

 export   const AnimalRegistrationApi = async (data) => {
  try {
    const response = await axios.post(`${Base_Url}/api/animals/register`, data);
    console.log("AnimalRegistrationApi response:", response.data);
    return response.data;
    
  } catch (err) {
    console.error("Error in AnimalRegistrationApi:", err);
    throw err;
  }
};


export const FarmRegistrationApi = async (data) => {
  try {
    const response = await axios.post(`${Base_Url}/api/farm/register`, data);
    console.log("FarmRegistrationApi response:", response.data);
    return response.data;
  }catch (err){
    console.error("Error in FarmRegistrationApi:", err);
    throw err;
  }
}

