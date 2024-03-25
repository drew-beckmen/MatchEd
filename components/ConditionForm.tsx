"use client";

import Link from "next/link";
import { useState } from "react";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import { Condition, School, Student } from "@/types";
import { useRouter } from "next/navigation";
import { revalidatePath } from 'next/cache'

type ConditionFormProps = {
  condition?: Condition;
  condition_id?: string;
  experiment_id: string;
  mode: "edit" | "new";
  disable?: boolean;
};

export default function ConditionForm({
  condition,
  experiment_id,
  condition_id,
  mode,
  disable = false,
}: ConditionFormProps) {
  const router = useRouter();
  const isNew = mode === "new";
  const [numStudents, setNumStudents] = useState(
    condition ? condition.num_students : 0,
  );
  const [numSchools, setNumSchools] = useState(
    condition ? condition.num_schools : 0,
  );

  // Form submission handler
  function buildCondition(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const forms = document.getElementsByTagName("form");
    let formData = [];
    for (let i = 0; i < forms.length; i++) {
      formData.push(Object.fromEntries(new FormData(forms[i]).entries()));
    }

    // Construct basic condition object
    let condition: Condition = {
      name: formData[0].name as string,
      experiment_id: experiment_id,
      num_students: parseInt(formData[0].num_students as string),
      num_schools: parseInt(formData[0].num_schools as string),
      schools: [],
      students: [],
      matching_algorithm: formData[0].matching_algorithm as
        | "DA"
        | "IA"
        | "TTCA",
      participant_instructions: formData[0].participant_instructions as string,
      practice_mode: "",
    };

    let studentFormData = formData[1];
    // Construct students array
    for (let i = 0; i < condition.num_students; i++) {
      let student: Student = {
        student_id: `${i}`,
        truthful_preferences: [],
        is_finished: false,
      };
      for (let j = 0; j < condition.num_schools; j++) {
        student.truthful_preferences.push({
          school_id: j.toString(),
          rank: parseInt(studentFormData[`students[${i}][${j}][rank]`] as string),
          payoff: parseInt(studentFormData[`students[${i}][${j}][payoff]`] as string),
        });
      }
      condition.students.push(student);
    }

    let schoolFormData = formData[2];

    // Construct schools array
    for (let i = 0; i < condition.num_schools; i++) {
      let school: School = {
        school_id: `${i}`,
        name: schoolFormData[`schools[${i}][name]`] as string,
        capacity: parseInt(schoolFormData[`schools[${i}][capacity]`] as string),
        quality: schoolFormData[`schools[${i}][quality]`] as
          | "low"
          | "medium"
          | "high",
        district_students: [],
      };

      // Max number of district students is equal to the number of students
      for (let j = 0; j < condition.num_students; j++) {
        if (`schools[${i}][district_students][${i}]` in schoolFormData) {
          school.district_students.push(
            schoolFormData[`schools[${i}][district_students][${i}]`] as string,
          );
        }
      }
      condition.schools.push(school);
    }
    console.log(JSON.stringify(condition));
    // Send request to create condition
    fetch(
      `/api/experiments/${experiment_id}/conditions/${isNew ? "" : condition_id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(condition),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        router.push(`/experiments/${experiment_id}/conditions/${data._id}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-4 divide-y divide-gray-900/10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 mb-4">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {isNew ? "New Condition" : disable ? "" : "Edit Condition"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {!disable ? (
                <p>
                  Not ready to {isNew ? "create " : "edit "} an experimental
                  condition?{" "}
                  <Link
                    href="/experiments/[id]"
                    as={`/experiments/${experiment_id}`}
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Go back.
                  </Link>
                </p>
              ) : (
                <>
                  <p>
                    Here are the details of the experimental condition. Want to
                    edit?
                  </p>
                  <Link
                    href="/experiments/[id]/conditions/[condition_id]/edit"
                    as={`/experiments/${experiment_id}/conditions/${condition_id}/edit`}
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Click here.
                  </Link>
                </>
              )}
            </p>
          </div>

          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="pl-2.5 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Arm 1"
                        defaultValue={condition?.name}
                        disabled={disable}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="participant_instructions"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Participant Instructions
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="participant_instructions"
                      name="participant_instructions"
                      rows={3}
                      disabled={disable}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={condition?.participant_instructions}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    These instructions will be provided to experimental
                    participants before they can play the game.
                  </p>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="num_students"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Number of Participants
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="num_students"
                      id="num_students"
                      disabled={disable}
                      defaultValue={numStudents}
                      onChange={(e) => setNumStudents(parseInt(e.target.value))}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="num_schools"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Number of Schools
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="num_schools"
                      id="num_schools"
                      defaultValue={numSchools}
                      disabled={disable}
                      onChange={(e) => setNumSchools(parseInt(e.target.value))}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="matching_algorithm"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Matching Algorithm
                  </label>
                  <div className="mt-2">
                    <select
                      id="amatching_algorithmlgo"
                      name="matching_algorithm"
                      disabled={disable}
                      defaultValue={condition?.matching_algorithm}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value="DA">Deferred Acceptance</option>
                      <option value="IA">Immediate Acceptance</option>
                      <option value="TTCA">Top Trading Cycles</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="practice_mode"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Practice Mode
                  </label>
                  <div className="mt-2">
                    <select
                      id="practice_mode"
                      name="practice_mode"
                      disabled={disable}
                      defaultValue={condition?.practice_mode}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option>None</option>
                      <option>Repeat 10 vs. Random</option>
                      <option>Repeat 20 vs. Random</option>
                      <option>Repeat 10 vs. Optimal</option>
                      <option>Repeat 20 vs. Optimal</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Students
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Specify preference ordering and payoffs for each possible
              matching. CSV uploads coming in subsequent version.
            </p>
          </div>
          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              {numStudents > 0 && numSchools > 0 ? (
                Array.from({ length: numStudents }, (_, i) => i).map(
                  (student, i) => {
                    return (
                      <>
                        <p className="text-md mb-2 font-medium leading-6 text-gray-700 mt-2">{`Student #${i + 1}`}</p>
                        {Array.from({ length: numSchools }, (_, i) => i).map(
                          (school, j) => {
                            return (
                              <div
                                key={j}
                                className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
                              >
                                <div className="sm:col-span-2">
                                  <label className="block text-sm font-medium leading-6 text-gray-900">
                                    School Number
                                  </label>
                                  <div className="mt-2">
                                    <input
                                      type="number"
                                      disabled
                                      value={j + 1}
                                      className="block w-full rounded-md border-0 py-1.5 pl-2.5 mb-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-100"
                                    />
                                  </div>
                                </div>

                                <div className="sm:col-span-2">
                                  <label
                                    htmlFor="pref-rank"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                  >
                                    Preference Rank
                                  </label>
                                  <div className="mt-2">
                                    <input
                                      type="number"
                                      name={`students[${i}][${j}][rank]`}
                                      id="pref-rank"
                                      min={1}
                                      disabled={disable}
                                      max={numSchools}
                                      defaultValue={
                                        condition?.students[i]?.truthful_preferences[j]?.rank
                                      }
                                      className="block w-full rounded-md border-0 py-1.5 mb-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div>
                                <div className="sm:col-span-2">
                                  <label
                                    htmlFor="payoff"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                  >
                                    Payoff
                                  </label>
                                  <div className="mt-2">
                                    <input
                                      type="number"
                                      name={`students[${i}][${j}][payoff]`}
                                      defaultValue={
                                        condition?.students[i]?.truthful_preferences[j]?.payoff
                                      }
                                      id="payoff"
                                      disabled={disable}
                                      min={0}
                                      className="block w-full rounded-md border-0 py-1.5 mb-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </>
                    );
                  },
                )
              ) : (
                <p className="text-sm leading-6 text-gray-600">
                  Please specify a non-zero number of students and schools
                  first.
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Schools
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Specify the name of each school, the capacity, the quality, and
              its list of district students. Experimental design follows the
              general model established by <em>Chen and Sonmez (2006)</em>.
            </p>
          </div>

          <form
            className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            onSubmit={buildCondition}
          >
            <div className="px-4 py-6 sm:p-8">
              {numStudents > 0 && numSchools > 0 ? (
                Array.from({ length: numSchools }, (_, i) => i).map(
                  (school, i) => {
                    return (
                      <>
                        <p className="text-md mb-2 font-medium leading-6 text-gray-700 mt-2">{`School #${i + 1}`}</p>
                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Name
                            </label>
                            <div className="mt-2">
                              <input
                                type="text"
                                disabled={disable}
                                name={`schools[${i}][name]`}
                                defaultValue={condition?.schools[i]?.name}
                                className="block w-full rounded-md border-0 py-1.5 pl-2.5 mb-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor="capacity"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Capacity
                            </label>
                            <div className="mt-2">
                              <input
                                type="number"
                                name={`schools[${i}][capacity]`}
                                id="capacity"
                                defaultValue={condition?.schools[i]?.capacity}
                                min={1}
                                disabled={disable}
                                max={numStudents}
                                className="block w-full rounded-md border-0 py-1.5 mb-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="quality"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              School Quality
                            </label>
                            <div className="mt-2">
                              <select
                                id="quality"
                                name={`schools[${i}][quality]`}
                                disabled={disable}
                                defaultValue={condition?.schools[i]?.quality}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor="district_students"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              District Students
                            </label>
                            <MultiSelectDropdown
                              formFieldName={`schools[${i}][district_students]`}
                              options={Array.from(
                                { length: numStudents },
                                (_, index) => index + 1,
                              )}
                              onChange={(selectedCountries: string) => {
                                console.debug(
                                  "selectedCountries",
                                  selectedCountries,
                                );
                              }}
                              prompt="Select students"
                              disabled={disable}
                            />
                          </div>
                        </div>
                      </>
                    );
                  },
                )
              ) : (
                <p className="text-sm leading-6 text-gray-600">
                  Please specify a non-zero number of students and schools
                  first.
                </p>
              )}
            </div>
            {!disable && (
              <div className="flex items-center bg-gray-100 justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 mt-2.5 sm:px-8">
                <Link
                  href="/experiments/[id]"
                  as={`/experiments/${experiment_id}`}
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
