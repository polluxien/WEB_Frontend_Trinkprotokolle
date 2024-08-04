import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EintragResource, ProtokollResource } from "../Resources";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import "bootstrap/dist/css/bootstrap.min.css";
import { useLoginContext } from "../backend/LoginInfo";
import { CardBody } from "react-bootstrap";
import { createEintrag } from "../backend/api";

export default function PageNewEintrag() {
  const navigate = useNavigate();
  const { loginInfo } = useLoginContext();
  const protoID = useParams<{ protoID: string }>();

  const refGetraenk = React.useRef<HTMLInputElement>(null);
  const refMenge = React.useRef<HTMLInputElement>(null);
  const refKommentar = React.useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!protoID) {
      console.error("Fehler: protoID ist nicht definiert.");
      return;
    }
    const myEintrag = {
      getraenk: refGetraenk.current!.value,
      menge: parseInt(refMenge.current!.value, 10),
      protokoll: protoID,
      ersteller: loginInfo ? loginInfo!.id : null,
    } as EintragResource;

    if (refKommentar.current && refKommentar.current.value !== "") {
      myEintrag.kommentar = refKommentar.current.value;
    }
    
    console.log("Sende Eintrag:", myEintrag);
    try {
      await createEintrag(myEintrag);
      navigate(`/protokoll/${protoID}`);
    } catch (err) {
      console.error("Fehler beim Erstellen des Eintrags:", err);
    }
  }

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>Neuen Eintrag Erstellen</Card.Header>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="FormDemo">
              <p>
                <label>
                  Getränk:{" "}
                  <input
                    type="text"
                    id="patient"
                    ref={refGetraenk}
                    minLength={3}
                    maxLength={50}
                    required
                  />
                </label>
              </p>
              <p>
                <label>
                  Menge:{" "}
                  <input
                    type="number"
                    id="patient"
                    ref={refMenge}
                    min={1}
                    max={10000}
                    required
                  />
                </label>
              </p>
              <p>
                <label>
                  Kommentar:{" "}
                  <textarea
                    id="kommentar"
                    ref={refKommentar}
                    maxLength={1000}
                    rows={5}
                    className="form-control"
                  />
                </label>
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
