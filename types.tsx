export type Experiment = {
    _id?: string;
    name: string;
    description: string;
    created_at?: string;
    last_updated?: string;
    researcher_id: string;
    trial_ids: string[];
  };
