
const steps = [
    { id: '01', name: 'Demographic Information', status: 'complete' },
    { id: '02', name: 'Instructions', status: 'current' },
    { id: '03', name: 'Play Game', status: 'upcoming' },
  ]
  

import { fetchData } from "@/app/actions";
import ProgressSteps from "@/components/ProgressSteps"
import { Participant } from "@/types";

export default async function Page({ params }: { params: {condition_id: string, id: string} }) {
    const participantData: Participant = await fetchData(`/api/public/participants/${params.id}`);
    return (
        <>
        <ProgressSteps steps={steps} />
        <div className="border-b border-gray-200 rounded-lg bg-white px-4 py-5 sm:px-6 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 my-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Instructions for MatchEd</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
            {participantData.first_name}, thank you for providing your demographic information. Please read the instructions below and then click "Next" to play the game.
            These instructions have been written and provided by the researcher who is conducting this experiment.
        </p>
        <div className="bg-white shadow-2xl sm:rounded-lg my-12">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">From the researcher</h3>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-sm text-gray-500">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae voluptatibus corrupti atque
              repudiandae nam.
            </p>
          </div>
          <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
        </div>
        </>
    )
};
