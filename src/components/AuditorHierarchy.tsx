import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { useAuditorApi } from "../hooks/useAuditorApi";
import type { ProgrammeData, SchemeData } from "../types";

interface AuditorHierarchyProps {
  selectedPrograms: string[];
  selectedSchemes: { [key: string]: string[] };
  setSelectedPrograms: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedSchemes: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
  setSelectedSchemesList: React.Dispatch<React.SetStateAction<string[]>>;
  apiConfig: {
    apiUrl: string;
    apiHeaders: Record<string, string>;
  };
}

const AuditorHierarchy: React.FC<AuditorHierarchyProps> = ({
  selectedPrograms,
  selectedSchemes = {},
  setSelectedPrograms,
  setSelectedSchemes,
  setSelectedSchemesList,
  apiConfig
}) => {
  const [expandedPrograms, setExpandedPrograms] = useState<string[]>([]);
  const [schemesByProgram, setSchemesByProgram] = useState<{
    [programId: string]: SchemeData[];
  }>({});

  const { getAllProgrammes, getSchemesByProgramme } = useAuditorApi(apiConfig);

  const { data: programmes = [], isLoading: isLoadingProgrammes } = useQuery<ProgrammeData[]>({
    queryKey: ["programmes"],
    queryFn: getAllProgrammes,
  });

  const fetchSchemesForProgram = async (programId: string) => {
    try {
      const schemesData = await getSchemesByProgramme(programId);
      setSchemesByProgram((prev) => ({
        ...prev,
        [programId]: schemesData,
      }));
      return schemesData;
    } catch (error) {
      console.error(`Error fetching schemes for program ${programId}:`, error);
      return [];
    }
  };

  React.useEffect(() => {
    selectedPrograms.forEach((programId) => {
      if (!schemesByProgram[programId]) {
        fetchSchemesForProgram(programId);
      }
    });
  }, [selectedPrograms]);

  const toggleProgramExpanded = (programId: string) => {
    setExpandedPrograms((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId]
    );
  };

  const handleProgramToggle = async (programId: string) => {
    if (selectedPrograms.includes(programId)) {
      setSelectedPrograms((prev) => prev.filter((id) => id !== programId));

      setSelectedSchemes((prev) => {
        const newSchemes = { ...prev };
        delete newSchemes[programId];
        return newSchemes;
      });

      setSelectedSchemesList((prev) => {
        const programSchemes = schemesByProgram[programId] || [];
        const schemeIds = programSchemes.map((scheme) => scheme.id);
        return prev.filter((id) => !schemeIds.includes(id));
      });

      setExpandedPrograms((prev) => prev.filter((id) => id !== programId));
    } else {
      setSelectedPrograms((prev) => [...prev, programId]);

      if (!schemesByProgram[programId]) {
        await fetchSchemesForProgram(programId);
      }
    }
  };

  const isSchemeSelected = (programId: string, schemeId: string): boolean => {
    if (!selectedSchemes) return false;
    return Boolean(selectedSchemes[programId]?.includes(schemeId));
  };

  const handleProgramSelectAll = (programId: string) => {
    const programSchemes = schemesByProgram[programId] || [];
    const schemeIds = programSchemes.map((scheme) => scheme.id);
    const currentSelectedSchemes = selectedSchemes[programId] || [];

    const allSelected =
      schemeIds.length > 0 &&
      schemeIds.every((id) => currentSelectedSchemes.includes(id));

    if (allSelected) {
      setSelectedSchemes((prev) => {
        const newSchemes = { ...prev };
        delete newSchemes[programId];
        return newSchemes;
      });

      setSelectedSchemesList((prev) =>
        prev.filter((id) => !schemeIds.includes(id))
      );
    } else {
      setSelectedSchemes((prev) => ({
        ...prev,
        [programId]: schemeIds,
      }));

      setSelectedSchemesList((prev) => {
        const newList = [...prev];
        schemeIds.forEach((id) => {
          if (!newList.includes(id)) newList.push(id);
        });
        return newList;
      });
    }
  };

  const handleSchemeSelection = (programId: string, schemeId: string) => {
    setSelectedSchemes((prev: any) => {
      const programSelectedSchemes = prev[programId] || [];
      const isSelected = programSelectedSchemes.includes(schemeId);

      const updatedSchemes = isSelected
        ? programSelectedSchemes.filter((id: string) => id !== schemeId)
        : [...programSelectedSchemes, schemeId];

      setSelectedSchemesList((prevList) => {
        return isSelected
          ? prevList.filter((id) => id !== schemeId)
          : [...prevList, schemeId];
      });
      return {
        ...prev,
        [programId]: updatedSchemes.length > 0 ? updatedSchemes : undefined,
      };
    });
  };

  if (isLoadingProgrammes) {
    return (
      <Card className="mb-5">
        <CardContent className="p-4 flex justify-center items-center h-40">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading programmes...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-5">
      <CardHeader className="border-b">
        <CardTitle>
          <h3 className="font-bold text-lg">
            Apply for<span className="text-red-500">*</span>
          </h3>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-2">
          {programmes.map((programme) => {
            const programSchemes = schemesByProgram[programme.id] || [];
            const isProgramExpanded = expandedPrograms.includes(programme.id);
            const isProgramSelected = selectedPrograms.includes(programme.id);
            const allProgramSchemesSelected =
              programSchemes.length > 0 &&
              programSchemes.every((scheme) =>
                isSchemeSelected(programme.id, scheme.id)
              );

            return (
              <div key={programme.id} className="border rounded-md">
                <div className="flex items-center justify-between p-3 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleProgramExpanded(programme.id)}
                    >
                      {isProgramExpanded || isProgramSelected ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <Checkbox
                      id={`program-${programme.id}`}
                      checked={isProgramSelected}
                      onCheckedChange={() => handleProgramToggle(programme.id)}
                    />
                    <Label
                      htmlFor={`program-${programme.id}`}
                      className="text-sm font-medium"
                    >
                      {programme.name}
                    </Label>
                  </div>

                  {isProgramSelected && programSchemes.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleProgramSelectAll(programme.id)}
                    >
                      {allProgramSchemesSelected ? "Deselect All" : "Select All"}
                    </Button>
                  )}
                </div>

                {(isProgramExpanded || isProgramSelected) && (
                  <div className="p-3 pl-6 space-y-3">
                    {isProgramSelected && programSchemes.length === 0 ? (
                      <div className="flex justify-center items-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm">Loading schemes...</span>
                      </div>
                    ) : programSchemes.length === 0 ? (
                      <div className="text-sm text-gray-500 italic">
                        No schemes available for this program
                      </div>
                    ) : (
                      programSchemes.map((scheme) => {
                        const isSchemeSelectedd = isSchemeSelected(
                          programme.id,
                          scheme.id
                        );

                        return (
                          <div key={scheme.id} className="border rounded-md">
                            <div className="flex items-center justify-between p-4 bg-gray-50">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  className="ml-4"
                                  id={`scheme-${scheme.id}`}
                                  checked={isSchemeSelectedd}
                                  onCheckedChange={() =>
                                    handleSchemeSelection(programme.id, scheme.id)
                                  }
                                />
                                <Label
                                  htmlFor={`scheme-${scheme.id}`}
                                  className="text-sm"
                                >
                                  {scheme.name}
                                </Label>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditorHierarchy;