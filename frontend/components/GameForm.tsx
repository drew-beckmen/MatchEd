"use client";

import { Condition } from "@/types";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RankingSubmission from "./RankingSubmission";

const qualities = {
  high: "text-green-700 bg-green-50 ring-green-600/20",
  medium: "text-yellow-700 bg-yellow-50 ring-yellow-600/20",
  low: "text-red-800 bg-red-50 ring-red-600/20",
};

export default function GameForm({
  conditionData,
  conditionId,
  participantId,
}: {
  conditionData: Condition;
  conditionId: string;
  participantId: string;
}) {
  const router = useRouter();

  async function submitGame(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    let listRankings = [];
    for (let i = 0; i < conditionData.schools.length; i++) {
      listRankings.push(formData.get(`school-${i}`));
    }
    // Check that rankings are unique from 0 to n - 1
    if (new Set(listRankings).size !== listRankings.length) {
      alert("Please submit unique rankings for each school.");
      return;
    }

    // Update the participants submitted order
    await fetch(`/api/public/conditions/${conditionId}/${participantId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(listRankings),
    }).then((response) => {
      if (response.ok) {
        router.push("/public/thanks");
      } else {
        alert("Error submitting rankings. Please try again.");
      }
    });
  }

  return (
    <RankingSubmission
      conditionData={conditionData}
      conditionId={conditionId}
      participantId={participantId}
      isPractice={false}
      submitGame={submitGame}
    />
  );
}
