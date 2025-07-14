// import { Base_Url } from "../Globle/Api";
import { Base_Url } from "@/Globle/Api";
import axios from "axios";

export const AnimalRegistrationApi = async (data) => {
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
  } catch (err) {
    console.error("Error in FarmRegistrationApi:", err);
    throw err;
  }
};

export const InvestorRegistrationApi = async (data) => {
  try {
    const response = await axios.post(
      `${Base_Url}/api/invester/register`,
      data
    );
    console.log("InvestorRegistrationApi response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error in InvestorRegistrationApi:", err);
    throw err;
  }
};

export const FarmNumbersApi = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/farm/numbers`);
    console.log("FarmNumbersApi response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error in FarmNumbersApi:", err);
    throw err;
  }
};

export const InvestorNamesApi = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/invester/names`);
    console.log("InvestorNamesApi response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error in InvestorNamesApi:", err);
    throw err;
  }
};

export const AnimalListApi = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/`);
    console.log("AnimalListApi response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error in AnimalListApi:", err);
    throw err;
  }
};

export const GetAnimalWithcheckPoints = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/with-checkpoints`);
    console.log("AnimalsWithCheckpointsApi response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error in AnimalsWithCheckpointsApi:", err);
    throw err;
  }
};

export const CreateCheckpointRecord = async (checkpointId, data) => {
  try {
    const numericId = checkpointId.toString().replace("cp-", "");

    const response = await axios.post(
      `${Base_Url}/api/checkpoints/${numericId}/record`,
      data
    );
    console.log("CreateCheckpointRecord response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error in CreateCheckpointRecord:", err);
    throw err;
  }
};

export const RegisterBreedApi = async (data) => {
  try {
    const response = await axios.post(`${Base_Url}/api/breeds/register`, data);
    console.log("RegisterBreedApi response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error in RegisterBreedApi:", err);
    throw err;
  }
};

export const GetAllBreedsApi = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/breeds`);
    console.log("GetAllBreedsApi response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error in GetAllBreedsApi:", err);
    throw err;
  }
};

export const GetFilteredAnimalsApi = async (filters) => {
  try {
    const response = await axios.get(`${Base_Url}/api/animals`, {
      params: filters,
    });
    console.log("GetFilteredAnimalsApi response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error in GetFilteredAnimalsApi:", err);
    throw err;
  }
};

export const GetAnimalWeightHistory = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/animals/weight-history`);
    console.log("GetAnimalWeightHistory response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error in GetAnimalWeightHistory:", err);
    throw err;
  }
};

export const AddDeathRecordApi = async (data) => {
  try {
    const response = await axios.post(`${Base_Url}/api/death-records`, data);
    console.log("AddDeathRecordApi response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error in AddDeathRecordApi:", err);
    throw err;
  }
};

export const GetAnimalByIdApi = async (animalId) => {
  try {
    const response = await axios.get(`${Base_Url}/api/animals/${animalId}`);
    console.log("GetAnimalByIdApi response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error in GetAnimalByIdApi:", err);
    throw err;
  }
};

export const RecordSlaughter = async (data: any) => {
  try {
    const response = await axios.post(`${Base_Url}/api/record/slaughter`, data);
    return response.data;
  } catch (err) {
    console.error("Error posting slaughter record:", err);
    throw err;
  }
};

export const RecordIncident = async (incidentData) => {
  try {
    const response = await axios.post(
      `${Base_Url}/api/Register/incident`,
      incidentData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to record incident:", error);
    throw error;
  }
};

export const RegisterQuarantine = async (data: any) => {
  try {
    const response = await axios.post(`${Base_Url}/api/quarantine`, data);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Unknown error occurred" };
  }
};

export const GetQuarantineRecord = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/quarantine`);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Unknown error occurred" };
  }
};

export const ViewRecordSlaughter = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/stats/view`);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Unknown error occurred" };
  }
};

export const ViewRecentSlaughterRecords = async () => {
  try {
    const response = await axios.get(
      `${Base_Url}/api/slaughter/records/recent`
    );
    console.log("Fetched records:", response);

    return response.data.data || [];
  } catch (error) {
    throw error?.response?.data || { message: "Unknown error occurred" };
  }
};

export const GetAllInvester = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/invester`);
    return response.data;
  } catch (error) {
    throw error?.response?.data || { message: "Unknown error occurred" };
  }
};

export const GetInvesterById = async (id: number | string) => {
  try {
    const response = await axios.get(`${Base_Url}/api/invester/${id}`);
    return response.data;
  } catch (error) {
    throw error?.response?.data || { message: "Unknown error occurred" };
  }
};

export const GetAllFarm = async () => {
  try {
    const response = await axios.get(`${Base_Url}/api/farm`);
    return response.data;
  } catch (error) {
    throw error?.response?.data || { message: "Unknown error occurred" };
  }
};
