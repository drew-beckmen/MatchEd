"use client";

import { Condition } from "@/types";
import Link from "next/link";
import { FormEventHandler } from "react";

export default function RankingSubmission({
  conditionData,
  conditionId,
  participantId,
  submitGame,
  isPractice,
}: {
  conditionData: Condition;
  conditionId: string;
  participantId: string;
  submitGame: FormEventHandler<HTMLFormElement>;
  isPractice: boolean;
}) {
  return conditionData.students.length > 0 &&
    conditionData.students[0].submitted_order &&
    !isPractice ? (
    <>
      <div className="border-b border-gray-200 rounded-lg bg-white px-4 py-5 sm:px-6 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 my-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Submit Rankings
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          You already submitted your rankings. We will be in touch with you once
          all participants have submitted their rankings.
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
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Submit Rankings
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        There are a total of {conditionData.num_students} students applying for
        spots at {conditionData.num_schools} schools. The capacity of each
        school is listed below. Please submit your rankings for each school. The
        goal is to maximize your individual payoff. You have priority at your
        district school, which is indicated below. Note that your payoff profile
        is uniquely determined and differs for other participants.
      </p>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Want to view the full instructions again?&nbsp;
        <Link
          href={`/public/${conditionId}/${participantId}/instructions`}
          target="_blank"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Click here.
        </Link>
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
                    {school.name}
                  </h3>
                  {school.district_students.includes(
                    conditionData.students[0].student_id,
                  ) && (
                    <span
                      className={`inline-flex flex-shrink-0 items-center rounded-full px-1.5 py-0.5 text-xs font-medium text-green-700 bg-green-50 ring-green-600/20`}
                    >
                      District School
                    </span>
                  )}
                  <span
                    className={`inline-flex flex-shrink-0 items-center rounded-full px-1.5 py-0.5 text-xs font-medium text-gray-800 bg-yellow-50 ring-gray-600/20`}
                  >
                    Capacity {school.capacity}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  If you end up matched to {school.name}, you will
                  receive a payout of{" "}
                  <strong>
                    $
                    {conditionData.students[0].truthful_preferences[idx].payoff}
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
    </form>
  );
}
