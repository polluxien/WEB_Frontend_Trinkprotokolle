import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ProtokollResource } from "../Resources";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import "bootstrap/dist/css/bootstrap.min.css";
import { useLoginContext } from "../backend/LoginInfo";
import { CardBody } from "react-bootstrap";
import { createProtokoll } from "../backend/api";

export default function PageNewEintrag() {
  const navigate = useNavigate();
  const { loginInfo } = useLoginContext();
  const [closed, setClosed] = useState<boolean | undefined>(undefined);

  const refPatient = React.useRef<HTMLInputElement>(null);
  const refDatum = React.useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const myProtokoll = {
      patient: refPatient.current!.value,
      datum: refDatum.current!.value,
      closed: closed,
      ersteller: loginInfo ? loginInfo.id : null,
    } as ProtokollResource;

    try {
      await createProtokoll(myProtokoll);
      navigate(`/`);
    } catch (err) {
      console.error("Fehler beim Erstellen des Protokolls:", err);
    }
  }

  const handleClosedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClosed(e.target.value === "true");
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>Neues Protokoll Erstellen</Card.Header>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="FormDemo">
              <p>
                <label>
                  Patient:{" "}
                  <input
                    type="text"
                    id="patient"
                    ref={refPatient}
                    minLength={3}
                    maxLength={50}
                    required
                  />
                </label>
              </p>
              <p>
                <label>
                  Datum: {"  "}
                  <input type="date" id="datum" ref={refDatum} required />
                </label>
              </p>
              <p>
                <Form.Check
                  type="radio"
                  label="Privat"
                  name="closed"
                  value="true"
                  onChange={handleClosedChange}
                />
                <Form.Check
                  type="radio"
                  label="Öffentlich"
                  name="closed"
                  value="false"
                  onChange={handleClosedChange}
                />
              </p>
              <Button variant="primary" type="submit">
                Speichern
              </Button>
              <Button
                variant="secondary"
                className="ms-2"
                onClick={() => navigate(`/`)}
              >
                Abbrechen
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
