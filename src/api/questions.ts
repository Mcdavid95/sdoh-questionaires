import { FormData } from "./question.interface";


export const calculateSDOHscore = (formData: FormData): { scores: Record<string, number>; total: number } => {
  const scores: Record<string, number> = {};
  let totalScore = 0;
  const sectionScores: Record<string, number> = {};

  // Housing (max 25 points)
  sectionScores.housing = 0; 
  scores.housingStability = formData.housingStability === 'Yes' ? 15 : 0;
  scores.housingAffordability = formData.housingAffordability === 'Yes' ? 5 : 0;
  scores.housingSafety = formData.housingSafety === 'Yes' ? 5 : 0;
  sectionScores.housing = scores.housingStability + scores.housingAffordability + scores.housingSafety;
  totalScore += sectionScores.housing;
  scores.housing = (sectionScores.housing / 25) * 100; // Calculate percentage for housing

  // Food Security (max 20 points)
  sectionScores.foodSecurity = 0;
  scores.foodAccess = formData.foodAccess === 'Yes' ? 15 : 0;
  scores.foodAffordability = formData.foodAffordability === 'Yes' ? 5 : 0;
  sectionScores.foodSecurity = scores.foodAccess + scores.foodAffordability;
  totalScore += sectionScores.foodSecurity;
  scores.food = (sectionScores.foodSecurity / 20) * 100; // Calculate percentage for food security

  // Transportation (max 10 points)
  sectionScores.transportation = 0;
  scores.transportationAccess = formData.transportationAccess === 'Yes' ? 10 : 0;
  sectionScores.transportation = scores.transportationAccess;
  totalScore += sectionScores.transportation;
  scores.transportation = (sectionScores.transportation / 10) * 100; // Calculate percentage for transportation

  // Social Support (max 10 points)
  sectionScores.popularity = 0;
  scores.socialSupport = formData.socialSupport === 'Yes' ? 10 : 0;

  // Discrimination (max 5 points)
  scores.discriminationExperience = formData.discriminationExperience === 'No' ? 5 : 0;
  sectionScores.popularity = scores.socialSupport + scores.discriminationExperience;
  totalScore += sectionScores.popularity;

  // Employment (max 10 points)
  sectionScores.income = 0;
  scores.employmentStatus = formData.employmentStatus === 'Yes' ? 5 : 0;
  scores.jobSecurity = formData.jobSecurity === 'Yes' ? 5 : 0;
  // Income (max 5 points)
  scores.incomeStability = formData.incomeStability === 'Yes' ? 5 : 0;
  sectionScores.income = scores.employmentStatus + scores.jobSecurity + scores.incomeStability;
  totalScore += sectionScores.income;

  // Education (max 10 points)
  sectionScores.educationLevel = 0
  switch (formData.educationLevel) {
    case "Graduate Degree": scores.educationLevel = 10; break;
    case "Bachelor's Degree": scores.educationLevel = 8; break;
    case "Some College": scores.educationLevel = 6; break;
    case "High School Diploma/GED": scores.educationLevel = 4; break;
    case "Less than High School": scores.educationLevel = 2; break;
    default: scores.educationLevel = 0;
  }
  totalScore += sectionScores.educationLevel;

  // Safety (max 5 points)
  scores.neighborhoodSafety = formData.neighborhoodSafety === 'Yes' ? 5 : 0;
  totalScore += scores.neighborhoodSafety;

  // Neighborhood & Physical Environment (max 5 points)
  scores.environmentalConcerns = formData.environmentalConcerns === 'No' ? 3 : 0;
  totalScore += scores.environmentalConcerns;
  scores.accessToGreenSpaces = formData.accessToGreenSpaces === 'Yes' ? 2 : 0;
  totalScore += scores.accessToGreenSpaces;

  return { scores, total: totalScore };  };
