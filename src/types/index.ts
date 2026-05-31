// src/types/index.ts

export type Campus =
  | "Baruch College"
  | "Borough of Manhattan Community College (BMCC)"
  | "Bronx Community College"
  | "Brooklyn College"
  | "City College of New York (CCNY)"
  | "College of Staten Island (CSI)"
  | "CUNY Graduate Center"
  | "CUNY School of Law"
  | "CUNY School of Labor and Urban Studies"
  | "CUNY School of Professional Studies (SPS)"
  | "Guttman Community College"
  | "Hostos Community College"
  | "Hunter College"
  | "John Jay College of Criminal Justice"
  | "Kingsborough Community College"
  | "LaGuardia Community College"
  | "Lehman College"
  | "Medgar Evers College"
  | "New York City College of Technology (City Tech)"
  | "Queens College"
  | "Queensborough Community College"
  | "York College"
  | "Macaulay Honors College"
  | "Craig Newmark Graduate School of Journalism"
  | "CUNY Graduate School of Public Health & Health Policy"
  | "CUNY Graduate School of Nursing";

export type MainCategoryId =
  | "campusFacilities"
  | "techAccess"
  | "safetyConduct"
  | "campusLife"
  | "suggestions";

export type RequestStatus = "Open" | "In Progress" | "Resolved" | "Cancelled";

export type Request = {
  id: number;
  campus: Campus;
  mainCategory: MainCategoryId;
  subCategory: string;
  name: string;
  isAnonymous: boolean;
  email?: string;
  location?: string;
  description: string;
  isPriority: boolean;
  submittedAt: string;
  status: RequestStatus;
};

export type Step =
  | "landing"
  | "selectCampus"
  | "selectMain"
  | "selectSub"
  | "fillForm"
  | "success"
  | "adminLogin"
  | "history";

export type AuthInfo = {
  token: string;
  username: string;
  displayName: string;
};

export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: number;
  message: string;
  type: ToastType;
};
