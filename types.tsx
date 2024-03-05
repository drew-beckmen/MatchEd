export type Experiment = {
  _id?: string;
  name: string;
  description: string;
  created_at?: string;
  last_updated?: string;
  researcher_id: string;
  condition_ids: string[];
};

export type EnrichedExperiment = Experiment & {
  conditions: Condition[];
};

export type School = {
  school_id: string;
  name: string;
  capacity: number;
  quality: "low" | "medium" | "high";
  district_students: string[];
};

export type Preferences = {
  school_id: string;
  rank: number;
  payoff: number;
};

export type Student = {
  student_id: string;
  truthful_preferences: Preferences[];
  is_finished: boolean;
  participant_id?: string;
  start_time?: string;
  end_time?: string;
  submitted_order?: string[];
  school_assignment?: string;
};

export type Condition = {
  _id?: string;
  experiment_id: string;
  name: string;
  num_students: number;
  num_schools: number;
  schools: School[];
  students: Student[];
  matching_algorithm: "DA" | "IA" | "TTCA";
  participant_instructions: string;
  created_at?: string;
  last_updated?: string;
  practice_mode: string;
};

// TODO: add practice mode later.

export type Participant = {
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  venmo: string;
  education: string;
  city: string;
  state: string;
  zip_code: string;
  participant_id: string;
  condition_id: string;
};
