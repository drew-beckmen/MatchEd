import { fetchData } from "@/app/actions";
import ConditionResults from "@/components/ConditionResults";
import ConditionTabs from "@/components/ConditionTabs";
import { Condition } from "@/types";

export default async function Page({
  params,
}: {
  params: { id: string; condition_id: string };
}) {
  const tabs = [
    {
      name: "Setup",
      href: `/experiments/${params.id}/conditions/${params.condition_id}`,
      current: false,
    },
    {
      name: "Results",
      href: `/experiments/${params.id}/conditions/${params.condition_id}/results`,
      current: true,
    },
  ];
  const conditionData: Condition = await fetchData(
    `/api/experiments/${params.id}/conditions/${params.condition_id}`,
  );
  return (
    <div className="min-h-full py-4">
      <header>
        <div className="flex justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Condition <em>{conditionData.name}</em>
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pt-4 mx-12">
            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-4">
              <ConditionTabs tabs={tabs} />
              <ConditionResults condition={conditionData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
