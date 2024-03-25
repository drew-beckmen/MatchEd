"use client"

import ProgressSteps from "@/components/ProgressSteps";
import { Condition } from "@/types";
import { FormEvent } from "react";
import { useRouter } from 'next/navigation'

const steps = [
    { id: "01", name: "Demographic Information", status: "complete" },
    { id: "02", name: "Instructions", status: "complete" },
    { id: "03", name: "Play Game", status: "current" },
  ];
  
  const qualities = {
    high: "text-green-700 bg-green-50 ring-green-600/20",
    medium: "text-yellow-700 bg-yellow-50 ring-yellow-600/20",
    low: "text-red-800 bg-red-50 ring-red-600/20",
};

export default function GameForm({ conditionData, conditionId, participantId }: { conditionData: Condition, conditionId: string, participantId: string }) {
    const router = useRouter()

    async function submitGame(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
    
        const formData = new FormData(event.currentTarget);
        let listRankings = []
        for (let i = 0; i < conditionData.schools.length; i++) {
            listRankings.push(formData.get(`school-${i}`))
        }
        // Check that rankings are unique from 0 to n - 1
        if (new Set(listRankings).size !== listRankings.length) {
            alert("Please submit unique rankings for each school.")
            return
        }

        // Update the participants submitted order
        await fetch(`/api/public/conditions/${conditionId}/${participantId}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(listRankings),
        }).then((response) => {
            if (response.ok) {
                router.push('/public/thanks')
            } else {
                alert("Error submitting rankings. Please try again.")
            }
        }
        );
    }

    return (
        conditionData.students.length > 0 && conditionData.students[0].submitted_order ? (
            <>
                    <ProgressSteps steps={steps} />
        <div className="border-b border-gray-200 rounded-lg bg-white px-4 py-5 sm:px-6 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 my-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Submit Rankings
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            You already submitted your rankings. We will be in touch with you once all participants have submitted their rankings.
          </p>
          <div className=" flex items-center justify-end gap-x-6">
              <a
                href={`/public/thanks`}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Next
              </a>
              </div>
          </div>

            </>
        ) : (
    <form onSubmit={submitGame}>
        <ProgressSteps steps={steps} />
        <div className="border-b border-gray-200 rounded-lg bg-white px-4 py-5 sm:px-6 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 my-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Submit Rankings
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            There are a total of {conditionData.num_students} students applying
            for spots at {conditionData.num_schools} schools. The capacity of each
            school is listed below. Please submit your rankings for each school.
            The goal is to maximize your individual payoff.
          </p>
          <ul
            role="list"
            className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {conditionData.schools.map((school, idx) => (
              <li
                key={school.school_id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow-2xl"
              >
                <div className="flex w-full items-center justify-between space-x-6 p-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-sm font-medium text-gray-900">
                        School {school.name}
                      </h3>
                      <span
                        className={`inline-flex flex-shrink-0 items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${qualities[school.quality]}`}
                      >
                        Quality{" "}
                        {school.quality.charAt(0).toUpperCase() +
                          school.quality.slice(1)}
                      </span>
                      <span
                        className={`inline-flex flex-shrink-0 items-center rounded-full px-1.5 py-0.5 text-xs font-medium text-gray-800 bg-gray-50 ring-gray-600/20`}
                      >
                        Capacity {school.capacity}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      School {school.name} is your choice number{" "}
                      {conditionData.students[0].truthful_preferences[idx].rank}.
                      If you end up matched to school {school.name}, you will
                      receive a payout of{" "}
                      <strong>
                        $
                        {
                          conditionData.students[0].truthful_preferences[idx]
                            .payoff
                        }
                        .
                      </strong>
                    </p>
                  </div>
                </div>
                <div>
                  <div className="-mt-px flex">
                    <div className="flex w-0 flex-1 items-center justify-end	">
                      <label className="text-sm text-gray-500 mr-4">
                        Select Ranking
                      </label>
                      <select
                        id="school"
                        name={`school-${idx}`}
                        autoComplete="education"
                        className="block border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        {conditionData.schools.map((school, idx) => (
                          <option key={school.school_id} value={idx + 1}>
                            {idx + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-end">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </div>
      </form>)
    )
}