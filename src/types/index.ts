export interface AuditorFormConfig {
  apiUrl?: string;
  apiHeaders?: Record<string, string>;
  recaptchaSiteKey?: string;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    borderRadius?: string;
  };
  onSubmit?: (data: any) => void;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export interface DataItem {
  id: string;
  name: string;
}

export interface ProgrammeData {
  id: string;
  name: string;
  description: string;
}

export interface SchemeData {
  id: string;
  name: string;
  programme: string;
  programme_id: string;
  description: string;
}