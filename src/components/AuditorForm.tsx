import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Upload } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import AuditorHierarchy from "./AuditorHierarchy";
import { useAuditorApi } from "../hooks/useAuditorApi";
import { uploadImage } from "../utils/uploadImage";
import { objectToFormData } from "../utils/objectToFormData";
import { useToast } from "./Toast";
import type { AuditorFormConfig } from "../types";

const contactFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone_number: z.string().min(5, {
    message: "Phone number must be valid.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  country_id: z.string().optional(),
  state_id: z.string().optional(),
  city_id: z.string().optional(),
  address: z.string().optional(),
  pincode: z.string().optional(),
  message: z.string().optional(),
  resume: z.any().nullable().optional(),
  file_name: z.string().optional(),
  file_type: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface AuditorFormProps {
  config: AuditorFormConfig;
}

const AuditorForm: React.FC<AuditorFormProps> = ({ config }) => {
  const [loader, setLoader] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedSchemesList, setSelectedSchemesList] = useState<string[]>([]);
  const [selectedSchemes, setSelectedSchemes] = useState<{
    [key: string]: string[];
  }>({});

  const { toast } = useToast();

  const apiConfig = {
    apiUrl: config.apiUrl || "https://crmapi.thinkdatalabs.com/api",
    apiHeaders: config.apiHeaders || {
      "x-access-api-key": "c8020ac4ad9745fa6e0a8deaccc4ba5c525f58dbf85a01de9dc0f50c9e1a15ae",
      "x-public-api-key": "282af17a9b504ce038cd37cc6e91127b",
    },
  };

  const { 
    fetchCountries, 
    fetchStates, 
    fetchCities, 
    submitForm 
  } = useAuditorApi(apiConfig);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      company: "",
      phone_number: "",
      country_id: "",
      state_id: "",
      city_id: "",
      address: "",
      pincode: "",
      message: "",
      resume: null,
    },
  });

  const certificationFile = watch("resume");

  const { data: countriesData = [], isLoading: isCountriesLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: 300_000,
  });

  const { data: statesData = [] } = useQuery({
    queryKey: ["states", selectedCountry],
    queryFn: () => fetchStates(selectedCountry),
    enabled: !!selectedCountry,
  });

  const { data: citiesData = [] } = useQuery({
    queryKey: ["cities", selectedState],
    queryFn: () => fetchCities(selectedState),
    enabled: !!selectedState,
  });

  const onCaptchaChange = (token: string | null) => setCaptchaToken(token);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setValue("country_id", value);
    setValue("state_id", "");
    setValue("city_id", "");
    setSelectedState("");
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setValue("state_id", value);
    setValue("city_id", "");
  };

  const handleCityChange = (value: string) => {
    setValue("city_id", value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setValue("resume", file);
      setValue("file_name", file.name);
      setValue("file_type", file.type);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    if (config.recaptchaSiteKey && !captchaToken) {
      toast.error("Please complete the CAPTCHA.");
      return;
    }

    try {
      setLoader(true);
      const { resume, first_name, last_name, ...dataWithoutImage } = data;

      const formData = objectToFormData({
        ...dataWithoutImage,
        full_name: `${data.first_name} ${data.last_name}`.trim(),
      });

      (selectedPrograms || []).forEach((id) => {
        formData.append("programmes", String(id));
      });

      (selectedSchemesList || []).forEach((id) => {
        formData.append("schemes", String(id));
      });

      if (config.onSubmit) {
        config.onSubmit({ ...data, programmes: selectedPrograms, schemes: selectedSchemesList });
      }

      const res = await submitForm(formData);

      if (res.status === 201 || res.status === 200) {
        toast.success("Application Submitted successfully.");
        reset();
        if (res?.data?.pre_signed?.presigned_url) {
          await uploadImage(res?.data?.pre_signed.presigned_url, resume);
        }
        setSelectedPrograms([]);
        setSelectedSchemesList([]);
        setSelectedSchemes({});
        setCaptchaToken(null);
        setSelectedCountry("");
        setSelectedState("");

        if (config.onSuccess) {
          config.onSuccess(res.data);
        }
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      let errorMessage = "An error occurred. Please try again later.";
      
      if (error.response?.status === 400) {
        errorMessage = "Invalid form data.";
      } else if (error.response?.status === 409) {
        errorMessage = "Email already exists.";
      }
      
      toast.error(errorMessage);
      
      if (config.onError) {
        config.onError(error);
      }
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50" style={{ 
      backgroundColor: config.theme?.backgroundColor || '#f0fdf7' 
    }}>
      <div className="container mx-auto py-10 px-4">
        <h2 className="flex justify-center items-center text-emerald-600 pt-12 pb-8 text-3xl uppercase font-extrabold drop-shadow-sm" 
            style={{ color: config.theme?.primaryColor || '#059669' }}>
          Auditor Application Form
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader className="border-b border-border mb-6">
              <CardTitle>
                <h3 className="font-bold text-lg">
                  Personal Info<span className="text-red-500">*</span>
                </h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Input placeholder="First Name" {...register("first_name")} />
                {errors.first_name && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.first_name.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <Input placeholder="Last Name" {...register("last_name")} />
                {errors.last_name && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.last_name.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <Input
                  placeholder="Email"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <Input placeholder="Phone" {...register("phone_number")} />
                {errors.phone_number && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.phone_number.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <Input placeholder="Company" {...register("company")} />
                {errors.company && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.company.message}
                  </span>
                )}
              </div>

              {/* Country */}
              <Controller
                name="country_id"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col">
                    <Select
                      value={field.value}
                      onValueChange={handleCountryChange}
                    >
                      <SelectTrigger className="text-gray-400">
                        <SelectValue
                          placeholder={
                            isCountriesLoading
                              ? "Loading..."
                              : "Select Country"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {countriesData.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              {/* State */}
              <Controller
                name="state_id"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col">
                    <Select
                      value={field.value}
                      onValueChange={handleStateChange}
                      disabled={!selectedCountry}
                    >
                      <SelectTrigger className="text-gray-400">
                        <SelectValue
                          placeholder={
                            selectedCountry
                              ? "Select State"
                              : "Select Country First"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {statesData.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state_id && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.state_id.message}
                      </span>
                    )}
                  </div>
                )}
              />

              {/* City */}
              <Controller
                name="city_id"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col">
                    <Select
                      value={field.value}
                      onValueChange={handleCityChange}
                      disabled={!selectedState}
                    >
                      <SelectTrigger className="text-gray-400">
                        <SelectValue
                          placeholder={
                            selectedState
                              ? "Select City"
                              : "Select State First"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {citiesData.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.city_id && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.city_id.message}
                      </span>
                    )}
                  </div>
                )}
              />

              <div className="flex flex-col">
                <Input placeholder="Pincode" {...register("pincode")} />
                {errors.pincode && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.pincode.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileInput}
                  className="text-left"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {certificationFile && typeof certificationFile !== "string"
                    ? certificationFile.name
                    : "Upload Resume"}
                </Button>
              </div>

              <div className="flex flex-col md:col-span-2">
                <Textarea placeholder="Address" {...register("address")} />
                {errors.address && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.address.message}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Auditor Hierarchy */}
          <AuditorHierarchy
            selectedPrograms={selectedPrograms}
            selectedSchemes={selectedSchemes}
            setSelectedPrograms={setSelectedPrograms}
            setSelectedSchemes={setSelectedSchemes}
            setSelectedSchemesList={setSelectedSchemesList}
            apiConfig={apiConfig}
          />

          {/* Remarks */}
          <Card>
            <CardHeader className="border-b border-border mb-6">
              <CardTitle>
                <h3 className="font-bold text-lg">Remarks</h3>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <Textarea placeholder="Remarks" {...register("message")} />
                {errors.message && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* CAPTCHA + Submit */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            {config.recaptchaSiteKey && (
              <ReCAPTCHA
                sitekey={config.recaptchaSiteKey}
                onChange={onCaptchaChange}
              />
            )}
            <Button
              className="ml-auto"
              type="submit"
              disabled={loader || isSubmitting}
              style={{ 
                backgroundColor: config.theme?.primaryColor || '#059669' 
              }}
            >
              {loader ? <Loader2 className="animate-spin mr-2" /> : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuditorForm;