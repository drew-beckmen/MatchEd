"use client";

import ConditionForm from "@/components/ConditionForm";

export default function Page({ params }: { params: { id: string } }) {
  return <ConditionForm experiment_id={params.id} mode="new" />;
}
