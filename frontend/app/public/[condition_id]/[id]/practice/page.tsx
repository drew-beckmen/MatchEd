import { fetchData } from "@/app/actions";
import PracticeGame from "@/components/PracticeGame";
import ProgressSteps from "@/components/ProgressSteps";
import { Condition, Participant } from "@/types";
import Link from "next/link";

const steps = [
  { id: "01", name: "Demographic Information", status: "complete" },
  { id: "02", name: "Instructions", status: "complete" },
  { id: "03", name: "Practice", status: "current" },
  { id: "04", name: "Play!", status: "upcoming" },
];

export default async function Page({
  params,
}: {
  params: { condition_id: string; id: string };
}) {
  let finishedDemographics = true;
  await fetchData(
    `/api/public/participants/${params.id}`,
  ).catch((error) => {
    finishedDemographics = false;
  });
  const conditionData: Condition = await fetchData(
    `/api/public/conditions/${params.condition_id}/${params.id}`,
  );
  return (
    <>
      <ProgressSteps steps={steps} />
      <div className="border-b border-gray-200 rounded-lg bg-white px-4 py-5 sm:px-6 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 my-12">
      {/* TODO: remove ! once done building UI */}
      {!finishedDemographics ? (
        <PracticeGame
            conditionData={conditionData}
            conditionId={params.condition_id}
            participantId={params.id}
      />
      ) : (
        <>
          <p className="mt-1 text-sm leading-6 text-gray-600">
          According to our records, you have not yet provided your demographic information. Please navigate to&nbsp;
          <Link href={`/public/${params.condition_id}/${params.id}`} className="text-indigo-600 hover:text-indigo-900">
            the demographic information page</Link> to complete this step before playing the game.
        </p>
        </>
    )}</div></>
  );
}
