import { useEffect, useMemo, useState } from "react";
import { fetchStatus } from "../lib/fetchStatus";
import StatusHeader from "./StatusHeader";
import ServicesTable from "./ServicesTable";
import IncidentFeed from "./IncidentFeed";
import Loading from "./Loading";
import { parseRegion } from "../lib/parseRegion";
import type { Service } from "../types/status";

const PAGE_SIZE = 10;
const POLL_INTERVAL = 60_000;

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  /* ---------------- Fetch + Poll ---------------- */

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetchStatus();
        if (mounted) setData(res);
      } catch {
        if (mounted) setError("Failed to load status data");
      }
    };

    load();
    const interval = setInterval(load, POLL_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  /* ---------------- Derived Data ---------------- */

  const services: Service[] = useMemo(() => {
    if (!data?.services) return [];

    return data.services.map((s: any) => ({
      ...s,
      region: parseRegion(s.name),
    }));
  }, [data]);

  const filteredServices = useMemo(() => {
    return services.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [services, query]);

  const totalPages = Math.ceil(filteredServices.length / PAGE_SIZE);

  const paginatedServices = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredServices.slice(start, start + PAGE_SIZE);
  }, [filteredServices, page]);

  /* ---------------- Guards ---------------- */

  if (error) return <p>{error}</p>;
  if (!data) return <Loading />;

  /* ---------------- UI ---------------- */

  const smoothScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="dashboard">
      <StatusHeader overall={data.overall} updatedAt={data.updatedAt} />

      {/* SERVICES PANEL — STABLE CONTAINER */}
      <section className="panel services-panel">
        <input
          className="search-input"
          placeholder="Search services..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />

        <ServicesTable services={paginatedServices} />

        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => {
              setPage((p) => p - 1);
              smoothScrollTop();
            }}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => {
              setPage((p) => p + 1);
              smoothScrollTop();
            }}
          >
            Next
          </button>
        </div>

        <p className="last-updated">
          Auto-refresh every 60s • Last update{" "}
          {new Date(data.updatedAt).toLocaleTimeString()}
        </p>
      </section>

      {/* INCIDENTS PANEL */}
      <IncidentFeed incidents={data.incidents} />
    </div>
  );
};

export default Dashboard;






// import { useEffect, useMemo, useState } from "react";
// import { fetchStatus } from "../lib/fetchStatus";
// import StatusHeader from "./StatusHeader";
// import ServicesTable from "./ServicesTable";
// import IncidentFeed from "./IncidentFeed";
// import Loading from "./Loading";
// import { parseRegion } from "../lib/parseRegion";
// import type { Service } from "../types/status";

// const PAGE_SIZE = 10;
// const POLL_INTERVAL = 60_000; // 60 seconds

// const Dashboard = () => {
//   const [data, setData] = useState<any>(null);
//   const [error, setError] = useState("");
//   const [query, setQuery] = useState("");
//   const [page, setPage] = useState(1);

//   /* ---------------- Fetch + Poll ---------------- */

//   useEffect(() => {
//     let mounted = true;

//     const load = async () => {
//       try {
//         const res = await fetchStatus();
//         if (mounted) setData(res);
//       } catch {
//         if (mounted) setError("Failed to load status data");
//       }
//     };

//     load();
//     const interval = setInterval(load, POLL_INTERVAL);

//     return () => {
//       mounted = false;
//       clearInterval(interval);
//     };
//   }, []);

//   /* ---------------- Derived Data ---------------- */

//   const services: Service[] = useMemo(() => {
//     if (!data?.services) return [];

//     return data.services.map((s: any) => ({
//       ...s,
//       region: parseRegion(s.name),
//     }));
//   }, [data]);

//   const filteredServices = useMemo(() => {
//     return services.filter((s) =>
//       s.name.toLowerCase().includes(query.toLowerCase())
//     );
//   }, [services, query]);

//   const totalPages = Math.ceil(filteredServices.length / PAGE_SIZE);

//   const paginatedServices = useMemo(() => {
//     const start = (page - 1) * PAGE_SIZE;
//     return filteredServices.slice(start, start + PAGE_SIZE);
//   }, [filteredServices, page]);

//   /* ---------------- Render Guards ---------------- */

//   if (error) return <p>{error}</p>;
//   if (!data) return <Loading />;

//   /* ---------------- UI ---------------- */

//   return (
//     <div className="dashboard">
//       {/* HEADER (spans both columns) */}
//       <StatusHeader
//         overall={data.overall}
//         updatedAt={data.updatedAt}
//       />

//       {/* LEFT COLUMN */}
//       <div className="dashboard-main">
//         {/* SEARCH */}
//         <input
//           className="search-input"
//           placeholder="Search services..."
//           value={query}
//           onChange={(e) => {
//             setQuery(e.target.value);
//             setPage(1); // reset pagination on search
//           }}
//         />

//         <ServicesTable services={paginatedServices} />

//         {/* PAGINATION */}
//         <div className="pagination">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage((p) => p - 1)}
//           >
//             Prev
//           </button>

//           <span>
//             Page {page} of {totalPages}
//           </span>

//           <button
//             disabled={page === totalPages}
//             onClick={() => setPage((p) => p + 1)}
//           >
//             Next
//           </button>
//         </div>

//         <p className="last-updated">
//           Auto-refresh every 60s • Last update{" "}
//           {new Date(data.updatedAt).toLocaleTimeString()}
//         </p>
//       </div>

//       {/* RIGHT COLUMN */}
//       <div className="dashboard-side">
//         <IncidentFeed incidents={data.incidents} />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;