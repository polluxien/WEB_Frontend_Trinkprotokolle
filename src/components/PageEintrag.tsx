import React, { useEffect, useState } from "react";
import { EintragResource } from "../Resources";
import { useParams } from "react-router-dom";
import { getEintrag } from "../backend/api";
import { LoadingIndicator } from "./LoadingIndicator";

import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import { CardBody } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useErrorBoundary } from "react-error-boundary";

export default function PageEintrag() {
  const params = useParams();
  const eintragID = params.eintragId;
  console.log(eintragID);
  const [eintrag, setEintrag] = useState<EintragResource>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  async function load() {
    try {
      const eintrag = await getEintrag(eintragID!);
      setEintrag(eintrag);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [eintragID]);

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

  if (!eintrag) {
    return <div>Eintrag nicht gefunden mit id: ${eintragID}</div>;
  }

  return (
    <div key={eintragID} className="container mt-4">
      <Card>
        <Card.Header>Eintrag vom {eintrag.createdAt!}</Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Getränk:</strong> {eintrag.getraenk}
          </Card.Text>
          <Card.Text>
            <strong>Menge:</strong> {eintrag.menge}
          </Card.Text>
          <Card.Text>
            <strong>Ersteller:</strong> {eintrag.erstellerName}
          </Card.Text>
          <Card.Text>
            <strong>Kommentar:</strong>{" "}
            {eintrag.kommentar ? (
              eintrag.kommentar
            ) : (
              <i>Noch kein Kommentar vorhanden</i>
            )}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
