import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { EnrichedExperiment } from "@/types";
import { fetchData } from "@/app/actions";
import { convertUTCToLocalTimeString } from "@/app/util";

export default async function Page({ params }: { params: { id: string } }) {
  const experimentData: EnrichedExperiment = await fetchData(
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
                    <path
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  <span className="mt-2 block text-sm font-semibold text-gray-900">
                    Create a new experimental condition
                  </span>
                </Link>
              ) : (
                <div>
                  <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                      <h2 className="text-base font-semibold leading-6 text-gray-900 mb-2">
                        Experimental Conditions
                      </h2>
                      <p className="mt-2 text-sm text-gray-700">
                        A list of all the experimental conditions within your
                        experiment. Click into each one to get more information
                        on participant responses.
                      </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                      <Link
                        type="button"
                        href={`/experiments/${experimentData._id}/conditions/new`}
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Add condition
                      </Link>
                    </div>
                  </div>
                  <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Name
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Number of Students
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Number of Schools
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Matching Algorithm
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Created At
                                </th>
                                <th
                                  scope="col"
                                  className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                >
                                  <span className="sr-only">Edit</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {experimentData.conditions.map((condition) => (
                                <tr key={condition._id}>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    <Link
                                      href={`/experiments/${experimentData._id}/conditions/${condition._id}`}
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      {condition.name}
                                    </Link>
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {condition.num_students}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {condition.num_schools}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {condition.matching_algorithm}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {convertUTCToLocalTimeString(
                                      condition.created_at as string,
                                    )}{" "}
                                    UTC
                                  </td>
                                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <Link
                                      href={`/experiments/${experimentData._id}/conditions/${condition._id}/edit`}
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      Edit
                                      <span className="sr-only">
                                        , {condition.name}
                                      </span>
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
