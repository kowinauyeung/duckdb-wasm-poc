import { useState, useEffect, useRef, useCallback } from "react";
import { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import { getDB } from "./duckdbEntry";
import { OPFSDemo } from "./components/OPFSDemo";
import "./App.css";

type Row = {
  id: string;
  name: string;
  email: string;
  age: number;
};

function App() {
  const connRef = useRef<AsyncDuckDBConnection | null>(null);
  const [ready, setReady] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);

  const addRow = useCallback(async () => {
    if (!ready || !connRef.current) return;
    await connRef.current.query(`
      INSERT INTO test
      VALUES ('${new Date().getUTCMilliseconds()}', 'kowin', 'kowin@gmail.com', 18);
    `);
    const result = await connRef.current.query(`
      SELECT *
      FROM test
    `);
    const dbRows = result.toArray().map((row) => {
      const parsedRow = JSON.parse(row);
      return parsedRow;
    });
    setRows(dbRows);
  }, [ready]);

  useEffect(() => {
    getDB().then(async (db) => {
      const conn = await db.connect();
      connRef.current = conn;
      await conn.query(`
        CREATE TABLE test (
          id VARCHAR,
          name VARCHAR,
          email VARCHAR,
          age INTEGER
        );
      `);
      setReady(true);
    });
    return () => {
      if (connRef.current) {
        connRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <div>
        <OPFSDemo />
      </div>
      <h1>DuckDB WASM POC</h1>
      <div className="card">
        {ready && <button onClick={addRow}>Add row</button>}
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>name</th>
              <th>email</th>
              <th>age</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
