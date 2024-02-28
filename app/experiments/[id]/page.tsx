import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Experiment } from "@/types";
import { fetchData } from "@/app/actions";

export default async function Page({ params }: { params: { id: string } }) {
  const experimentData: Experiment = await fetchData(
    `/api/experiments/${params.id}`,
  );

  return (
    <>
      <div className="min-h-full py-10">
        <header>
          <div className="flex justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Experiment: <em>{experimentData.name}</em>
            </h1>
            <Link
              type="button"
              href={`/experiments/${experimentData._id}/edit`}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PencilSquareIcon className="h-5 w-5 inline" />
            </Link>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4  sm:px-6 lg:px-8">
            <div className="pt-4">
              <div className="sm:flex sm:items-center mb-6">
                <div className="sm:flex-auto">
                  <h2 className="text-base font-semibold leading-6 text-gray-900">
                    Description
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {experimentData.description}
                  </p>
                </div>
              </div>
              <h2 className="text-base font-semibold leading-6 text-gray-900 mb-2">
                Experimental Conditions
              </h2>
              {experimentData.condition_ids.length === 0 ? (
                  <Link
                    type="button"
                    href={`/experiments/${experimentData._id}/conditions/new`}
                    className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24" 
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                  <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />

                    </svg>
                    <span className="mt-2 block text-sm font-semibold text-gray-900">Create a new experimental condition</span>
                  </Link>
              ) : (
                <p>We have conditions</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
