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

const everyData = [
  { value: 1, label: "Every 1 min" },
  { value: 30, label: "Every 30 min" },
  { value: 60, label: "Every 1 hour" },
  { value: 180, label: "Every 3 hours" },
  { value: 1440, label: "Every day" },
  { value: 2880, label: "Every 2 days" },
];
const atDataMinits = [
  { value: 0, label: "At 00 min" },
  { value: 15, label: "At 15 min" },
  { value: 30, label: "At 30 min" },
  { value: 45, label: "At 45 min" },
];
const atDataHours = [
  { value: 0, label: "At 00 hours" },
  { value: 1, label: "At 1 hours" },
  { value: 2, label: "At 2 hours" },
  { value: 3, label: "At 3 hours" },
  { value: 4, label: "At 4 hours" },
  { value: 5, label: "At 5 hours" },
  { value: 6, label: "At 6 hours" },
  { value: 7, label: "At 7 hours" },
  { value: 8, label: "At 8 hours" },
  { value: 9, label: "At 9 hours" },
  { value: 10, label: "At 10 hours" },
  { value: 11, label: "At 11 hours" },
  { value: 12, label: "At 12 hours" },
  { value: 13, label: "At 13 hours" },
  { value: 14, label: "At 14 hours" },
  { value: 15, label: "At 15 hours" },
  { value: 16, label: "At 16 hours" },
  { value: 17, label: "At 17 hours" },
  { value: 18, label: "At 18 hours" },
  { value: 19, label: "At 19 hours" },
  { value: 20, label: "At 20 hours" },
  { value: 21, label: "At 21 hours" },
  { value: 22, label: "At 22 hours" },
  { value: 23, label: "At 23 hours" },
];

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
      body: JSON.stringify({ url: newUrl, at: newAt, every: newEvery }),
    });
    const data = await res.json();
    if (data.message) {
      console.log(data);
      setUrls([...urls, data.url[0]]);
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
                {everyData.map((every) => {
                  return (
                    <SelectItem value={every.value + ""} key={every.label}>
                      {every.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setNewAt(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="At" />
              </SelectTrigger>
              <SelectContent>
                {newEvery >= 1440
                  ? atDataHours.map((every) => {
                      return (
                        <SelectItem value={every.value + ""} key={every.label}>
                          {every.label}
                        </SelectItem>
                      );
                    })
                  : atDataMinits.map((every) => {
                      return (
                        <SelectItem value={every.value + ""} key={every.label}>
                          {every.label}
                        </SelectItem>
                      );
                    })}
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
                  <TableCell className="font-semibold">interval</TableCell>
                  <TableCell className="font-semibold">Actions</TableCell>
                </TableRow>
                {urls.map((url: any) => (
                  <TableRow key={url.id} className="hover:bg-gray-50">
                    <TableCell>{url.url}</TableCell>
                    <TableCell>
                      {new Date(url.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {
                        everyData.find((every) => every.value === url.every)
                          ?.label
                      }{" "}
                      {url.every > 60
                        ? url.every >= 1440
                          ? atDataHours.find((at) => at.value === url.at)?.label
                          : atDataMinits.find((at) => at.value === url.at)
                              ?.label
                        : ""}
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
                          variant="destructive"
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Go To Summary
                        </Button>
                      </Link>
                      <Link href={"/history/" + url.id}>
                        <Button
                          variant="destructive"
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Go To history
                        </Button>
                      </Link>
                      <Link href={"/logs/" + url.id}>
                        <Button
                          variant="destructive"
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Go To logs
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
