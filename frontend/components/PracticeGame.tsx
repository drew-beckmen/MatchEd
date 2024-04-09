"use client";

import { Condition } from "@/types";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckIcon } from '@heroicons/react/20/solid'


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
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
    const practice = [
        { name: 'Practice Game 1', status: 'current' },
        { name: 'Practice Game 2', status: 'upcoming' },
        { name: 'Practice Game 3', status: 'upcoming' },
        { name: 'Practice Game 4', status: 'upcoming' },
        { name: 'Practice Game 5', status: 'upcoming' },
    ]
  const router = useRouter();

  return (
    <>
    <h2 className="text-base font-semibold leading-7 text-gray-900">
      Practice Rounds
    </h2>
    <nav aria-label="Progress" className="mx-auto flex justify-center">
    <ol role="list" className="flex items-center">
      {practice.map((step, stepIdx) => (
        <li key={step.name} className={classNames(stepIdx !== practice.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>
          {step.status === 'complete' ? (
            <>
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="h-0.5 w-full bg-indigo-600" />
              </div>
              <span
                className="relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-900"
              >
                <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                <span className="sr-only">{step.name}</span>
              </span>
            </>
          ) : step.status === 'current' ? (
            <>
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="h-0.5 w-full bg-gray-200" />
              </div>
              <span
                className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white"
                aria-current="step"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" aria-hidden="true" />
                <span className="sr-only">{step.name}</span>
              </span>
            </>
          ) : (
            <>
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="h-0.5 w-full bg-gray-200" />
              </div>
              <span
                className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400"
              >
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
    <p className="mt-4 text-sm leading-6 text-gray-600">
        To prepare you for the game, you will play a series of practice rounds. The goal is to familiarize yourself with the game and better understand the underlying matching process. In each round, you will submit your preferences for schools, and the system will match you to a school based on your preferences, the preferences of the schools, and the preferences of your simulated oppponents. At the end of each practice round, you will see your match and the payoff you would receive if this were a real game.
    </p>
  </div>
  </>
  );
}
