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
import { getAllePfleger, updatePfleger } from "../backend/api";
import { dateToString, stringToDate } from "../Helper/DateHelper";
import { DeleteDialog } from "./DeleteDialog";

enum Gender {
  KeineAngabe = "Keine Angabe",
  Maennlich = "Männlich",
  Weiblich = "Weiblich",
  Divers = "Divers",
}

export default function PageAdmin() {
  const params = useParams();
  const navigate = useNavigate();
  const [bearbeitterPflegerID, setbearbeitterPflegerID] = useState<
    string | undefined
  >(undefined);
  const [pfleger, setPfleger] = useState<PflegerResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const { loginInfo } = useLoginContext();
  const [validated, setValidated] = useState(false);

  // Editing Variablen
  const refName = useRef<HTMLInputElement>(null);
  const [admin, setAdmin] = useState<boolean>(false);
  const [gender, setGender] = useState<Gender>(Gender.KeineAngabe); // Verwende das Gender-Enum
  const refBirth = useRef<HTMLInputElement>(null);
  const refAdress = useRef<HTMLInputElement>(null);
  const refPosition = useRef<HTMLInputElement>(null);

  // Delete Dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function load() {
    setError("");
    setLoading(true);

    try {
      const allePfleger = await getAllePfleger();
      setPfleger(allePfleger!);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [loginInfo]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setValidated(true);

    const myPfleger: PflegerResource = {
      id: bearbeitterPflegerID!,
      name: refName.current!.value,
      admin,
      gender,
      birth: refBirth.current!.value,
      adress: refAdress.current!.value,
      position: refPosition.current!.value,
    };

    try {
      await updatePfleger(myPfleger, bearbeitterPflegerID!);
      setEditing(false);
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    console.log("Error detected:", error);
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>
          Pfleger verwalten <Badge bg="secondary">{pfleger.length}</Badge>
        </h1>
        <div className="ml-auto">
          <Link to={`/protokoll/neu`}>
            <Button variant="secondary" size="lg">
              Neues Protokoll
            </Button>
          </Link>
        </div>
      </div>
      <Accordion defaultActiveKey="0">
        {pfleger.map((pfle) => (
          <div key={pfle.id} className="col-12 mb-3">
            <Accordion.Item eventKey={pfle.id!}>
              <Accordion.Header>
                <div className="d-flex justify-content-between w-90">
                  {pfle.name}
                  {pfle.admin && (
                    <Badge bg="primary" className="ms-3">
                      Admin
                    </Badge>
                  )}
                </div>
              </Accordion.Header>
              {!editing ? (
                <Accordion.Body>
                  <p>
                    <strong>Position: </strong>
                    {pfle.position}
                  </p>
                  <hr></hr>
                  <p>
                    <strong>Geschlecht: </strong>
                    {pfle.gender}
                  </p>
                  <p>
                    <strong>Geburtsdatum: </strong>
                    {formatDate(pfle.birth)}
                  </p>
                  <p>
                    <strong>Adresse:</strong>
                    {pfle.adress}
                  </p>
                  <hr></hr>
                  <p>
                    <strong>Gesammte Menge an Protokollen:</strong>
                  </p>
                  <p>
                    <strong>Zuletzt bearbeitet:</strong>
                  </p>
                  {loginInfo && (
                    <div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          setbearbeitterPflegerID(pfle.id);
                          setEditing(true);
                        }}
                      >
                        Editieren
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setbearbeitterPflegerID(pfle.id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        Löschen
                      </Button>
                    </div>
                  )}
                </Accordion.Body>
              ) : (
                <Accordion.Body>
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                  >
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Max Mustermann"
                        minLength={3}
                        maxLength={50}
                        required
                        defaultValue={pfle.name}
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
                        defaultValue={pfle.gender}
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
                        defaultValue={formatDate(pfle.birth)}
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
                        defaultValue={pfle.adress}
                        ref={refAdress}
                      />
                      <Form.Control.Feedback type="invalid">
                        Bitte geben Sie eine gültige Adresse ein (3-100
                        Zeichen).
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="position">
                      <Form.Label>Position</Form.Label>
                      <Form.Control
                        type="text"
                        minLength={3}
                        maxLength={100}
                        required
                        defaultValue={pfle.position}
                        ref={refPosition}
                      />
                      <Form.Control.Feedback type="invalid">
                        Bitte geben Sie eine gültige Position ein (3-100
                        Zeichen).
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
                      onClick={() => setEditing(false)}
                    >
                      Abbrechen
                    </Button>
                  </Form>
                </Accordion.Body>
              )}
            </Accordion.Item>
          </div>
        ))}
      </Accordion>
      <DeleteDialog
        open={showDeleteDialog}
        deleteWhat="Pfleger"
        ID={bearbeitterPflegerID!}
        onHide={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
