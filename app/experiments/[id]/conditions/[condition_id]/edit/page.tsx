import ConditionForm from "@/components/ConditionForm";
import { Condition } from "@/types";
import { fetchData } from "@/app/actions";

export default async function Page({ params }: { params: { id: string, condition_id: string } }) {
    const condition: Condition = await fetchData(
        `/api/experiments/${params.id}/conditions/${params.condition_id}`,
    );
    
  return (
    <>
        <ConditionForm experiment_id={params.id} mode="edit" condition={condition} condition_id={params.condition_id} />
    </>
  );
}
