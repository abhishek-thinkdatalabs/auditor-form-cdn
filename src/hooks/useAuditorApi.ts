import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { DataItem, ProgrammeData, SchemeData } from '../types';

export const useAuditorApi = (config: {
  apiUrl: string;
  apiHeaders: Record<string, string>;
}) => {
  const axiosInstance = axios.create({
    baseURL: config.apiUrl,
    headers: {
      'Content-Type': 'application/json',
      ...config.apiHeaders,
    },
  });

  const api = {
    fetchCountries: async (): Promise<DataItem[]> => {
      const response = await axiosInstance.get<DataItem[]>('/global/country/');
      const usaItem = response.data.find((item) => item.name === "United States");
      const otherItems = response.data.filter(
        (item) => item.name !== "United States"
      );
      return usaItem ? [usaItem, ...otherItems] : response.data;
    },

    fetchStates: async (countryId: string): Promise<DataItem[]> => {
      const response = await axiosInstance.get<DataItem[]>(
        `/global/state/?country=${countryId}`
      );
      return response.data;
    },

    fetchCities: async (stateId: string): Promise<DataItem[]> => {
      const response = await axiosInstance.get<DataItem[]>(
        `/global/city/?state=${stateId}`
      );
      return response.data;
    },

    getAllProgrammes: async (): Promise<ProgrammeData[]> => {
      const response = await axiosInstance.get('/global/programme/');
      return response.data;
    },

    getSchemesByProgramme: async (programmeId: string): Promise<SchemeData[]> => {
      const response = await axiosInstance.get(`/global/scheme/?programme=${programmeId}`);
      return response.data;
    },

    submitForm: async (formData: FormData) => {
      const response = await axiosInstance.post('/company/auditor/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
    }
  };

  return {
    axiosInstance,
    ...api
  };
};