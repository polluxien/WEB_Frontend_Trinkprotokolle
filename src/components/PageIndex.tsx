import { Link } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

import "bootstrap/dist/css/bootstrap.min.css";
import { getAlleProtokolle, getLogin } from "../backend/api";
import { useEffect, useState } from "react";
import { ProtokollResource } from "../Resources";
import { useLoginContext } from "../backend/LoginInfo";

export default function PageIndex() {
  const [protokolle, setProtokolle] = useState<ProtokollResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { loginInfo } = useLoginContext();

  async function load() {
    setError("");
    setLoading(true);

    try {
      const alleProtokolle = await getAlleProtokolle();
      setProtokolle(alleProtokolle!);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [loginInfo]);

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
      <h1>
        Alle Protokolle <Badge bg="secondary">{protokolle.length}</Badge>
      </h1>
      <div className="row">
        {protokolle.map((protokoll) => (
          <div key={protokoll.id} className="col-12 mb-3">
            <Card>
              <Card.Header>{protokoll.patient}</Card.Header>
              <Card.Body>
                <Card.Text>
                  <strong>Gesammte Menge:</strong> {protokoll.gesamtMenge}
                </Card.Text>
                <Card.Text>
                  <strong>Ersteller:</strong> {protokoll.erstellerName}
                </Card.Text>
                <Card.Text>
                  <strong>Erstellt am:</strong> {protokoll.datum}
                </Card.Text>
                {protokoll.updatedAt && (
                  <Card.Text>
                    <strong>Zuletzt geändert:</strong> {protokoll.updatedAt}
                  </Card.Text>
                )}
                <hr></hr>
                <Link
                  to={`/protokoll/${protokoll.id}`}
                  className="btn btn-primary btn-sm"
                >
                  Zur Detailansicht
                </Link>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
