import {
  EintragResource,
  LoginResource,
  ProtokollResource,
} from "../Resources";
import { fetchWithErrorHandling } from "./fetchWithErrorHandling";
import { eintraege, protokolle } from "./testdata";

// Simulated delay for mock data
const simulateDelay = async (ms: number) =>
  new Promise((r) => setTimeout(r, ms));

export async function getAlleProtokolle(): Promise<ProtokollResource[]> {
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    await new Promise((r) => setTimeout(r, 700));
    return Promise.resolve(protokolle);
  } else {
    const response = await fetchWithErrorHandling(
      process.env.REACT_APP_API_SERVER_URL + "/api/protokoll/alle",
      { credentials: "include" as RequestCredentials }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("kein Zugriff auf Backend");
    }
    return response.json();
  }
}

export async function getAlleEintraege(
  protokollId: string
): Promise<EintragResource[]> {
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    await new Promise((r) => setTimeout(r, 700));
    return Promise.resolve(eintraege);
  } else {
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/eintrag/protokoll/${protokollId}`,
      { credentials: "include" as RequestCredentials }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("kein Zugriff auf Backend");
    }
    return response.json();
  }
}

export async function getProtokoll(
  protokollId: string
): Promise<ProtokollResource> {
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    await new Promise((r) => setTimeout(r, 700));
    const protokoll = protokolle.find((proto) => proto.id === protokollId);
    if (!protokoll) {
      throw new Error(
        "Protokoll mit entsprechender Id konnte nicht gefunden werden"
      );
    }
    return Promise.resolve(protokoll);
  } else {
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protokollId}`,
      { credentials: "include" as RequestCredentials }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("kein Zugriff auf das Protokoll :/");
    }
    return response.json();
  }
}

export async function deleteProtokoll(
  protokollId: string
){
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    await new Promise((r) => setTimeout(r, 700));
    const protokoll = protokolle.find((proto) => proto.id === protokollId);
    if (!protokoll) {
      throw new Error(
        "Protokoll mit entsprechender Id konnte nicht gefunden werden"
      );
    }
    return Promise.resolve(protokoll);
  } else {
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protokollId}`,
      { method: "DELETE", credentials: "include" as RequestCredentials }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("kein Zugriff auf das Protokoll :/");
    }
    return;
  }
}

export async function updateProtokoll(
  protoResource: ProtokollResource,
  protokollId: string
): Promise<ProtokollResource> {
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    await new Promise((r) => setTimeout(r, 700));
    const protokoll = protokolle.find((proto) => proto.id === protokollId);
    if (!protokoll) {
      throw new Error(
        "Protokoll mit entsprechender Id konnte nicht gefunden werden"
      );
    }
    return Promise.resolve(protokoll);
  } else {
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protokollId}`,
      {
        method: "PUT",
        credentials: "include" as RequestCredentials,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(protoResource),
      }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("kein Zugriff auf das Protokoll :/");
    }
    console.log("Erfolgreich Proto upgedated");
    return response.json();
  }
}

export async function createProtokoll(
  protoResource: ProtokollResource
){
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
   //funktioniert nicht ohne backend
  } else {
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/`,
      {
        method: "POST",
        credentials: "include" as RequestCredentials,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(protoResource),
      }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("kein Zugriff");
    }
    console.log("Erfolgreich Proto erstellt");
    return;
  }
}

export async function getEintrag(eintragId: string): Promise<EintragResource> {
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    await new Promise((r) => setTimeout(r, 700));
    const eintrag = eintraege.find((ein) => ein.id === eintragId);
    if (!eintrag) {
      throw new Error(
        "Eintrag mit entsprechender Id konnte nicht gefunden werden"
      );
    }
    return Promise.resolve(eintrag);
  } else {
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/eintrag/${eintragId}`,
      { credentials: "include" as RequestCredentials }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("Kein ZUgriff auf das Protokoll :/");
    }
    return response.json();
  }
}

export async function deleteEintrag(
  eintragID: string
): Promise<ProtokollResource> {
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    await new Promise((r) => setTimeout(r, 700));
    const protokoll = protokolle.find((proto) => proto.id === eintragID);
    if (!protokoll) {
      throw new Error(
        "Protokoll mit entsprechender Id konnte nicht gefunden werden"
      );
    }
    return Promise.resolve(protokoll);
  } else {
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/eintrag/${eintragID}`,
      { method: "DELETE", credentials: "include" as RequestCredentials }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("kein Zugriff auf den Eintrag :/");
    }
    return response.json();
  }
}

export async function postLogin(name: string, password: string) {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/api/login`;

  const response = await fetchWithErrorHandling(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include" as RequestCredentials,
    body: JSON.stringify({ name, password }),
  });
  console.log(`Response status: ${response.status}`);
  if (response.ok) {
    const loginInfo: LoginResource = await response.json();
    return loginInfo;
  }
  if (response.status === 401) {
    throw new Error("Invalid credentials");
  }
  throw new Error(
    `Error connecting to ${process.env.REACT_APP_API_SERVER_URL}: ${response.statusText}`
  );
}

export async function getLogin() {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/api/login`;

  const response = await fetchWithErrorHandling(url, {
    method: "GET",
    credentials: "include" as RequestCredentials,
  });
  if (response.ok) {
    const loginInfo: LoginResource | false = await response.json();
    return loginInfo;
  }
  if (response.status === 401) {
    throw new Error("Invalid credentials");
  }
  throw new Error(
    `Error connecting to ${process.env.REACT_APP_API_SERVER_URL}: ${response.statusText}`
  );
}

export async function deleteLogin(): Promise<void> {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/api/login`;
  const response = await fetchWithErrorHandling(url, {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) {
    return;
  }
  throw new Error(`Error logging out, status: ${response.status}`);
}
