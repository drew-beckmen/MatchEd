import { fetchData, saveParticipantData } from "@/app/actions";
import ProgressSteps from "@/components/ProgressSteps";

const steps = [
  { id: "01", name: "Demographic Information", status: "current" },
  { id: "02", name: "Instructions", status: "upcoming" },
  { id: "03", name: "Play Game", status: "upcoming" },
];
const serverlessApi = process.env.NEXT_SERVERLESS_API;

export default async function Page({
  params,
}: {
  params: { condition_id: string; id: string };
}) {
  let alreadySubmitted = true;
  const participantData = await fetchData(
    `${serverlessApi}/api/public/participants/${params.id}`,
  ).catch((error) => {
    alreadySubmitted = false;
  });
  console.log(alreadySubmitted);
  // ).then((response) => {
  //   console.log("HERE", response)
  //   // If the participant has already entered their first name, redirect them to the next step
  //   redirect(`/public/${params.condition_id}/${params.id}/instructions`);
  // }).catch((error) => {
  // });

  return alreadySubmitted ? (
    <>
      <ProgressSteps steps={steps} />

      <div className="rounded-lg bg-white px-4 py-5 sm:px-6 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 my-12">
        <div className="space-y-12">
          <div className=" pb-8">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              You&apos;ve already completed the demographic information step.
              Click next to continue.
            </h2>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6">
          <a
            href={`/public/${params.condition_id}/${params.id}/instructions`}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Next
          </a>
        </div>
      </div>
    </>
  ) : (
    <>
      <ProgressSteps steps={steps} />
      <div className="border-b border-gray-200 rounded-lg bg-white px-4 py-5 sm:px-6 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 my-12">
        <form action={saveParticipantData}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-8">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Welcome to MatchEd! Thank you for participating in this
                experiment.
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                This demographic information collected below may be used to help
                us understand the impact of the game on different groups of
                people. We will not share your personally identifying
                information with anyone.
              </p>
            </div>

            <div className="border-b border-gray-900/10 pb-8">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Personal Information
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="date_of_birth"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Date of Birth
                  </label>
                  <div className="mt-2">
                    <input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      autoComplete="date_of_birth"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="venmo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Venmo Username{" "}
                    <span className="font-small text-gray-400">
                      (optional, for paid studies only)
                    </span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="venmo"
                      name="venmo"
                      type="text"
                      autoComplete="venmo"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="education"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Educational Attainment
                  </label>
                  <div className="mt-2">
                    <select
                      id="edutcation"
                      name="education"
                      autoComplete="education"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option>High School Diploma</option>
                      <option>Bachelors Degree</option>
                      <option>Masters Degree or Higher</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2 sm:col-start-1">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    City of Residence
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    State / Province
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="state"
                      id="state"
                      autoComplete="address-level1"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="zip_code"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    ZIP / Postal code
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="zip_code"
                      id="zip_code"
                      autoComplete="zip_code"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
            <input type="hidden" name="participant_id" value={params.id} />
            <input
              type="hidden"
              name="condition_id"
              value={params.condition_id}
            />
            <div className=" flex items-center justify-end gap-x-6">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
