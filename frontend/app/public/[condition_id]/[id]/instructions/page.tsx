import { fetchData } from "@/app/actions";
import ProgressSteps from "@/components/ProgressSteps";
import { Condition, Participant } from "@/types";
import Link from "next/link";
import parse from "html-react-parser";

const stepsNoRepeat = [
  { id: "01", name: "Demographic Information", status: "complete" },
  { id: "02", name: "Instructions", status: "current" },
  { id: "03", name: "Play Game", status: "upcoming" },
];

const stepsWithRepeat = [
  { id: "01", name: "Demographic Information", status: "complete" },
  { id: "02", name: "Instructions", status: "current" },
  { id: "03", name: "Practice Game", status: "upcoming" },
  { id: "04", name: "Play Game", status: "upcoming" },
];

export default async function Page({
  params,
}: {
  params: { condition_id: string; id: string };
}) {
  let finishedDemographics = true;
  const participantData: Participant = await fetchData(
    `/api/public/participants/${params.id}`,
  ).catch((error) => {
    finishedDemographics = false;
  });
  const conditionData: Condition = await fetchData(
    `/api/public/conditions/${params.condition_id}/${params.id}`,
  );
  let steps = stepsNoRepeat;
  if (conditionData.practice_mode == "repeat-5") {
    steps = stepsWithRepeat;
  }
  console.log(steps);
  const instructions = parse(conditionData.participant_instructions);
  return (
    <>
      <ProgressSteps steps={steps} />
      <div className="border-b border-gray-200 rounded-lg bg-white px-4 py-5 sm:px-6 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 my-12">
        {finishedDemographics ? (
          <>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Instructions for MatchEd
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {participantData.first_name}, thank you for providing your
              demographic information. Please read the instructions below and
              then click &quot;Next&quot; to play the game. These instructions
              have been written and provided by the researcher who is conducting
              this experiment.
            </p>
            <div className="bg-white shadow-2xl sm:rounded-lg my-12">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  From the researcher
                </h3>
                <div className="mt-2 sm:flex sm:items-start sm:justify-between">
                  <div className="text-sm text-gray-500">{instructions}</div>
                </div>
                <div className="mt-5  flex items-center justify-end">
                  <Link
                    href={
                      steps == stepsNoRepeat
                        ? `/public/${params.condition_id}/${params.id}/game`
                        : `/public/${params.condition_id}/${params.id}/practice`
                    }
                    type="button"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Next
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              According to our records, you have not yet provided your
              demographic information. Please navigate to&nbsp;
              <Link
                href={`/public/${params.condition_id}/${params.id}`}
                className="text-indigo-600 hover:text-indigo-900"
              >
                the demographic information page
              </Link>{" "}
              to complete this step.
            </p>
          </>
        )}
      </div>
    </>
  );
}
