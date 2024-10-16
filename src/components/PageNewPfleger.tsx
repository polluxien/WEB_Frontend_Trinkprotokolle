import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";

import "bootstrap/dist/css/bootstrap.min.css";
import { PflegerResource } from "../Resources";
import { useLoginContext } from "../backend/LoginInfo";
import { createPfleger, getAllePfleger, updatePfleger } from "../backend/api";
import { dateToString, stringToDate } from "../Helper/DateHelper";
import { DeleteDialog } from "./DeleteDialog";
import Card from "react-bootstrap/esm/Card";

enum Gender {
  KeineAngabe = "Keine Angabe",
  Maennlich = "Männlich",
  Weiblich = "Weiblich",
  Divers = "Divers",
}

export default function PageNewPfleger() {
  const navigate = useNavigate();
  const { loginInfo } = useLoginContext();
  const [validated, setValidated] = useState(false);

  // Ersteller Variablen
  const refName = useRef<HTMLInputElement>(null);
  const [admin, setAdmin] = useState<boolean>(false);
  const [gender, setGender] = useState<Gender>(Gender.KeineAngabe); // Verwende das Gender-Enum
  const refBirth = useRef<HTMLInputElement>(null);
  const refAdress = useRef<HTMLInputElement>(null);
  const refPosition = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }


    const myPfleger: PflegerResource = {
      password: "mnkjn",
      name: refName.current!.value,
      admin,
      gender,
      birth: refBirth.current!.value,
      adress: refAdress.current!.value,
      position: refPosition.current!.value,
    };

    try {
      await createPfleger(myPfleger);
      navigate(`/admin`);
      navigate(0);
    } catch (err) {
      console.error("Fehler beim Aktualisieren des Protokolls:", err);
    }
  }

  const formatDate = (date: string) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Card>
          <Card.Header>Neuen Pfleger Erstellen</Card.Header>
          <Card.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Max Mustermann"
                  minLength={3}
                  maxLength={50}
                  required
                  ref={refName}
                />
                <Form.Control.Feedback type="invalid">
                  Bitte geben Sie einen gültigen Pflegernamen ein (3-50
                  Zeichen).
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="gender">
                <Form.Label>Geschlecht</Form.Label>
                <Form.Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                >
                  {Object.values(Gender).map((genderOption) => (
                    <option key={genderOption} value={genderOption}>
                      {genderOption}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="datum">
                <Form.Label>Geburtsdatum</Form.Label>
                <Form.Control
                  type="date"
                  ref={refBirth}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Bitte geben Sie ein gültiges Datum ein.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="adress">
                <Form.Label>Adresse</Form.Label>
                <Form.Control
                  type="text"
                  minLength={3}
                  maxLength={100}
                  required
                  ref={refAdress}
                />
                <Form.Control.Feedback type="invalid">
                  Bitte geben Sie eine gültige Adresse ein (3-100 Zeichen).
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="position">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  type="text"
                  minLength={3}
                  maxLength={100}
                  required
                  ref={refPosition}
                />
                <Form.Control.Feedback type="invalid">
                  Bitte geben Sie eine gültige Position ein (3-100 Zeichen).
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="admin">
                <Form.Check
                  type="checkbox"
                  label="Admin"
                  checked={admin}
                  onChange={(e) => setAdmin(e.target.checked)}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
              Speichern
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate(`/admin`)}
            >
              Abbrechen
            </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
