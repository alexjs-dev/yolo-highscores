import { useState, useEffect, useCallback } from "react";

const LOGO_URL =
  "https://igamingidol.com/wp-content/uploads/2022/03/Yolo-Logo-Black-.png";

const PASSWORD = "yolo1";

const API_URL = "/api/save";

export default function Home() {
  const [email, setEmail] = useState("");
  const [score, setScore] = useState("");
  const [password, setPassword] = useState("");
  const [entries, setEntries] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== PASSWORD) {
      alert("Wrong password");
      return;
    }
    try {
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

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error(error);
    }

    setEntries([...entries, { email, score }]);
    setEmail("");
    setScore("");
    setPassword("");
  };

  const sortedEntries = entries.sort((a, b) => b.score - a.score).slice(0, 5);

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
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
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
              className="w-full px-4 py-2 font-bold text-white rounded bg-gradient-to-r from-blue-400 to-indigo-600 hover:from-blue-500 hover:to-indigo-700"
            >
              Submit
            </button>
          </form>
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Top 5 Emails</h2>
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
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedEntries.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* hide some parts of the email */}
                      <div className="text-sm text-gray-900">{`${entry.email.slice(
                        0,
                        3
                      )}...${entry.email.slice(
                        entry.email.indexOf("@"),
                        entry.email.length
                      )}`}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
