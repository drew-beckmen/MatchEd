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

  export type Condition = {
    _id?: string;
  };
