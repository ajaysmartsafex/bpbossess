import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setResults } from "../store/resultSlice";
import appwriteResult from "../appwrite/result";
import { Container } from "../components/index";
import { format, parseISO, getISOWeek, getDay, startOfISOWeek, endOfISOWeek } from "date-fns";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];



const ResultDetail = () => {

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        }
        return "";
    }, []);

    const dispatch = useDispatch();

    const { gameName: slug } = useParams();
    const gameName = decodeURIComponent(slug);

    const results = useSelector((state) => state.result?.results || []);
    const [groupedResults, setGroupedResults] = useState({});

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await appwriteResult.getResults(gameName);                
                if (response?.documents) {
                    dispatch(setResults(response.documents));
                } else {
                    console.warn("No documents found in response");
                }
            } catch (error) {
                console.error("Error fetching results:", error);
            }
        };

        fetchResults();
    }, [dispatch]);

    useEffect(() => {
        if (gameName && results.length > 0) {
            const filteredResults = results.filter(result => slugTransform(result.gameName) === gameName);

            if (filteredResults.length > 0) {
                const grouped = filteredResults.reduce((acc, result) => {
                    const date = parseISO(result.date);
                    const week = getISOWeek(date);
                    const startDate = format(startOfISOWeek(date), "dd-MM-yyyy");
                    const endDate = format(endOfISOWeek(date), "dd-MM-yyyy");
                    const dayIndex = (getDay(date) + 6) % 7;
                    const dayName = daysOfWeek[dayIndex] || "Mon";

                    if (!acc[week]) {
                        acc[week] = { startDate, endDate, days: {} };
                        daysOfWeek.forEach((day) => (acc[week].days[day] = []));
                    }

                    acc[week].days[dayName].push({
                        firstD: result.firstD || "*",
                        secondD: result.secondD || "*",
                        thirdD: result.thirdD || "*",
                        fourD: result.fourD || "*",
                        fiveD: result.fiveD || "*",
                        sixD: result.sixD || "*",
                        sevenD: result.sevenD || "*",
                        eightD: result.eightD || "*",
                    });

                    return acc;
                }, {});

                Object.keys(grouped).forEach((week) => {
                    daysOfWeek.forEach((day) => {
                        if (grouped[week].days[day].length === 0) {
                            grouped[week].days[day].push({
                                firstD: "*",
                                secondD: "*",
                                thirdD: "*",
                                fourD: "*",
                                fiveD: "*",
                                sixD: "*",
                                sevenD: "*",
                                eightD: "*",
                            });
                        }
                    });
                });

                setGroupedResults(grouped);
            } else {
                console.warn("No results found for gameName:", gameName);
                setGroupedResults({});
            }
        }
    }, [gameName, results]);

    return (
      <div className="py-8">
        <Container>
          <h2 className="text-xl font-bold mb-4 uppercase">
            {gameName} PANEL CHART
          </h2>
          
          {Object.keys(groupedResults).length > 0 ? (
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-4 py-2">Date</th>
                  {daysOfWeek.map((day) => (
                    <th key={day} className="border border-gray-400 px-4 py-2">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedResults).map(([week, data]) => (
                  <React.Fragment key={week}>
                    <tr className="bg-gray-100">
                      <td className="border border-gray-400 px-4 py-2 font-bold text-center">
                        {data.startDate} <br /> to <br /> {data.endDate}
                      </td>
                      {daysOfWeek.map((day) => (
                        <td
                          key={`${week}-${day}`}
                          className="border border-gray-400 px-4 py-2 text-center"
                        >
                          {data.days[day]?.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2 text-center w-full">
                              <div className="left-digits flex flex-col items-center">
                                {data.days[day].map((entry, index) => (
                                  <div key={`left-${week}-${day}-${index}`}>
                                    <p>{entry.firstD}</p>
                                    <p>{entry.secondD}</p>
                                    <p>{entry.thirdD}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="mid-digits font-bold flex items-center justify-center min-h-[60px]">
                                {data.days[day].map((entry, index) => (
                                  <div key={`mid-${week}-${day}-${index}`}>
                                    <span>{entry.fourD}</span>
                                    <span>{entry.fiveD}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="right-digits flex flex-col items-center">
                                {data.days[day].map((entry, index) => (
                                  <div key={`right-${week}-${day}-${index}`}>
                                    <p>{entry.sixD}</p>
                                    <p>{entry.sevenD}</p>
                                    <p>{entry.eightD}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            "*"
                          )}
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No results available</p>
          )}
        </Container>
      </div>
    );
};

export default ResultDetail;
