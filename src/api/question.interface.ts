export interface FormData {
  // Housing
  housingStability?: string;
  housingAffordability?: string;
  housingSafety?: string;

  // Food Security
  foodAccess?: string;
  foodAffordability?: string;

  // Transportation
  transportationAccess?: string;

  // Social Support
  socialSupport?: string;

  // Employment
  employmentStatus?: string;
  jobSecurity?: string;

  // Education
  educationLevel?: string;

  // Income
  incomeStability?: string;

  // Discrimination
  discriminationExperience?: string;

  // Safety
  neighborhoodSafety?: string;

  // Neighborhood & Physical Environment
  environmentalConcerns?: string;
  accessToGreenSpaces?: string;
}

export interface IQuestion {
  id: string;
  text: string;
  type: string
  options: string[]
}