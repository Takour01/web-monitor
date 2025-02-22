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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { toast } from "@/components/ui/toast";

export default function Dashboard() {
  const [urls, setUrls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [newEvery, setNewEvery] = useState(60); // Default: 1 hour
  const [newAt, setNewAt] = useState(0); // Default: start of the hour
  useEffect(() => {
    fetch("/api/urls")
      .then((res) => res.json())
      .then((data) => {
        setUrls(data);
        setLoading(false);
      });
  }, []);

  const handleAddUrl = async () => {
    if (!newUrl) return;
    const res = await fetch("/api/urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: newUrl }),
    });
    const data = await res.json();
    if (data.message) {
      setUrls([
        ...urls,
        { id: Date.now(), url: newUrl, createdAt: new Date() },
      ]);
      setNewUrl("");
      toast.success("URL added successfully");
    } else {
      toast.error("Failed to add URL");
    }
  };

  const handleDeleteUrl = async (id: any) => {
    const res = await fetch("/api/urls", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.message) {
      setUrls(urls.filter((url: any) => url.id !== id));
      toast.success("URL deleted successfully");
    } else {
      toast("Failed to delete URL");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center">Web Content Monitor</h1>
      <Card className="mt-4 shadow-md p-4">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Monitored URLs</h2>
          <div className="flex gap-2">
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Enter URL..."
              className="w-80"
            />
            <Select onValueChange={(value) => setNewEvery(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Every" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Every 1 min</SelectItem>
                <SelectItem value="30">Every 30 min</SelectItem>
                <SelectItem value="60">Every 1 hour</SelectItem>
                <SelectItem value="180">Every 3 hours</SelectItem>
                <SelectItem value="1440">Every day</SelectItem>
                <SelectItem value="2880">Every 2 day</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setNewAt(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="At" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">At 00 min</SelectItem>
                <SelectItem value="15">At 15 min</SelectItem>
                <SelectItem value="30">At 30 min</SelectItem>
                <SelectItem value="45">At 45 min</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleAddUrl}
              className="bg-blue-500 hover:bg-blue-600"
            >
              + Add URL data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center">Loading URLs...</p>
          ) : (
            <Table className="w-full border rounded-md">
              <TableBody>
                <TableRow className="bg-gray-100 w-full ">
                  <TableCell className="font-semibold">URL</TableCell>
                  <TableCell className="font-semibold">Created at</TableCell>
                  <TableCell className="font-semibold">Actions</TableCell>
                </TableRow>
                {urls.map((url: any) => (
                  <TableRow key={url.id} className="hover:bg-gray-50">
                    <TableCell>{url.url}</TableCell>
                    <TableCell>
                      {new Date(url.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="flex gap-3">
                      <Button
                        onClick={() => handleDeleteUrl(url.id)}
                        variant="destructive"
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </Button>
                      <Link href={"/summaries/" + url.id}>
                        <Button
                          onClick={() => handleDeleteUrl(url.id)}
                          variant="destructive"
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Go To Summary
                        </Button>
                      </Link>
                      <Link href={"/history/" + url.id}>
                        <Button
                          onClick={() => handleDeleteUrl(url.id)}
                          variant="destructive"
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Go To history
                        </Button>
                      </Link>
                    </TableCell>
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
