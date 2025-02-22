"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { useParams, useRouter } from "next/navigation";

export default function History() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/history/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setHistory(data);
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Change History</h1>
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
                  <TableCell>Date</TableCell>
                  <TableCell>Content</TableCell>
                </TableRow>
                {history.map((entry: any) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{entry.content.slice(0, 100)}...</TableCell>
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
