import Navbar from "../LandingPage/Navbar";
import Footer from "../LandingPage/Footer";
import MembershipModal from "./MembershipModal";
import { useState, useEffect } from "react";
import { useMembershipModal } from "../../hooks/useMembershipModal";

const PAGE_SIZE = 20;
const BACKEND_URL  = import.meta.env.VITE_BACKEND_URL

export default function Members() {
    const { isModalOpen, openModal, closeModal, handleApplyNow } =
    useMembershipModal();

    const [pageMembers, setPageMembers] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [membershipQuery, setMembershipQuery] = useState("");
    const [nameQuery, setNameQuery] = useState("");
    const [page, setPage] = useState(1);


    const fetchMembers = async () => {
        try {

            const params = new URLSearchParams({
            page,
            limit: PAGE_SIZE,
            membership: membershipQuery,
            name: nameQuery,
            });

            const res = await fetch(`${BACKEND_URL}/members?${params.toString()}`);
            const data = await res.json();

            setPageMembers(data.data);
            setTotal(data.pagination.total);
            setTotalPages(data.pagination.totalPages);

        } catch (err) {
            console.error("Error fetching members:", err);
        } 
    };

    useEffect(() => {
    const delay = setTimeout(() => {
        fetchMembers();
    }, 500);

    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, membershipQuery, nameQuery]);


  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  const onChangeMembershipQuery = (e) => {
    setMembershipQuery(e.target.value);
    setPage(1);
  };

  const onChangeNameQuery = (e) => {
    setNameQuery(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setMembershipQuery("");
    setNameQuery("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-amber-50">
      <Navbar onBecomeMemberClick={openModal} />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-yellow-500">
            Directory
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Members of ADMA
          </h1>
          <p className="mt-2 text-gray-600">
            Search by membership number or name to quickly verify membership.
          </p>
        </header>

        <section className="rounded-3xl bg-white/90 p-5 shadow-lg ring-1 ring-black/5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-gray-800">
                  Membership number
                </span>
                <input
                  value={membershipQuery}
                  onChange={onChangeMembershipQuery}
                  placeholder="e.g. ADMA20260008"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-800">Name</span>
                <input
                  value={nameQuery}
                  onChange={onChangeNameQuery}
                  placeholder="e.g. Meera"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50"
              >
                Clear
              </button>
              <div className="rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
                <span className="font-semibold">{total}</span>{" "}
                result{total === 1 ? "" : "s"}
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      S. No.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Membership Number
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Address
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                  {pageMembers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-sm text-gray-600"
                      >
                        No members found. Try a different search.
                      </td>
                    </tr>
                  ) : (
                    pageMembers.map((m, idx) => (
                      <tr key={m.membership_number} className="hover:bg-blue-50/40">
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {(page - 1) * PAGE_SIZE + idx + 1}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                          {m.membership_number}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {m.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-blue-700">
                          <a
                            href={`mailto:${m.email}`}
                            className="underline decoration-blue-300 underline-offset-2 hover:decoration-blue-600"
                          >
                            {m.email}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <p>
                            {m.address_line1},{m.address_line2}
                          </p>
                          <p>
                            {m.city},{m.state},{m.postal_code},{m.country}
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {from}-{to}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {total}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>
              <div className="rounded-xl bg-gray-50 px-4 py-2 text-sm text-gray-700">
                Page{" "}
                <span className="font-semibold text-gray-900">{page}</span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">{totalPages}</span>
              </div>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MembershipModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onApply={handleApplyNow}
      />
    </div>
  );
}
