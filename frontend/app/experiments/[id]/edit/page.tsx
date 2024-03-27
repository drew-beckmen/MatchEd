import ExperimentForm from "@/components/ExperimentForm";
import { Experiment } from "@/types";
import { fetchData } from "@/app/actions";

export default async function EditExperiment({
  params,
}: {
  params: { id: string };
}) {
  const experiment: Experiment = await fetchData(
    `/api/experiments/${params.id}`,
  );

  return <ExperimentForm mode="edit" experiment={experiment} />;
}
