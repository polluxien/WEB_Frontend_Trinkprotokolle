import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteProtokoll,
  getAlleEintraege,
  getProtokoll,
  postLogin,
  updateProtokoll,
} from "../backend/api";
import { EintragResource, ProtokollResource } from "../Resources";
import { DeleteDialog } from "./DeleteDialog";

import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import "bootstrap/dist/css/bootstrap.min.css";
import { useLoginContext } from "../backend/LoginInfo";
import { CardBody } from "react-bootstrap";

export default function PageProtokoll() {
  const params = useParams();
  const navigate = useNavigate();
  const protoID = params.protokollId;
  console.log(protoID);
  const [protokoll, setProtokoll] = useState<ProtokollResource>();
  const [eintraege, setEintraege] = useState<EintragResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const { loginInfo } = useLoginContext();

  // Editing Variablen
  const refPatient = React.useRef<HTMLInputElement>(null);
  const refDatum = React.useRef<HTMLInputElement>(null);
  const [closed, setClosed] = useState<boolean | undefined>(undefined);

  //Delete Dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function load() {
    try {
      console.log("Fetching Protokoll ID:", protoID);
      const proto = await getProtokoll(protoID!);
      setProtokoll(proto);
      const alleEintraege = await getAlleEintraege(protoID!);
      setEintraege(Array.isArray(alleEintraege) ? alleEintraege : []);
      setClosed(proto.closed);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [protoID]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const myProtokoll = {
      id: protoID,
      patient: refPatient.current!.value,
      datum: refDatum.current!.value,
      closed: closed !== undefined ? closed : protokoll!.closed,
    } as ProtokollResource;
    await updateProtokoll(myProtokoll, protoID!);
    setEditing(false);
    navigate(`/protokoll/${protoID}`);
  }

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const handleClosedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClosed(e.target.value === "true");
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
    <div key={protoID} className="container mt-4">
      {!editing ? (
        <Card>
          <Card.Header>{protokoll!.patient}</Card.Header>
          <Card.Body>
            <Card.Text>
              <strong>Gesammte Menge:</strong> {protokoll!.gesamtMenge}
            </Card.Text>
            <Card.Text>
              <strong>Ersteller:</strong> {protokoll!.erstellerName}
            </Card.Text>
            <Card.Text>
              <strong>Erstellt am:</strong> {protokoll!.datum}
            </Card.Text>
            {protokoll!.updatedAt && (
              <Card.Text>
                <strong>Zuletzt geändert:</strong> {protokoll!.updatedAt}
              </Card.Text>
            )}
            {loginInfo && protokoll!.ersteller === loginInfo.id && (
              <div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => setEditing(true)}
                >
                  {" "}
                  Editieren
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  {" "}
                  Löschen
                </Button>
              </div>
            )}
            <hr></hr>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>
                Einträge <Badge bg="secondary">{eintraege.length}</Badge>
              </h3>
              <div className="ml-auto">
                {loginInfo ? (
                  <Link
                    to={`/protokoll/${protoID}/eintrag/neu`}
                  >
                    <Button variant="secondary">Neuer Eintrag</Button>
                  </Link>
                ) : (
                  <Button variant="secondary" disabled>
                    Neuer Eintrag
                  </Button>
                )}
              </div>
            </div>
            <ul className="list-unstyled">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Getränk</th>
                    <th>Menge</th>
                    <th>Erstellt am</th>
                    <th>Kommentar</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {eintraege.map((eintrag, index) => (
                    <tr key={eintrag.id}>
                      <td>{index + 1}</td>
                      <td>{eintrag.getraenk}</td>
                      <td>{eintrag.menge}</td>
                      <td>{eintrag.createdAt}</td>
                      <td>{eintrag.kommentar ? eintrag.kommentar : ""}</td>
                      <td>
                        {loginInfo && loginInfo.id === protokoll!.ersteller ?
                        <Link to={`/eintrag/${eintrag.id}`}>
                          Details
                        </Link>
                         : "nicht eingeloggt"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ul>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Header>Bestehendes Protokoll Bearbeiten</Card.Header>
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
                      defaultValue={protokoll!.patient}
                      required
                    />
                  </label>
                </p>
                <p>
                  <label>
                    Datum: {"  "}
                    <input
                      type="date"
                      id="datum"
                      ref={refDatum}
                      defaultValue={formatDate(protokoll!.datum)}
                      required
                    />
                  </label>
                </p>
                <p>
                  <Form.Check
                    type="radio"
                    label="Privat"
                    name="closed"
                    value="true"
                    checked={closed === true}
                    onChange={handleClosedChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Öffentlich"
                    name="closed"
                    value="false"
                    checked={closed === false}
                    onChange={handleClosedChange}
                  />
                </p>
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
              </div>
            </form>
          </CardBody>
        </Card>
      )}
      <DeleteDialog
        open={showDeleteDialog}
        deleteWhat="Protokoll"
        ID={protoID!}
        onHide={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
