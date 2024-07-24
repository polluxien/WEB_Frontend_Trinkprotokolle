import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAlleEintraege, getProtokoll } from "../backend/api";
import { EintragResource, ProtokollResource } from "../Resources";

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";

import "bootstrap/dist/css/bootstrap.min.css";

export default function PageProtokoll() {
  const params = useParams();
  const protoID = params.protokollId;
  console.log(protoID);
  const [protokoll, setProtokolle] = useState<ProtokollResource>();
  const [eintraege, setEintraege] = useState<EintragResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      console.log("Fetching Protokoll ID:", protoID);
      const proto = await getProtokoll(protoID!);
      setProtokolle(proto);
      const alleEintraege = await getAlleEintraege(protoID!);
      setEintraege(Array.isArray(alleEintraege) ? alleEintraege : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [protoID]);

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
    console.log(" Error detected:", error);
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-4">
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
          <hr></hr>
          <h3>Einträge:</h3>
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
                      <Link to={`/eintrag/${eintrag.id}`}>
                        Eintrag bearbeiten
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
}
