import { IBase } from "./Base";

export interface Employee extends IBase {
  cid?: string;
  name?: string;
  dob: {
    day?: number;
    month?: number;
    year?: number;
    dayOfWeek?: number;
    dayOfYear?: number;
    dayNumber?: number;
  };
  email?: string;
  phoneNumber?: string;
  address?: string;
  position?: string;
  startDate: {
    day?: number;
    month?: number;
    year?: number;
  };
}
