import { fetchData } from "@/app/actions";
import GameForm from "@/components/GameForm";
import { Condition } from "@/types";


export default async function Page({
  params,
}: {
  params: { condition_id: string; id: string };
}) {
  const conditionData: Condition = await fetchData(
    `/api/public/conditions/${params.condition_id}/${params.id}`,
  );
  return (
    <GameForm conditionData={conditionData} conditionId={params.condition_id} participantId={params.id} />
  );
}
