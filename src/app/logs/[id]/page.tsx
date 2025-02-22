"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ScrapeLogs() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/logs?urlId=${id}`)
        .then((res) => res.json())
        .then((data) => setLogs(data))
        .catch(() => console.error("Failed to fetch logs"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Scraping Job History</h1>
      <Card className="mt-4">
        <CardHeader>
          <h2 className="text-lg font-semibold">Content Change History</h2>
          <Button onClick={() => router.push("/dashboard")} className="ml-auto">
            Back to Dashboard
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading history...</p>
          ) : (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Run Time</TableCell>
                  <TableCell className="font-semibold">Status</TableCell>
                  <TableCell className="font-semibold">Error Message</TableCell>
                </TableRow>
                {logs.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {new Date(log.runTime).toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={
                        log.status === "Success"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {log.status}
                    </TableCell>
                    <TableCell>{log.errorMessage || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
