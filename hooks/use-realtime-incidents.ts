"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";

export interface RealtimeIncident {
  id: string;
  student_id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "reported" | "acknowledged" | "responding" | "resolved";
  location: string;
  description: string;
  symptoms: string[];
  reported_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
  response_notes?: string;
}

type ChangeCallback = (
  event: "INSERT" | "UPDATE" | "DELETE",
  incident: RealtimeIncident
) => void;

/**
 * Subscribe to realtime incident changes.
 * Returns a cleanup function.
 */
export function useRealtimeIncidents(onIncidentChange: ChangeCallback) {
  React.useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("incidents-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "incidents",
        },
        (payload) => {
          const event = payload.eventType as "INSERT" | "UPDATE" | "DELETE";
          const incident = (payload.new || payload.old) as RealtimeIncident;
          onIncidentChange(event, incident);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onIncidentChange]);
}

/**
 * Hook that maintains a live list of incidents, auto-refreshing on changes.
 * `initialIncidents` should be fetched server-side and passed in.
 */
export function useLiveIncidents(
  initialIncidents: RealtimeIncident[],
  onNewIncident?: (incident: RealtimeIncident) => void
) {
  const [incidents, setIncidents] = React.useState(initialIncidents);

  const handleChange = React.useCallback(
    (event: "INSERT" | "UPDATE" | "DELETE", incident: RealtimeIncident) => {
      setIncidents((prev) => {
        if (event === "INSERT") {
          if (onNewIncident) onNewIncident(incident);
          return [incident, ...prev];
        }
        if (event === "UPDATE") {
          return prev.map((i) => (i.id === incident.id ? incident : i));
        }
        if (event === "DELETE") {
          return prev.filter((i) => i.id !== incident.id);
        }
        return prev;
      });
    },
    [onNewIncident]
  );

  useRealtimeIncidents(handleChange);

  return incidents;
}
