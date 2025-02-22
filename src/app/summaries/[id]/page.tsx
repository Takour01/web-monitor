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

export default function Summaries() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (id) {
      fetch(`/api/summaries/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setSummaries(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">AI-Generated Summaries</h1>
      <Card className="mt-4">
        <CardHeader>
          <h2 className="text-lg font-semibold">Summaries for Monitored URL</h2>
          <Button onClick={() => router.push("/dashboard")} className="ml-auto">
            Back to Dashboard
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center">Loading summaries...</p>
          ) : summaries.length === 0 ? (
            <p className="text-center">No summaries available.</p>
          ) : (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Date</TableCell>
                  <TableCell className="font-semibold">AI Summary</TableCell>
                </TableRow>
                {summaries.map((summary: any) => (
                  <TableRow key={summary.id}>
                    <TableCell>
                      {new Date(summary.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{summary.summary}</TableCell>
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
