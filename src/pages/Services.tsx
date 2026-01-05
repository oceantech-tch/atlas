import { useEffect, useMemo, useState } from "react";
import type { Service, ComponentStatus } from "../types/status";
import ServicesTable from "../components/ServicesTable";
import "../styles/services.css";

const CLOUDFLARE_STATUS_URL =
  "https://www.cloudflarestatus.com/api/v2/components.json";

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(CLOUDFLARE_STATUS_URL);

        if (!res.ok) {
          throw new Error("Failed to fetch Cloudflare status data");
        }

        const json = await res.json();

        const mapped: Service[] = json.components.map((component: any) => {
          // Region is embedded in the name for most CF components
          const region = component.name.includes("-")
            ? component.name.split("-")[0].trim()
            : "Global";

          return {
            id: component.id,
            name: component.name,
            region,
            status: component.status as ComponentStatus,
            latency: 0,
            uptime: "—",
          };
        });

        setServices(mapped);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Cloudflare status fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [services, query]);

  const statusCounts = useMemo(() => {
    return filteredServices.reduce(
      (acc, s) => {
        acc[s.status]++;
        return acc;
      },
      {
        operational: 0,
        degraded_performance: 0,
        under_maintenance: 0,
        partial_outage: 0,
        major_outage: 0,
      }
    );
  }, [filteredServices]);

  if (loading) {
    return <div className="loading">Loading Cloudflare services…</div>;
  }

  return (
    <section>
      <h1 className="section-title">
        Services
        <span className="section-subtitle">
          Live Cloudflare infrastructure status
        </span>
      </h1>

      {/* SEARCH */}
      <input
        className="search-input"
        placeholder="Search services..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* STATUS BAR */}
      <div className="status-bar">
        <span className="status operational">
          Operational {statusCounts.operational}
        </span>

        <span className="status degraded">
          Degraded {statusCounts.degraded_performance}
        </span>

        <span className="status maintenance">
          Maintenance {statusCounts.under_maintenance}
        </span>

        <span className="status partial">
          Partial {statusCounts.partial_outage}
        </span>

        <span className="status major">
          Outage {statusCounts.major_outage}
        </span>
      </div>

      <ServicesTable services={filteredServices} />

      {lastUpdated && (
        <p className="last-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </section>
  );
};

export default Services;