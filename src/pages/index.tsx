import { useState, useEffect, useCallback } from "react";
import classNames from "classnames";

const LOGO_URL =
  "https://igamingidol.com/wp-content/uploads/2022/03/Yolo-Logo-Black-.png";

const PASSWORD = "yolo1";

const API_URL = "/api/save";

export default function Home() {
  const [email, setEmail] = useState("");
  const [score, setScore] = useState("");
  const [password, setPassword] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEmailsHidden, setIsEmailsHidden] = useState(true);

  const fetchScores = useCallback(async () => {
    try {
      const response = await fetch("/api/get-scores");

      if (!response.ok) {
        throw new Error("Error fetching scores");
      }

      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    if (password !== PASSWORD) {
      alert("Wrong password");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, score }),
      });

      if (!response.ok) {
        throw new Error("Error saving data");
      }

      await response.json();

      // @ts-ignore
      setEntries([...entries, { email, score }]);
      setEmail("");
      setScore("");
      setPassword("");
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const sortedEntries = entries
    .sort((a: any, b: any) => b.score - a.score)
    // filter out duplicate entries (same email) and only keep the highest score
    .filter(
      (entry: any, index: number, self: any) =>
        index === self.findIndex((t: any) => t.email === entry.email)
    )
    .slice(0, 3);

  return (
    <div className="flex flex-col justify-center min-h-screen py-6 bg-gray-100 sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 transform -skew-y-6 shadow-lg bg-gradient-to-r from-blue-400 to-indigo-600 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div
          className="relative px-4 pt-10 pb-10 bg-white shadow-lg sm:rounded-3xl"
          style={{
            minWidth: "500px",
          }}
        >
          <img src={LOGO_URL} alt="logo" className="w-40 mx-auto" />
          <h1 className="my-2 text-2xl font-bold text-center text-black">
            Submit your score!
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full p-2 mt-1 text-black border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label
                htmlFor="score"
                className="block text-sm font-medium text-gray-700"
              >
                Score
              </label>
              <input
                type="number"
                id="score"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
                className="block w-full p-2 mt-1 text-black border border-gray-300 rounded-md bg-gray-50"
              />
              {/* password field */}
              <div className="mt-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  API KEY
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full p-2 mt-1 text-black border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
            </div>
            <button
              type="submit"
              className={classNames(
                "w-full px-4 py-2 font-bold text-white rounded bg-gradient-to-r from-blue-400 to-indigo-600 hover:from-blue-500 hover:to-indigo-700",
                {
                  "cursor-not-allowed opacity-50": loading,
                }
              )}
            >
              Submit
            </button>
          </form>
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Top 3</h2>
            <table className="min-w-full mt-4 divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Score
                  </th>
                </tr>
              </thead>
              <tbody
                className="transition-all bg-white divide-y divide-gray-200 hover:opacity-50"
                onClick={() => {
                  setIsEmailsHidden(!isEmailsHidden);
                }}
              >
                {sortedEntries.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* @ts-ignore */}
                      <div className="text-sm text-gray-900">
                        {isEmailsHidden
                          ? /* @ts-ignore */
                            `${entry.email.slice(
                              0,
                              3
                              /* @ts-ignore */
                            )}...${entry.email.slice(
                              /* @ts-ignore */
                              entry.email.indexOf("@"),
                              /* @ts-ignore */
                              entry.email.length
                            )}`
                          : /* @ts-ignore */
                            entry.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* @ts-ignore */}
                      <div className="text-sm text-gray-900">{entry.score}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
