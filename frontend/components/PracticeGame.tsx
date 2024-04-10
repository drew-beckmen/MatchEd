"use client";

import { Condition } from "@/types";
import { FormEvent, useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import RankingSubmission from "./RankingSubmission";
import PracticePlayDialog from "./PracticePlayDialog";
import Link from "next/link";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PracticeGame({
  conditionData,
  conditionId,
  participantId,
}: {
  conditionData: Condition;
  conditionId: string;
  participantId: string;
}) {
  let [practice, setPractice] = useState([
    { name: "Practice Game 1" },
    { name: "Practice Game 2" },
    { name: "Practice Game 3" },
    { name: "Practice Game 4" },
    { name: "Practice Game 5" },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  // 1 indexed (so 0 means no practice rounds have been completed)
  let [practiceRoundComplete, setPracticeRoundComplete] = useState(
    (conditionData.students[0]?.practice_orderings &&
      conditionData.students[0]?.practice_orderings.length) ||
      0,
  );
  console.log();
  // Potentially fix: will result in inconsistent state if the user refreshes the page
  let [rankingsPerRound, setRankingsPerRound] = useState<number[][]>([]);
  let [outcomesPerRound, setOutcomesPerRound] = useState<number[]>([]);
  let [schoolMatchesPerRound, setSchoolMatchesPerRound] = useState<string[]>(
    [],
  );

  async function submitGame(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Same as GameForm.tsx, potentially refactor
    const formData = new FormData(event.currentTarget);
    let listRankings: number[] = [];
    for (let i = 0; i < conditionData.schools.length; i++) {
      let ranking = formData.get(`school-${i}`) as string;
      listRankings.push(parseInt(ranking));
    }
    // Check that rankings are unique from 0 to n - 1
    if (new Set(listRankings).size !== listRankings.length) {
      alert("Please submit unique rankings for each school.");
      return;
    }

    // Update the participant's practice ordering and return the payoff.
    await fetch(
      `/api/public/conditions/${conditionId}/${participantId}/practice`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listRankings),
      },
    ).then(async (response) => {
      if (response.ok) {
        // Update the practice round status
        let data = await response.json();
        setPractice(
          practice.map((step, stepIdx) => {
            if (stepIdx <= practiceRoundComplete) {
              return { ...step, status: "complete" };
            } else if (stepIdx === practiceRoundComplete + 1) {
              return { ...step, status: "current" };
            } else {
              return step;
            }
          }),
        );
        setPracticeRoundComplete(practiceRoundComplete + 1);

        // Reset input fields
        for (let i = 0; i < conditionData.schools.length; i++) {
          formData.set(`school-${i}`, "");
        }
        setRankingsPerRound([...rankingsPerRound, listRankings]);
        setOutcomesPerRound([...outcomesPerRound, data["payoff"]]);
        setSchoolMatchesPerRound([...schoolMatchesPerRound, data["school"]]);
        setIsOpen(true);
      } else {
        alert("Error submitting rankings. Please try again.");
      }
    });
  }

  return (
    <>
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Practice Rounds
      </h2>
      <p className="my-2 text-sm leading-6 text-gray-600">
        To prepare you for the game, you will play a 5 practice rounds. The goal
        is to familiarize yourself with the game and better understand the
        underlying matching process. In each round, you will submit your
        preferences for schools, and the system will match you to a school based
        on your preferences, the preferences of the schools, and the preferences
        of your simulated oppponents. At the end of each practice round, you
        will see your match and the payoff you would receive if this were a real
        game. Remember, the goal is to find the best strategy to maximize your
        payoff!
      </p>
      <nav aria-label="Progress" className="mx-auto flex justify-center">
        <ol role="list" className="flex items-center">
          {practice.map((step, stepIdx) => (
            <li
              key={step.name}
              className={classNames(
                stepIdx !== practice.length - 1 ? "pr-8 sm:pr-20" : "",
                "relative",
              )}
            >
              {stepIdx < practiceRoundComplete ? (
                <>
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="h-0.5 w-full bg-indigo-600" />
                  </div>
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-900">
                    <CheckIcon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{step.name}</span>
                  </span>
                </>
              ) : stepIdx === practiceRoundComplete ? (
                <>
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="h-0.5 w-full bg-gray-200" />
                  </div>
                  <span
                    className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white"
                    aria-current="step"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-indigo-600"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{step.name}</span>
                  </span>
                </>
              ) : (
                <>
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="h-0.5 w-full bg-gray-200" />
                  </div>
                  <span className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400">
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{step.name}</span>
                  </span>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div>
        {(!("practice_orderings" in conditionData.students[0]) ||
          !conditionData.students[0].practice_orderings ||
          conditionData.students[0].practice_orderings.length < 5) &&
        rankingsPerRound.length < 5 ? (
          <div className="border-2 rounded-lg mt-4 p-4">
            <RankingSubmission
              conditionData={conditionData}
              conditionId={conditionId}
              participantId={participantId}
              submitGame={submitGame}
              isPractice={true}
            />
          </div>
        ) : (
          <div className="mt-4">
            <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
              <div
                className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                aria-hidden="true"
              >
                <div
                  className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
                  style={{
                    clipPath:
                      "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
                  }}
                />
              </div>
              <div
                className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                aria-hidden="true"
              >
                <div
                  className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
                  style={{
                    clipPath:
                      "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
                  }}
                />
              </div>
              <p className="text-sm leading-6 text-gray-900">
                You&apos;ve successfully completed all practice rounds!{" "}
                <Link
                  href={`/public/${conditionId}/${participantId}/game`}
                  className="whitespace-nowrap font-semibold"
                >
                  Time for the real game&nbsp;
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </p>
              <div className="flex flex-1 justify-end"></div>
            </div>
          </div>
        )}
      </div>
      <PracticePlayDialog
        isOpen={isOpen}
        setOpen={setIsOpen}
        yourSubmissions={rankingsPerRound}
        payoffs={outcomesPerRound}
        schools={schoolMatchesPerRound}
      />
    </>
  );
}
