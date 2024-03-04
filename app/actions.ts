"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// TODO: I don't know if this will work in production?
export async function fetchData(url: string) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const resp = fetch(`http://localhost:3000${url}`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(async (res) => {
    if (!res.ok) {
      const json = await res.json();
      const errorMessage = json.detail?.errors;
      if (res.status != 401) {
        throw new Error(errorMessage);
      } else {
        redirect(`/`);
      }
    } else {
      return res.json();
    }
  });
  return resp;
}

export async function createEditExperiment(
  url: string,
  method: string,
  id: string,
  formData: FormData,
) {
  const rawFormData = Object.fromEntries(formData.entries());
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  await fetch(`http://localhost:3000/${url}/${id}`, {
    method: method,
    body: JSON.stringify(rawFormData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
  if (method === "POST") {
    revalidatePath(`/experiments`);
    redirect(`/dashboard`);
  } else {
    revalidatePath(`/experiments/${id}`);
    redirect(`/experiments/${id}`);
  }
}

export async function saveParticipantData(
  formData: FormData,
) {
  const rawFormData = Object.fromEntries(formData.entries());
  console.log(rawFormData)
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  await fetch(`http://localhost:3000/api/public/participants`, {
    method: "POST",
    body: JSON.stringify(rawFormData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
    redirect(`/public/${rawFormData.condition_id}/${rawFormData.participant_id}/instructions`);
}
